import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Plus, Send, Search, Users, Wifi, WifiOff, Hash, RefreshCcw, MessageCircle, X, MoreVertical } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createRoomApiHandler, getRoomListApiHandler } from "../../services/api.service";
import type { DirectMessage, DmTargetUser, Message, RoomListItem, RoomUser } from "../../constants/interface";
import type { DmHistoryPayload, RoomJoinedPayload, UiRoom } from "../../types";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const mapRoomListItemToUiRoom = (room: RoomListItem): UiRoom => ({
  id: String(room.id),
  roomId: room.id,
  name: room.name,
  language: room.language,
  slug: toSlug(room.name),
  visibility: room.visibility,
  description: room.description || undefined,
  createdAt: new Date().toISOString(),
});

function LiveRooms() {
  const { user, isAuthenticated } = useAuth();

  // Room state
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [selectedUiRoomId, setSelectedUiRoomId] = useState<string | null>(null);
  const [joinedRoomIds, setJoinedRoomIds] = useState<Set<number>>(new Set());

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // DM state
  const [chatMode, setChatMode] = useState<"room" | "dm">("room");
  const [dmTarget, setDmTarget] = useState<DmTargetUser | null>(null);
  const [dmMessages, setDmMessages] = useState<DirectMessage[]>([]);
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);

  // Socket and UI state
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Create room state
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [language, setLanguage] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [capacity, setCapacity] = useState("100");
  const [creating, setCreating] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedUiRoomId) || null,
    [rooms, selectedUiRoomId]
  );

  const filteredRooms = useMemo(() => {
    const key = searchTerm.trim().toLowerCase();
    if (!key) return rooms;

    return rooms.filter((room) => {
      return (
        room.name.toLowerCase().includes(key) ||
        room.language.toLowerCase().includes(key) ||
        String(room.roomId).includes(key) ||
        (room.slug || "").toLowerCase().includes(key)
      );
    });
  }, [rooms, searchTerm]);

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) {
      setRooms([]);
      setSelectedUiRoomId(null);
      return;
    }

    setLoadingRooms(true);
    try {
      const result = await getRoomListApiHandler();
      const fetchedRooms = (result.data || []).map(mapRoomListItemToUiRoom);

      setRooms(fetchedRooms);
      setSelectedUiRoomId((prev) => {
        if (prev && fetchedRooms.some((room) => room.id === prev)) {
          return prev;
        }
        return fetchedRooms[0]?.id || null;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load rooms";
      setSocketError(message);
      setRooms([]);
      setSelectedUiRoomId(null);
    } finally {
      setLoadingRooms(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  // Socket connection and listeners
  useEffect(() => {
    const socket = io("http://localhost:4713/", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setSocketError("");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("socket:error", (payload: { code?: string; message?: string }) => {
      setSocketError(payload?.message || "Socket error");
    });

    // Room events
    socket.on("room:joined", (payload: RoomJoinedPayload) => {
      setSocketError("");
      setRoomUsers(payload.users || []);
      setMessages(payload.messages || []);
      setJoinedRoomIds((prev) => {
        const next = new Set(prev);
        next.add(payload.room.id);
        return next;
      });
      setChatMode("room");
      setDmTarget(null);
    });

    socket.on("room:user_joined", (joinedUser: RoomUser) => {
      setRoomUsers((prev) => {
        const exists = prev.some((u) => String(u.userId) === String(joinedUser.userId));
        return exists ? prev : [...prev, joinedUser];
      });
    });

    socket.on("room:user_left", (leftUser: RoomUser) => {
      setRoomUsers((prev) => prev.filter((u) => String(u.userId) !== String(leftUser.userId)));
    });

    socket.on("chat:new", (incoming: Message) => {
      setMessages((prev) => [...prev, incoming]);
    });

    // DM events
    socket.on("dm:history", (payload: DmHistoryPayload) => {
      setSocketError("");
      setChatMode("dm");
      setDmTarget(payload.target);
      setDmMessages(payload.messages || []);
    });

    socket.on("dm:new", (incoming: DirectMessage) => {
      setDmMessages((prev) => [...prev, incoming]);
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  const resetRoomUi = () => {
    setMessages([]);
    setRoomUsers([]);
    setSocketError("");
  };

  const joinRoom = (room: UiRoom) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      setSocketError("Socket is not connected");
      return;
    }

    setSelectedUiRoomId(room.id);
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    resetRoomUi();
    socket.emit("room:join", { roomId: room.roomId });
  };

  const openDmWithUser = (target: RoomUser) => {
    const socket = socketRef.current;
    const roomId = selectedRoom?.roomId;

    if (!socket || !socket.connected) {
      setSocketError("Socket is not connected");
      return;
    }

    if (!roomId) {
      setSocketError("Join a room first to start direct message");
      return;
    }

    // Set DM mode immediately with target user
    setDmTarget(target);
    setChatMode("dm");
    setDmMessages([]);
    setShowUsersDropdown(false);

    // Emit request to load DM history from server
    socket.emit("dm:history", { roomId, targetUserId: Number(target.userId) });
  };

  const closeDm = () => {
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    setShowUsersDropdown(false);
  };

  const leaveRoom = () => {
    const socket = socketRef.current;
    const roomId = selectedRoom?.roomId;

    if (!socket || !socket.connected || !roomId) {
      setSocketError("Not connected to room");
      return;
    }

    socket.emit("room:leave", { roomId });
    setJoinedRoomIds((prev) => {
      const next = new Set(prev);
      next.delete(roomId);
      return next;
    });
    setMessages([]);
    setRoomUsers([]);
    setChatMode("room");
    setDmTarget(null);
    setShowRoomMenu(false);
  };

  const leaveRoomFromCard = (roomId: number) => {
    const socket = socketRef.current;

    if (!socket || !socket.connected) {
      setSocketError("Not connected");
      return;
    }

    socket.emit("room:leave", { roomId });
    setJoinedRoomIds((prev) => {
      const next = new Set(prev);
      next.delete(roomId);
      return next;
    });

    // If this was the currently selected room, clear its data
    if (selectedRoom?.roomId === roomId) {
      setMessages([]);
      setRoomUsers([]);
      setChatMode("room");
      setDmTarget(null);
    }
  };

  const createRoom = async () => {
    if (!isAuthenticated) {
      setSocketError("Please login first to create rooms.");
      return;
    }

    const normalizedName = roomName.trim();
    const normalizedLanguage = language.trim();
    const normalizedCapacity = Number(capacity);

    if (!normalizedName || !normalizedLanguage || !Number.isInteger(normalizedCapacity) || normalizedCapacity <= 0) {
      setSocketError("Name, language and positive capacity are required.");
      return;
    }

    setCreating(true);
    setSocketError("");

    try {
      const response = await createRoomApiHandler({
        slug: toSlug(normalizedName),
        roomName: normalizedName,
        language: normalizedLanguage,
        visibility,
        capacity: normalizedCapacity,
      });

      if (!response.success || !response.room) {
        throw new Error(response.message || "Create room failed");
      }

      const createdRoom: UiRoom = {
        id: String(response.room.id),
        roomId: response.room.id,
        name: response.room.name,
        language: response.room.language,
        slug: response.room.slug,
        visibility: response.room.visibility,
        capacity: response.room.capacity,
        description: "Created room",
        createdAt: new Date().toISOString(),
      };

      setRooms((prev) => {
        const withoutSame = prev.filter((room) => room.roomId !== createdRoom.roomId);
        return [createdRoom, ...withoutSame];
      });
      setSelectedUiRoomId(String(createdRoom.roomId));
      setChatMode("room");
      setDmTarget(null);
      setDmMessages([]);
      resetRoomUi();
      const socket = socketRef.current;
      if (socket && socket.connected) {
        socket.emit("room:join", { roomId: createdRoom.roomId });
      }

      setShowCreate(false);
      setRoomName("");
      setLanguage("");
      setVisibility("public");
      setCapacity("100");

      // Sync with server list so every recent room is shown.
      void fetchRooms();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Create room failed";
      setSocketError(message);
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    const activeRoomId = selectedRoom?.roomId;
    const text = messageInput.trim();

    if (!socket || !socket.connected || !activeRoomId || !text) return;

    socket.emit("chat:send", { roomId: activeRoomId, text });
    setMessageInput("");
  };

  const sendDirectMessage = () => {
    const socket = socketRef.current;
    const roomId = selectedRoom?.roomId;
    const text = messageInput.trim();

    if (!socket || !socket.connected || !roomId || !dmTarget || !text) return;

    socket.emit("dm:send", {
      roomId,
      targetUserId: Number(dmTarget.userId),
      text,
    });

    setMessageInput("");
  };

  return (
    <section className="min-h-[calc(100vh-88px)] bg-[radial-gradient(circle_at_20%_10%,#fde68a_0%,transparent_30%),radial-gradient(circle_at_80%_0%,#93c5fd_0%,transparent_35%),radial-gradient(circle_at_50%_100%,#bbf7d0_0%,transparent_30%),#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                CultureConnect Live Rooms
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Rooms are now shared from server. Create, search, and join instantly.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isConnected ? "Socket Connected" : "Socket Disconnected"}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur overflow-hidden">
            <div className="border-b border-slate-100 p-4">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search size={16} className="text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by room name, slug, or room ID"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCreate((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  <Plus size={16} />
                  {showCreate ? "Close" : "Create"}
                </button>
                <button
                  onClick={() => void fetchRooms()}
                  disabled={loadingRooms}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <RefreshCcw size={16} />
                  {loadingRooms ? "Loading" : "Refresh"}
                </button>
              </div>
            </div>

            {showCreate && (
              <div className="border-b border-slate-100 bg-amber-50/70 p-4 space-y-2">
                <input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room Name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Language"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="public">public</option>
                    <option value="private">private</option>
                  </select>
                  <input
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Capacity"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={createRoom}
                  disabled={creating}
                  className="w-full rounded-lg bg-orange-500 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Room"}
                </button>
              </div>
            )}

            <div className="max-h-[65vh] overflow-y-auto p-2">
              {filteredRooms.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No matching rooms. Try refresh or create one.
                </p>
              ) : (
                filteredRooms.map((room) => {
                  const active = room.id === selectedUiRoomId;
                  const isJoined = joinedRoomIds.has(room.roomId);
                  return (
                    <div
                      key={room.id}
                      className={`mb-2 rounded-xl border p-3 transition ${
                        active
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => setSelectedUiRoomId(room.id)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm font-bold text-slate-800">{room.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Hash size={12} /> {room.roomId}
                            </span>
                            <span>{room.language}</span>
                            {room.slug ? <span>slug: {room.slug}</span> : null}
                          </div>
                        </button>

                        {isJoined ? (
                          <button
                            onClick={() => leaveRoomFromCard(room.roomId)}
                            className="rounded-lg px-3 py-1 text-xs font-semibold transition bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Leave
                          </button>
                        ) : (
                          <button
                            onClick={() => joinRoom(room)}
                            className="rounded-lg px-3 py-1 text-xs font-semibold transition bg-orange-500 text-white hover:bg-orange-600"
                          >
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex min-h-[72vh] flex-col">
            <div className="bg-linear-to-r from-orange-50 to-sky-50 border-b border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {chatMode === "dm" && dmTarget
                      ? `Direct Message with ${dmTarget.username}`
                      : selectedRoom
                      ? selectedRoom.name
                      : "Select a room"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {chatMode === "dm" && dmTarget
                      ? `Private conversation • ${dmTarget.country}`
                      : selectedRoom
                      ? `Room ID ${selectedRoom.roomId} • ${roomUsers.length} online`
                      : "Pick a room from left panel to join"}
                  </p>
                </div>

                {chatMode === "room" && selectedRoom && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 transition"
                        title="Online users"
                      >
                        <Users size={20} className="text-slate-700" />
                      </button>

                      {showUsersDropdown && chatMode === "room" && (
                        <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-50">
                          <div className="p-2 border-b border-slate-100">
                            <p className="text-xs font-semibold text-slate-600 px-2">Online Users ({roomUsers.length})</p>
                          </div>
                          <div className="max-h-75 overflow-y-auto">
                            {roomUsers.length === 0 ? (
                              <p className="text-xs text-slate-500 p-3">No users online</p>
                            ) : (
                              roomUsers.map((ru) => (
                                <button
                                  key={`${ru.userId}-${ru.username}`}
                                  onClick={() => {
                                    openDmWithUser(ru);
                                    setShowUsersDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50 transition flex items-center gap-2"
                                >
                                  <MessageCircle size={14} className="text-orange-500" />
                                  <div>
                                    <p className="font-medium text-slate-800">{ru.username}</p>
                                    <p className="text-xs text-slate-500">{ru.country}</p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowRoomMenu(!showRoomMenu)}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 transition"
                        title="Room options"
                      >
                        <MoreVertical size={20} className="text-slate-700" />
                      </button>

                      {showRoomMenu && (
                        <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-40">
                          <button
                            onClick={leaveRoom}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <X size={14} />
                            Leave Room
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {chatMode === "dm" && (
                  <button
                    onClick={closeDm}
                    className="rounded-full p-2 hover:bg-slate-200"
                  >
                    <X size={20} className="text-slate-600" />
                  </button>
                )}
              </div>
              {socketError ? (
                <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {socketError}
                </p>
              ) : null}
            </div>

            <div className="h-96 overflow-y-auto bg-slate-50 p-4 space-y-3">
              {chatMode === "dm" ? (
                dmMessages.length === 0 ? (
                  <div className="grid h-full min-h-60 place-items-center text-sm text-slate-400">
                    No direct messages yet. Start a conversation.
                  </div>
                ) : (
                  dmMessages.map((msg) => {
                    const isFromOtherUser = msg.senderUserId === Number(dmTarget?.userId);
                    return (
                      <div key={msg.id} className={`flex ${isFromOtherUser ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                            isFromOtherUser ? "bg-white text-slate-800" : "bg-slate-900 text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="mt-1 text-[10px] opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )
              ) : messages.length === 0 ? (
                <div className="grid h-full min-h-60 place-items-center text-sm text-slate-400">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isFromCurrentUser = msg.username === user?.username;
                  return (
                    <div
                      key={`${msg.timestamp}-${index}`}
                      className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                          isFromCurrentUser ? "bg-slate-900 text-white" : "bg-white text-slate-800"
                        }`}
                      >
                        <p className="mb-1 text-xs opacity-70">{msg.username}</p>
                        <p className="text-sm">{msg.text}</p>
                        <p className="mt-1 text-[10px] opacity-60">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (chatMode === "dm") {
                        sendDirectMessage();
                      } else {
                        sendMessage();
                      }
                    }
                  }}
                  placeholder={chatMode === "dm" ? "Type a direct message..." : "Type your message..."}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={chatMode === "dm" ? sendDirectMessage : sendMessage}
                  disabled={!isConnected || !selectedRoom}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  {chatMode === "dm" ? "Send DM" : "Send"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default LiveRooms;
