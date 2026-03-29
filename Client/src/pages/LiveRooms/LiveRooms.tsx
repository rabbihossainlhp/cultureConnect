import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Plus, Send, Search, Users, Wifi, WifiOff, Hash, RefreshCcw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createRoomApiHandler, getRoomListApiHandler } from "../../services/api.service";
import type { Message, RoomListItem, RoomUser } from "../../constants/interface";
import type { RoomJoinedPayload, UiRoom } from "../../types";

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

  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [selectedUiRoomId, setSelectedUiRoomId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [language, setLanguage] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [capacity, setCapacity] = useState("100");
  const [creating, setCreating] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const selectedRoomIdRef = useRef<number | null>(null);

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

  useEffect(() => {
    const socket = io("http://localhost:4713/", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setSocketError("");

      if (selectedRoomIdRef.current) {
        socket.emit("room:join", { roomId: selectedRoomIdRef.current });
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("socket:error", (payload: { code?: string; message?: string }) => {
      setSocketError(payload?.message || "Socket error");
    });

    socket.on("room:joined", (payload: RoomJoinedPayload) => {
      setSocketError("");
      setRoomUsers(payload.users || []);
      setMessages(payload.messages || []);
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

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const nextRoomId = selectedRoom?.roomId ?? null;
    const prevRoomId = selectedRoomIdRef.current;

    if (prevRoomId && prevRoomId !== nextRoomId) {
      socket.emit("room:leave", { roomId: prevRoomId });
    }

    if (!nextRoomId) {
      selectedRoomIdRef.current = null;
      return;
    }

    selectedRoomIdRef.current = nextRoomId;
    if (socket.connected) {
      socket.emit("room:join", { roomId: nextRoomId });
    }
  }, [selectedRoom?.roomId]);

  const resetRoomUi = () => {
    setMessages([]);
    setRoomUsers([]);
    setSocketError("");
  };

  const selectRoom = (roomCardId: string | null) => {
    setSelectedUiRoomId(roomCardId);
    resetRoomUi();
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
      selectRoom(String(createdRoom.roomId));

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
                  return (
                    <div
                      key={room.id}
                      className={`mb-2 rounded-xl border p-3 transition ${
                        active
                          ? "border-orange-300 bg-orange-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <button onClick={() => selectRoom(room.id)} className="w-full text-left">
                        <p className="text-sm font-bold text-slate-800">{room.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Hash size={12} /> {room.roomId}
                          </span>
                          <span>{room.language}</span>
                          {room.slug ? <span>slug: {room.slug}</span> : null}
                        </div>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex min-h-[72vh] flex-col">
            <div className="bg-linear-to-r from-orange-50 to-sky-50 border-b border-slate-100 p-4">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                {selectedRoom ? selectedRoom.name : "Select a room"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {selectedRoom
                  ? `Room ID ${selectedRoom.roomId} • ${roomUsers.length} online`
                  : "Pick a room from left panel to join"}
              </p>
              {socketError ? (
                <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {socketError}
                </p>
              ) : null}
            </div>

            <div className="min-h-60 flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="grid h-full min-h-60 place-items-center text-sm text-slate-400">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                messages.map((msg, index) => {
                  const mine =
                    String(msg.userId) === String(user?.email) || msg.username === user?.username;

                  return (
                    <div
                      key={`${msg.timestamp}-${index}`}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                          mine ? "bg-slate-900 text-white" : "bg-white text-slate-800"
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

            <div className="border-t border-slate-100 bg-white px-4 py-3">
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-slate-600">
                <Users size={14} />
                Online ({roomUsers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {roomUsers.map((ru) => (
                  <span
                    key={`${ru.userId}-${ru.username}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                  >
                    {ru.username} • {ru.country}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!isConnected || !selectedRoom}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  Send
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
