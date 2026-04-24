import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Plus, Send, Search, Users, RefreshCcw, MessageCircle, X, MoreVertical, Hash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createRoomApiHandler, getRoomListApiHandler } from "../../services/api.service";
import type { DirectMessage, DirectMessageResponse, DmTargetUser, Message, RoomListItem, RoomUser } from "../../constants/interface";
import type { DmHistoryPayload, RoomJoinedPayload, UiRoom } from "../../types";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const formatMessageTime = (timestamp: string | Date | undefined): string => {
  if (!timestamp) return "Just now";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp:", timestamp);
      return "Just now";
    }
    return date.toLocaleString();
  } catch (error) {
    console.error("Date parsing error:", error, timestamp);
    return "Just now";
  }
};

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

  // DM state - Load from localStorage on mount
  const [chatMode, setChatMode] = useState<"room" | "dm">("room");
  const [dmTarget, setDmTarget] = useState<DmTargetUser | null>(null);
  const [dmMessages, setDmMessages] = useState<DirectMessage[]>([]);
  const [dmConversations, setDmConversations] = useState<Map<number, { user: DmTargetUser; lastMessage: string; timestamp: string }>>(() => {
    try {
      const saved = localStorage.getItem("dmConversations");
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Map(parsed);
      }
    } catch (error) {
      console.error("Error loading dmConversations from localStorage:", error);
    }
    return new Map();
  });
  const [unreadDmCount, setUnreadDmCount] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("unreadDmCount");
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      }
    } catch (error) {
      console.error("Error loading unreadDmCount from localStorage:", error);
    }
    return new Set();
  });
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"rooms" | "dms">("rooms");

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
  const [roomPassword, setRoomPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingRoomJoin, setPendingRoomJoin] = useState<UiRoom | null>(null);
  const [joinPassword, setJoinPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ REFS: Keep current state for socket event handlers (avoid closure bugs)
  const dmTargetRef = useRef<DmTargetUser | null>(null);
  const currentUserIdRef = useRef<number | typeof NaN>(NaN);
  const dmMessagesRef = useRef<DirectMessage[]>([]);
  const dmConversationsRef = useRef<Map<number, { user: DmTargetUser; lastMessage: string; timestamp: string }>>(new Map());
  const unreadDmCountRef = useRef<Set<number>>(new Set());

  // ✅ Sync refs with state to keep them fresh
  useEffect(() => {
    dmTargetRef.current = dmTarget;
  }, [dmTarget]);

  useEffect(() => {
    currentUserIdRef.current = user?.id ? Number(user.id) : NaN;
  }, [user?.id]);

  useEffect(() => {
    dmMessagesRef.current = dmMessages;
  }, [dmMessages]);

  useEffect(() => {
    dmConversationsRef.current = dmConversations;
  }, [dmConversations]);

  useEffect(() => {
    unreadDmCountRef.current = unreadDmCount;
  }, [unreadDmCount]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      }, 0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [dmMessages]);

  useEffect(() => {
    try {
      const data = Array.from(dmConversations.entries());
      localStorage.setItem("dmConversations", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving dmConversations to localStorage:", error);
    }
  }, [dmConversations]);

  useEffect(() => {
    try {
      const data = Array.from(unreadDmCount);
      localStorage.setItem("unreadDmCount", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving unreadDmCount to localStorage:", error);
    }
  }, [unreadDmCount]);

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
    const socket = io("http://localhost:4713", {
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
      if (payload?.code === "PASSWORD REQURIED" || payload?.code === "PASSWORD REQUIRED") {
        setPasswordError("This room requires a password");
        if (!showPasswordModal) {
          setShowPasswordModal(true);
        }
      } else if (payload?.code?.includes("PASSWORD") || payload?.message?.includes("Password")) {
        setPasswordError(payload?.message || "Invalid password");
        setJoinPassword("");
      } else {
        setSocketError(payload?.message || "Socket error");
      }
    });

    socket.on("room:joined", (payload: RoomJoinedPayload) => {
      setSocketError("");
      setRoomUsers(payload.users || []);
      setMessages(payload.messages || []);
      setSelectedUiRoomId(String(payload.room.id));
      setJoinedRoomIds((prev) => {
        const next = new Set(prev);
        next.add(payload.room.id);
        return next;
      });
      setChatMode("room");
      setDmTarget(null);
      setDmMessages([]);
    });

    socket.on("room:messages", (payload: { roomId: number; messages: Message[] }) => {
      setMessages(payload.messages || []);
      setSocketError("");
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

    socket.on("dm:history", (payload: DmHistoryPayload) => {
      console.log("📨 DM History received:", payload);
      setSocketError("");
      setChatMode("dm");
      setDmTarget(payload.target);
      setDmMessages(payload.messages || []);

      if (payload.target) {
        setUnreadDmCount((prev) => {
          const next = new Set(prev);
          next.delete(Number(payload.target.userId));
          localStorage.setItem("unreadDmCount", JSON.stringify([...next]));
          return next;
        });
      }

      if (payload.target) {
        setDmConversations((prev) => {
          const updated = new Map(prev);
          const lastMsg = payload.messages && payload.messages.length > 0 ? payload.messages[payload.messages.length - 1] : null;
          const lastMessageText = lastMsg ? ((lastMsg as DirectMessageResponse).message_text || lastMsg.text || "Message") : "Started conversation";
          const lastTimestamp = lastMsg ? ((lastMsg as DirectMessageResponse).created_at || lastMsg.timestamp || new Date().toISOString()) : new Date().toISOString();
          updated.set(Number(payload.target.userId), {
            user: payload.target,
            lastMessage: lastMessageText,
            timestamp: lastTimestamp,
          });
          return updated;
        });
      }
    });

    // ✅ FIXED: dm:new handler – uses refs to get current dmTarget and user ID
    socket.on("dm:new", (incoming: DirectMessageResponse) => {
      console.log("New DM received:", incoming);

      let senderUserId: number | null = incoming.sender_user_id || incoming.senderUserId;
      senderUserId = senderUserId ? Number(senderUserId) : null;

      let receiverUserId: number | null = incoming.receiver_user_id || incoming.receiverUserId;
      receiverUserId = receiverUserId ? Number(receiverUserId) : null;

      let currentUserId = currentUserIdRef.current; // use the ref instead of closure variable
      if (isNaN(currentUserId)) {
        // fallback inference (optional)
        const target = dmTargetRef.current;
        if (target) {
          const targetUserId = Number(target.userId);
          if (senderUserId === targetUserId && receiverUserId) currentUserId = receiverUserId;
          else if (receiverUserId === targetUserId && senderUserId) currentUserId = senderUserId;
        }
      }

      const isCurrentUserReceiver = receiverUserId === currentUserId;
      const otherUserId = isCurrentUserReceiver ? senderUserId : receiverUserId;
      const currentDmTarget = dmTargetRef.current; // ← fresh value

      const isViewingThisConversation =
        currentDmTarget &&
        (currentDmTarget.userId === String(otherUserId) || Number(currentDmTarget.userId) === otherUserId);

      const messageText = incoming.message_text || incoming.text || "Message";
      const timestamp = incoming.created_at || incoming.timestamp || new Date().toISOString();

      const senderUserInfo: DmTargetUser = {
        userId: senderUserId ?? 0,
        username: incoming.sender_username || `User ${senderUserId}`,
        country: incoming.sender_country || "",
        profile_picture: incoming.sender_profile_picture || "",
      };

      const receiverUserInfo: DmTargetUser = {
        userId: receiverUserId ?? 0,
        username: incoming.receiver_username || `User ${receiverUserId}`,
        country: incoming.receiver_country || "",
        profile_picture: incoming.receiver_profile_picture || "",
      };

      // Add message to current DM window if open for this user
      if (isViewingThisConversation) {
        setDmMessages((prev) => [...prev, incoming]);
      }

      // Update conversation list on the left panel
      if (otherUserId !== null) {
        setDmConversations((prev) => {
          const updated = new Map(prev);
          const userToStore = isCurrentUserReceiver ? senderUserInfo : receiverUserInfo;
          if (!updated.has(otherUserId)) {
            updated.set(otherUserId, {
              user: userToStore,
              lastMessage: messageText,
              timestamp: timestamp,
            });
          } else {
            const existing = updated.get(otherUserId)!;
            updated.set(otherUserId, {
              ...existing,
              lastMessage: messageText,
              timestamp: timestamp,
            });
          }
          return updated;
        });
      }

      // Manage unread badge & alert (alert only when NOT viewing)
      if (otherUserId !== null && isCurrentUserReceiver && !isViewingThisConversation) {
        setUnreadDmCount((prev) => {
          const next = new Set(prev);
          next.add(otherUserId);
          localStorage.setItem("unreadDmCount", JSON.stringify([...next]));
          return next;
        });

        const senderName = senderUserInfo.username || `User ${senderUserId}`;
        const notificationMsg = `📨 New message from ${senderName}: "${messageText.substring(0, 50)}${messageText.length > 50 ? "..." : ""}"`;
        console.log("🔔 SHOWING NOTIFICATION:", notificationMsg);
        alert(notificationMsg);
      } else if (otherUserId !== null && isViewingThisConversation && isCurrentUserReceiver) {
        // Immediately clear unread badge for this conversation
        setUnreadDmCount((prev) => {
          const next = new Set(prev);
          next.delete(otherUserId);
          localStorage.setItem("unreadDmCount", JSON.stringify([...next]));
          return next;
        });
      }
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // dependency only on user because refs hold the rest

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

    if (room.visibility === "private") {
      setPendingRoomJoin(room);
      setShowPasswordModal(true);
      setJoinPassword("");
      setPasswordError("");
      return;
    }

    setSelectedUiRoomId(room.id);
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    resetRoomUi();
    socket.emit("room:join", { roomId: room.roomId });
  };

  const joinRoomWithPassword = (room: UiRoom, password: string) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      setPasswordError("Socket is not connected");
      return;
    }

    setSelectedUiRoomId(room.id);
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    resetRoomUi();
    socket.emit("room:join", { roomId: room.roomId, password });
    setShowPasswordModal(false);
    setJoinPassword("");
    setPasswordError("");
  };

  const openDmWithUser = (target: RoomUser | DmTargetUser) => {
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

    setDmTarget(target);
    setChatMode("dm");
    setDmMessages([]);
    setShowUsersDropdown(false);
    setViewMode("rooms");

    setUnreadDmCount((prev) => {
      const next = new Set(prev);
      next.delete(Number(target.userId));
      localStorage.setItem("unreadDmCount", JSON.stringify([...next]));
      return next;
    });

    socket.emit("dm:history", { roomId, targetUserId: Number(target.userId) });
  };

  const closeDm = () => {
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    setShowUsersDropdown(false);
    setViewMode("rooms");
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

    if (visibility === "private" && !roomPassword.trim()) {
      setSocketError("Password is required for private rooms");
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
        password: visibility === "private" ? roomPassword : undefined,
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
      setRoomPassword("");

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
    <section className="h-[calc(100vh-88px)] bg-slate-900 flex flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        {/* SIDEBAR */}
        <aside className="border-r border-slate-700 bg-slate-800 overflow-hidden flex flex-col">
          <div className="border-b border-slate-700 p-3 space-y-2 shrink-0">
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rooms"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCreate((prev) => !prev)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
              >
                <Plus size={14} />
                Create
              </button>
              <button
                onClick={() => void fetchRooms()}
                disabled={loadingRooms}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-600 disabled:opacity-60"
              >
                <RefreshCcw size={14} />
                Refresh
              </button>
            </div>
          </div>

          {showCreate && (
            <div className="border-b border-slate-700 bg-slate-700/50 p-3 space-y-2 shrink-0">
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room Name"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
              />
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Language"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                  className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white"
                >
                  <option value="public">public</option>
                  <option value="private">private</option>
                </select>
                <input
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Capacity"
                  className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                />
              </div>
              {visibility === "private" && (
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Room Password"
                  className="w-full rounded-lg border border-orange-500 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400"
                />
              )}
              <button
                onClick={createRoom}
                disabled={creating}
                className="w-full rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          )}

          <div className="border-b border-slate-700 bg-slate-800 flex gap-0 shrink-0">
            <button
              onClick={() => setViewMode("rooms")}
              className={`flex-1 px-3 py-2 text-xs font-semibold border-b-2 transition ${
                viewMode === "rooms"
                  ? "border-orange-500 text-orange-400 bg-slate-700/50"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setViewMode("dms")}
              className={`flex-1 px-3 py-2 text-xs font-semibold border-b-2 transition relative ${
                viewMode === "dms"
                  ? "border-purple-500 text-purple-400 bg-slate-700/50"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              Messages
              {unreadDmCount.size > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                  {unreadDmCount.size}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            {viewMode === "rooms" ? (
              <>
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
                            onClick={() => {
                              setSelectedUiRoomId(room.id);
                              setChatMode("room");
                              setDmTarget(null);
                              setDmMessages([]);
                              const socket = socketRef.current;
                              if (socket && socket.connected && joinedRoomIds.has(room.roomId)) {
                                socket.emit("room:load", { roomId: room.roomId });
                              }
                            }}
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
              </>
            ) : (
              <>
                {dmConversations.size === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-600 p-4 text-center">
                    <MessageCircle size={24} className="mx-auto mb-2 text-slate-500" />
                    <p className="text-xs text-slate-400">No messages yet</p>
                  </div>
                ) : (
                  Array.from(dmConversations.entries())
                    .filter(([userId]) => {
                      const currentUserId = Number(user?.id);
                      const otherUserId = Number(userId);
                      return otherUserId !== currentUserId && otherUserId > 0;
                    })
                    .map(([userId, conv]) => {
                      const numericUserId = Number(userId);
                      const isUnread = unreadDmCount.has(numericUserId);
                      const isCurrentDmTarget =
                        Number(dmTarget?.userId) === numericUserId || dmTarget?.userId === String(numericUserId);
                      return (
                        <button
                          key={userId}
                          onClick={() => openDmWithUser(conv.user)}
                          className={`w-full mb-1 rounded-lg border p-2 text-left transition ${
                            isCurrentDmTarget
                              ? "border-purple-500 bg-purple-500/20"
                              : isUnread
                              ? "border-red-600/50 bg-red-900/20 hover:bg-red-900/30"
                              : "border-slate-700 bg-slate-700/30 hover:bg-slate-700/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                              <img
                                src={conv.user.profile_picture}
                                alt={conv.user.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{conv.user.username}</p>
                              <p
                                className={`text-[11px] truncate ${
                                  isUnread ? "text-red-300 font-semibold" : "text-slate-400"
                                }`}
                              >
                                {conv.lastMessage}
                              </p>
                            </div>
                            {isUnread && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>}
                          </div>
                        </button>
                      );
                    })
                )}
              </>
            )}
          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="bg-white overflow-hidden flex flex-col">
          <div className="bg-white border-b border-slate-200 p-4 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {chatMode === "dm" && dmTarget
                    ? `💬 ${dmTarget.username}`
                    : selectedRoom
                    ? selectedRoom.name
                    : "CultureConnect"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {chatMode === "dm" && dmTarget
                    ? `${dmTarget.country}`
                    : selectedRoom
                    ? `${roomUsers.length} online • ${selectedRoom.language}`
                    : "Select a room or DM to get started"}
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
                          <p className="text-xs font-semibold text-slate-600 px-2">
                            Online Users ({roomUsers.length})
                          </p>
                        </div>
                        <div className="max-h-75 overflow-y-auto">
                          {roomUsers.length === 0 ? (
                            <p className="text-xs text-slate-500 p-3">No users online</p>
                          ) : (
                            roomUsers
                              .filter((ru) => Number(ru.userId) !== Number(user?.id))
                              .map((ru) => (
                                <button
                                  key={`${ru.userId}-${ru.username}`}
                                  onClick={() => {
                                    openDmWithUser(ru);
                                    setShowUsersDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50 transition flex items-center gap-2"
                                >
                                  <div className="w-6 h-6 rounded-full overflow-hidden">
                                    <img
                                      src={ru.profile_picture}
                                      alt={ru.username}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
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
                <button onClick={closeDm} className="rounded-full p-2 hover:bg-slate-200">
                  <X size={20} className="text-slate-700" />
                </button>
              )}
            </div>
            {socketError ? (
              <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {socketError}
              </p>
            ) : null}
          </div>

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3 min-h-0">
            {!selectedRoom && !dmTarget ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-lg font-semibold text-slate-600">Select a room or DM</p>
                  <p className="text-sm text-slate-500 mt-1">Pick from the left panel to start messaging</p>
                </div>
              </div>
            ) : selectedRoom && !joinedRoomIds.has(selectedRoom.roomId) ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <div className="text-5xl mb-4">🔒</div>
                  <p className="text-lg font-semibold text-slate-700 mb-2">Join this room first</p>
                  <p className="text-sm text-slate-600 mb-4">
                    You need to join <strong>{selectedRoom.name}</strong> to see messages
                  </p>
                  <button
                    onClick={() => joinRoom(selectedRoom)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ) : chatMode === "dm" ? (
              dmMessages.length === 0 ? (
                <div className="grid h-full place-items-center text-slate-400 text-center">
                  <div>
                    <div className="text-3xl mb-2">👋</div>
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start a conversation</p>
                  </div>
                </div>
              ) : (
                dmMessages.map((msg, idx) => {
                  const msgResponse = msg as DirectMessageResponse;
                  let currentUserId = user?.id ? Number(user.id) : NaN;
                  if (isNaN(currentUserId) && dmMessages.length > 0) {
                    const targetUserId = Number(dmTarget?.userId);
                    const senderIds = dmMessages.map((m) => {
                      const mr = m as DirectMessageResponse;
                      return Number(mr.sender_user_id ?? mr.senderUserId);
                    });
                    const inferred = senderIds.find((id) => id !== targetUserId && !isNaN(id));
                    if (inferred) currentUserId = inferred;
                  }

                  const rawSenderId = msgResponse.sender_user_id ?? msgResponse.senderUserId ?? null;
                  const senderUserId = rawSenderId ? Number(rawSenderId) : null;
                  const isFromCurrentUser = senderUserId !== null && senderUserId === currentUserId;

                  const defaultAvatar =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23cbd5e1'/%3E%3C/svg%3E";
                  let displayAvatar = defaultAvatar;
                  if (isFromCurrentUser) {
                    displayAvatar = user?.profile_picture || defaultAvatar;
                  } else {
                    displayAvatar = msgResponse.sender_profile_picture || dmTarget?.profile_picture || defaultAvatar;
                  }

                  const senderUsername = msgResponse.sender_username || dmTarget?.username || `User ${senderUserId}`;
                  const messageText = msgResponse.message_text || msgResponse.text || "(empty message)";
                  const senderName = isFromCurrentUser ? "You" : senderUsername;

                  return (
                    <div key={`${msg.id}-${idx}`} className={`flex gap-2 ${isFromCurrentUser ? "justify-end" : "justify-start"}`}>
                      {!isFromCurrentUser && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-300">
                          <img
                            src={displayAvatar}
                            alt={senderName}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = defaultAvatar)}
                          />
                        </div>
                      )}
                      <div className={`flex flex-col ${isFromCurrentUser ? "items-end" : "items-start"}`}>
                        <p className={`text-xs font-semibold mb-1 ${isFromCurrentUser ? "text-orange-600" : "text-slate-700"}`}>
                          {senderName}
                        </p>
                        <div
                          className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm ${
                            isFromCurrentUser ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-900"
                          }`}
                        >
                          <p className="text-sm">{messageText}</p>
                          <p className={`mt-1 text-[10px] ${isFromCurrentUser ? "text-orange-100" : "text-slate-600"}`}>
                            {formatMessageTime((msg as DirectMessageResponse).created_at || msg.timestamp)}
                          </p>
                        </div>
                      </div>
                      {isFromCurrentUser && (
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-300">
                          <img
                            src={displayAvatar}
                            alt="You"
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = defaultAvatar)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : messages.length === 0 ? (
              <div className="grid h-full place-items-center text-slate-400 text-center">
                <div>
                  <div className="text-3xl mb-2">👋</div>
                  <p className="text-sm">Be the first to say hello!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isFromCurrentUser = msg.username === user?.username;
                return (
                  <div key={`${msg.timestamp}-${index}`} className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 shadow-sm ${
                        isFromCurrentUser ? "bg-slate-900 text-white" : "bg-white text-slate-800"
                      }`}
                    >
                      <p className="mb-1 text-xs opacity-70">{msg.username}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="mt-1 text-[10px] opacity-60">{formatMessageTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3 shrink-0">
            {(selectedRoom && joinedRoomIds.has(selectedRoom.roomId)) || chatMode === "dm" ? (
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatMode === "dm") {
                        sendDirectMessage();
                      } else {
                        sendMessage();
                      }
                    }
                  }}
                  placeholder={chatMode === "dm" ? "Message..." : "Type a message..."}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  onClick={chatMode === "dm" ? sendDirectMessage : sendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">Join a room or select a DM to start messaging</p>
            )}
          </div>
        </main>
      </div>

      {showPasswordModal && pendingRoomJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🔐</div>
              <h2 className="text-xl font-bold text-slate-900">Private Room</h2>
            </div>
            <p className="text-slate-600 mb-4 text-sm">
              <strong>{pendingRoomJoin.name}</strong> is password protected. Enter the password to join:
            </p>
            <input
              type="password"
              placeholder="Enter password"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && joinPassword.trim()) {
                  joinRoomWithPassword(pendingRoomJoin, joinPassword);
                }
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {passwordError && <p className="text-red-600 text-sm mb-4 font-medium">❌ {passwordError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setJoinPassword("");
                  setPasswordError("");
                }}
                className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (joinPassword.trim()) {
                    joinRoomWithPassword(pendingRoomJoin, joinPassword);
                  } else {
                    setPasswordError("Please enter a password");
                  }
                }}
                disabled={!joinPassword.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default LiveRooms;