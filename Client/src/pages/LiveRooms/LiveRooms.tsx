import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Plus, Send, Users, Wifi, WifiOff, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { Message, RoomUser } from "../../constants/interface";
import type { RoomJoinedPayload, UiRoom } from "../../types";

const ROOMS_STORAGE_KEY = "cc_live_rooms_v1";

const readRooms = (): UiRoom[] => {
  try {
    const raw = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as UiRoom[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
};

const saveRooms = (rooms: UiRoom[]) => {
  localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function LiveRooms() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState<UiRoom[]>(() => readRooms());
  const [selectedUiRoomId, setSelectedUiRoomId] = useState<string | null>(() => {
    const initialRooms = readRooms();
    return initialRooms[0]?.id || null;
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [newRoomId, setNewRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const selectedRoomIdRef = useRef<number | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedUiRoomId) || null,
    [rooms, selectedUiRoomId]
  );

  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

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
        const exists = prev.some(
          (item) => String(item.userId) === String(joinedUser.userId)
        );

        if (exists) return prev;
        return [...prev, joinedUser];
      });
    });

    socket.on("room:user_left", (leftUser: RoomUser) => {
      setRoomUsers((prev) =>
        prev.filter((item) => String(item.userId) !== String(leftUser.userId))
      );
    });

    socket.on("chat:new", (message: Message) => {
      setMessages((prev) => [...prev, message]);
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

    if (nextRoomId) {
      selectedRoomIdRef.current = nextRoomId;
      if (socket.connected) {
        socket.emit("room:join", { roomId: nextRoomId });
      }
      return;
    }

    selectedRoomIdRef.current = null;
  }, [selectedRoom?.roomId]);

  const resetRoomUi = () => {
    setMessages([]);
    setRoomUsers([]);
    setSocketError("");
  };

  const selectRoomCard = (roomCardId: string | null) => {
    setSelectedUiRoomId(roomCardId);
    resetRoomUi();
  };

  const createRoomCard = () => {
    const roomIdNum = Number(newRoomId);

    if (!Number.isInteger(roomIdNum) || roomIdNum <= 0) {
      setSocketError("Room ID must be a positive number from backend rooms table.");
      return;
    }

    if (!newRoomName.trim()) {
      setSocketError("Room name is required.");
      return;
    }

    const created: UiRoom = {
      id: makeId(),
      roomId: roomIdNum,
      name: newRoomName.trim(),
      language: newLanguage.trim() || "Unknown",
      description: newDescription.trim(),
      createdAt: new Date().toISOString(),
    };

    setRooms((prev) => [created, ...prev]);
    selectRoomCard(created.id);

    setShowCreate(false);
    setNewRoomId("");
    setNewRoomName("");
    setNewLanguage("");
    setNewDescription("");
  };

  const removeRoomCard = (roomCardId: string) => {
    setRooms((prev) => {
      const next = prev.filter((item) => item.id !== roomCardId);

      if (selectedUiRoomId === roomCardId) {
        selectRoomCard(next[0]?.id || null);
      }

      return next;
    });
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    const roomId = selectedRoom?.roomId;
    const text = messageInput.trim();

    if (!socket || !socket.connected || !roomId || !text) return;

    socket.emit("chat:send", {
      roomId,
      text,
    });

    setMessageInput("");
  };

  return (
    <section className="min-h-[calc(100vh-88px)] bg-[radial-gradient(circle_at_10%_10%,#fef3c7_0%,transparent_40%),radial-gradient(circle_at_80%_0%,#bfdbfe_0%,transparent_35%),#f8fafc]">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-800">Live Rooms</h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {isConnected ? "Connected" : "Disconnected"}
                </p>
              </div>
              <button
                onClick={() => setShowCreate((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            {showCreate && (
              <div className="p-4 border-b border-slate-100 bg-amber-50/60 space-y-2">
                <input
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  placeholder="Backend Room ID (number)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Display Name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Language"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={createRoomCard}
                  className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
                >
                  Create Room Card
                </button>
              </div>
            )}

            <div className="max-h-[60vh] overflow-y-auto">
              {rooms.length === 0 && (
                <p className="p-4 text-sm text-slate-500">
                  No room cards yet. Click Add and enter a backend room id.
                </p>
              )}

              {rooms.map((room) => {
                const active = room.id === selectedUiRoomId;

                return (
                  <div
                    key={room.id}
                    className={`group border-l-4 ${
                      active
                        ? "border-orange-500 bg-orange-50"
                        : "border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <button
                      onClick={() => selectRoomCard(room.id)}
                      className="w-full px-4 py-3 text-left"
                    >
                      <p className="font-semibold text-sm text-slate-800">{room.name}</p>
                      <p className="text-xs text-slate-500 mt-1">ID {room.roomId} • {room.language}</p>
                    </button>

                    <div className="px-4 pb-3">
                      <button
                        onClick={() => removeRoomCard(room.id)}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[70vh]">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-sky-50">
              <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-800">
                {selectedRoom ? selectedRoom.name : "Select a room"}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {selectedRoom
                  ? `Backend Room ID: ${selectedRoom.roomId} • ${roomUsers.length} online`
                  : "Create or choose a room card to connect"}
              </p>
              {socketError && (
                <p className="mt-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                  {socketError}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.length === 0 ? (
                <div className="h-full min-h-[240px] grid place-items-center text-slate-400 text-sm">
                  No messages yet
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
                        <p className="text-xs opacity-70 mb-1">{msg.username}</p>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[10px] opacity-60 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-white">
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                <Users size={14} />
                Online ({roomUsers.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {roomUsers.map((roomUser) => (
                  <span
                    key={`${roomUser.userId}-${roomUser.username}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
                  >
                    {roomUser.username} • {roomUser.country}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
