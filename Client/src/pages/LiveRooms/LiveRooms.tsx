import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Plus, Send, Search, Users, RefreshCcw, MessageCircle, X, MoreVertical, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { createRoomApiHandler, getRoomListApiHandler } from "../../services/api.service";
import type { DirectMessage, DirectMessageResponse, DmTargetUser, Message, RoomListItem, RoomUser } from "../../constants/interface";
import type { DmHistoryPayload, RoomJoinedPayload, UiRoom } from "../../types";
import { NotificationCenter, useNotifications } from "./components/NotificationCenter";
import { handleDmNewMessage } from "./socket/dmMessageHandler";

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
  roomId: Number(room.id),  // ✅ CRITICAL: Convert to number, API returns string
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
      // ✅ CRITICAL FIX: Namespace localStorage with userId to prevent cross-user data leakage
      const userId = user?.id;
      if (!userId) return new Map();
      
      const saved = localStorage.getItem(`dmConversations_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`📨 Loaded ${parsed.length} DM conversations from localStorage for user ${userId}`);
        return new Map(parsed);
      } else {
        console.log(`📨 No saved DM conversations for user ${userId}, starting fresh`);
      }
    } catch (error) {
      console.error("Error loading dmConversations from localStorage:", error);
    }
    return new Map();
  });
  const [unreadDmCount, setUnreadDmCount] = useState<Set<number>>(() => {
    try {
      // ✅ CRITICAL FIX: Namespace localStorage with userId
      const userId = user?.id;
      if (!userId) return new Set();
      
      const saved = localStorage.getItem(`unreadDmCount_${userId}`);
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

  // Notification management
  const { notifications, addNotification, dismissNotification } = useNotifications();

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  const socketRef = useRef<Socket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // ✅ REFS: Keep current state for socket event handlers (avoid closure bugs)
  const dmTargetRef = useRef<DmTargetUser | null>(null);
  const currentUserIdRef = useRef<number | typeof NaN>(NaN);
  const dmMessagesRef = useRef<DirectMessage[]>([]);
  const dmConversationsRef = useRef<Map<number, { user: DmTargetUser; lastMessage: string; timestamp: string }>>(new Map());
  const unreadDmCountRef = useRef<Set<number>>(new Set());
  const selectedRoomIdRef = useRef<number | null>(null);
  const chatModeRef = useRef<'room' | 'dm'>('room');

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

  useEffect(() => {
    if (selectedUiRoomId) {
      const selected = rooms.find(r => r.id === selectedUiRoomId);
      // ✅ CRITICAL: Convert to number to ensure type consistency with socket events
      selectedRoomIdRef.current = selected ? Number(selected.roomId) : null;
    } else {
      selectedRoomIdRef.current = null;
    }
  }, [selectedUiRoomId, rooms]);

  // ✅ FIX: Save last selected room to localStorage to restore on reload
  useEffect(() => {
    if (selectedUiRoomId && chatMode === "room") {
      localStorage.setItem("lastSelectedRoomId", selectedUiRoomId);
      console.log(`💾 Saved last selected room: ${selectedUiRoomId}`);
    }
  }, [selectedUiRoomId, chatMode]);

  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
      }, 0);
    }
  };

  // ✅ FIX: Track screen size to only close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [dmMessages]);

  // 🔍 DEBUG: Log when messages state changes
  useEffect(() => {
    console.log(`📊 Messages state updated: ${messages.length} messages`, messages);
  }, [messages]);

  useEffect(() => {
    try {
      // ✅ CRITICAL FIX: Namespace localStorage with userId to prevent cross-user data leakage
      const userId = user?.id;
      if (!userId) return;
      
      const data = Array.from(dmConversations.entries());
      console.log(`💾 Saving ${data.length} DM conversations for user ${userId}`);
      localStorage.setItem(`dmConversations_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving dmConversations to localStorage:", error);
    }
  }, [dmConversations, user?.id]);

  useEffect(() => {
    try {
      // ✅ CRITICAL FIX: Namespace localStorage with userId
      const userId = user?.id;
      if (!userId) return;
      
      const data = Array.from(unreadDmCount);
      localStorage.setItem(`unreadDmCount_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving unreadDmCount to localStorage:", error);
    }
  }, [unreadDmCount, user?.id]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedUiRoomId) || null,
    [rooms, selectedUiRoomId]
  );

  const filteredRooms = useMemo(() => {
    const key = searchTerm.trim().toLowerCase();
    const roomList = rooms;
    
    console.log(`🔍 filteredRooms calc: rooms=${roomList.length}, searchTerm="${searchTerm}", joinedRoomIds.size=${joinedRoomIds.size}`);
    
    // ✅ FIX: Show ALL rooms (not filtered by joinedRoomIds)
    // The isJoined button will determine whether user sees "Join" or "Leave"
    // This way users can rejoin rooms after leaving them
    
    if (!key) {
      console.log(`🎯 No search term, returning all ${roomList.length} rooms`);
      return roomList;
    }

    const result = roomList.filter((room) => {
      return (
        room.name.toLowerCase().includes(key) ||
        room.language.toLowerCase().includes(key) ||
        String(room.roomId).includes(key) ||
        (room.slug || "").toLowerCase().includes(key)
      );
    });
    console.log(`🎯 After search filter: ${result.length} rooms`);
    return result;
  }, [rooms, searchTerm, joinedRoomIds]);

  const fetchRooms = useCallback(async () => {
    console.log("🔄 fetchRooms called, isAuthenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, skipping room fetch");
      setRooms([]);
      setSelectedUiRoomId(null);
      return;
    }

    setLoadingRooms(true);
    try {
      console.log("📡 Calling getRoomListApiHandler...");
      const result = await getRoomListApiHandler();
      console.log("📡 API Response (full):", JSON.stringify(result, null, 2));
      console.log("📡 API Response.data type:", typeof result.data, "is array?", Array.isArray(result.data));
      console.log("📡 API Response.data length:", result.data?.length || 0);
      
      if (!result.data || !Array.isArray(result.data)) {
        console.error("❌ API returned invalid data structure:", result.data);
        throw new Error("API returned invalid room list format");
      }
      
      console.log("📄 Raw API items:", result.data);
      const fetchedRooms = result.data.map((room: RoomListItem) => {
        const mapped = mapRoomListItemToUiRoom(room);
        console.log(`  ✅ Mapped room:`, { original: room, mapped });
        return mapped;
      });
      
      console.log(`✅ Total mapped ${fetchedRooms.length} rooms:`, fetchedRooms);
      
      setRooms(fetchedRooms);
      console.log(`📝 Called setRooms with ${fetchedRooms.length} rooms`);
      
      // ✅ FIX: Do NOT auto-populate joinedRoomIds from API
      // The API returns all available rooms, not rooms the user is joined to
      // Only socket events (room:joined, user:info) should populate joinedRoomIds
      // This prevents auto-joining all rooms
      
      setSelectedUiRoomId((prev) => {
        let nextSelected = prev;
        if (!prev || !fetchedRooms.some((room) => room.id === prev)) {
          const savedRoomId = localStorage.getItem("lastSelectedRoomId");
          if (savedRoomId && fetchedRooms.some((room) => room.id === savedRoomId)) {
            nextSelected = savedRoomId;
            console.log(`🔄 Restored last selected room: ${nextSelected}`);
          } else {
            nextSelected = fetchedRooms[0]?.id || null;
            console.log(`🔄 Selected first room: ${nextSelected}`);
          }
        }
        return nextSelected;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load rooms";
      console.error("❌ Error fetching rooms:", message, error);
      setSocketError(message);
      setRooms([]);
      setSelectedUiRoomId(null);
    } finally {
      setLoadingRooms(false);
    }
  }, [isAuthenticated]);

  // ✅ Debug effect: Log rooms and joinedRoomIds state
  useEffect(() => {
    console.log("📊 STATE UPDATE:");
    console.log(`  - rooms: ${rooms.length} rooms`);
    if (rooms.length > 0) {
      console.log(`    ${rooms.map(r => `${r.name} (ID: ${r.roomId})`).join(", ")}`);
    }
    console.log(`  - joinedRoomIds: ${joinedRoomIds.size} rooms [${Array.from(joinedRoomIds).join(", ")}]`);
    console.log(`  - filteredRooms: ${filteredRooms.length} rooms`);
    console.log(`  - viewMode: ${viewMode}`);
    console.log(`  - selectedUiRoomId: ${selectedUiRoomId}`);
  }, [rooms, joinedRoomIds, filteredRooms, viewMode, selectedUiRoomId]);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  // ✅ Debug: Log when isAuthenticated changes
  useEffect(() => {
    console.log(`🔐 Authentication state changed: isAuthenticated=${isAuthenticated}, user=${user?.username}`);
  }, [isAuthenticated, user]);

  // ✅ Debug: Log when messages state changes
  useEffect(() => {
    console.log(`💬 Messages state updated: ${messages.length} messages for room ${selectedRoom?.name || selectedUiRoomId}`);
  }, [messages, selectedRoom, selectedUiRoomId]);

  // ✅ DEBUG: Log when dmTarget changes
  useEffect(() => {
    if (dmTarget) {
      console.log(`🎯 dmTarget updated: ${dmTarget.username} (userId: ${dmTarget.userId})`);
      dmTargetRef.current = dmTarget;
      console.log(`✅ dmTargetRef synchronized with dmTarget`);
    } else {
      dmTargetRef.current = null;
      console.log(`🎯 dmTarget cleared`);
    }
  }, [dmTarget]);

  // ✅ DEBUG: Sync dmMessagesRef with dmMessages state
  useEffect(() => {
    dmMessagesRef.current = dmMessages;
    console.log(`💬 dmMessagesRef updated: ${dmMessages.length} messages`);
  }, [dmMessages]);

  // ✅ DEBUG: Sync currentUserIdRef with user
  useEffect(() => {
    const userId = user?.id ? Number(user.id) : NaN;
    currentUserIdRef.current = userId;
    console.log(`👤 currentUserIdRef updated: ${userId}`);
  }, [user?.id]);

  // Socket connection and listeners
  useEffect(() => {
    const socket = io("http://localhost:4713", {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      setSocketError("");
      // Request DM contacts list when connected
      socket.emit("dm:contacts");
      console.log("📨 Requested dm:contacts list from server");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    // ✅ NEW: Listen for user info with actual joined_rooms from backend
    socket.on("user:info", (userInfo: Record<string, unknown>) => {
      console.log(`📥 user:info received:`, userInfo);
      
      // Extract joined_rooms from the response
      // Backend sends: { userId, username, joinedRooms: { joined_rooms: [1,2,3] } }
      let joinedRoomsArray: number[] = [];
      
      // Try different possible structures
      if (Array.isArray(userInfo.joinedRoomsArray)) {
        joinedRoomsArray = userInfo.joinedRoomsArray as number[];
      } else if (userInfo.joinedRooms && typeof userInfo.joinedRooms === 'object') {
        const joinedRoomsObj = userInfo.joinedRooms as Record<string, unknown>;
        if (Array.isArray(joinedRoomsObj.joined_rooms)) {
          joinedRoomsArray = joinedRoomsObj.joined_rooms as number[];
        }
      } else if (Array.isArray(userInfo.joined_rooms)) {
        joinedRoomsArray = userInfo.joined_rooms as number[];
      }
      
      if (joinedRoomsArray.length > 0) {
        const joinedSet = new Set(joinedRoomsArray.map(id => Number(id)));
        console.log(`✅ Populated joinedRoomIds from user:info: [${Array.from(joinedSet).join(", ")}]`);
        setJoinedRoomIds(joinedSet);
      } else {
        console.log(`📭 No joined rooms found in user:info`);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error.message);
      setSocketError(`Connection error: ${error.message}`);
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
      console.log(`📥 room:joined event received for room ${payload.room.id}`, payload);
      setSocketError("");
      setRoomUsers(payload.users || []);
      setMessages(payload.messages || []);
      console.log(`📝 Updated messages count: ${payload.messages?.length || 0}`);
      
      // ✅ FIX: Ensure room is added to joinedRoomIds when we rejoin
      // Convert room.id to number to ensure type consistency
      setJoinedRoomIds((prev) => {
        const next = new Set(prev);
        const roomIdNum = Number(payload.room.id);
        next.add(roomIdNum);
        console.log(`✅ Added room ${roomIdNum} to joinedRoomIds:`, Array.from(next));
        return next;
      });
      
      // ✅ FIX: Only set selected room if none is currently selected
      // This prevents auto-rejoin from overwriting the user's previously viewed room
      setSelectedUiRoomId((prev) => {
        if (prev) {
          console.log(`🚫 Already viewing room ${prev}, keeping selection`);
          return prev; // Keep current selection
        }
        console.log(`✅ Setting initial room to ${payload.room.id}`);
        return String(payload.room.id);
      });
      
      setChatMode("room");
      setDmTarget(null);
      setDmMessages([]);
      console.log(`✅ room:joined event fully processed for room ${payload.room.id}`);
    });

    socket.on("room:messages", (payload: { roomId: number; messages: Message[] }) => {
      // ✅ CRITICAL FIX: Only load messages if they belong to the currently selected room
      const currentRoomId = selectedRoomIdRef.current;
      const incomingRoomId = payload.roomId;
      
      console.log(`📨 room:messages event - incoming: ${incomingRoomId} (${typeof incomingRoomId}), current: ${currentRoomId} (${typeof currentRoomId}), count: ${payload.messages?.length || 0}`);
      
      // Convert both to numbers to ensure comparison works
      const currentRoomIdNum = Number(currentRoomId);
      const incomingRoomIdNum = Number(incomingRoomId);
      
      console.log(`🔍 Numeric comparison: ${currentRoomIdNum} === ${incomingRoomIdNum} ? ${currentRoomIdNum === incomingRoomIdNum}`);
      
      // Only update if the incoming messages are for the currently selected room
      if (currentRoomIdNum === incomingRoomIdNum) {
        console.log(`✅ Loading ${payload.messages?.length || 0} messages for room ${incomingRoomId}`);
        console.log(`📋 Messages:`, payload.messages);
        setMessages(payload.messages || []);
        setSocketError("");
      } else {
        console.log(`❌ Ignoring messages for room ${incomingRoomId}, current room is ${currentRoomId}`);
      }
      // If messages are for a different room, ignore them
    });

    console.log(`✔️ room:messages handler registered for socket ${socket.id}`);

    // 🔍 Debug: Log all received socket events
    socket.onAny((eventName, ...args) => {
      if (!eventName.includes("room:messages")) {
        console.log(`📡 Socket event received: ${eventName}`, args);
      }
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
      // ✅ CRITICAL FIX: Only add messages that belong to the currently selected room
      const currentRoomId = selectedRoomIdRef.current;
      const incomingRoomId = incoming.roomId ? Number(incoming.roomId) : null;
      
      if (chatModeRef.current === "room" && currentRoomId === incomingRoomId) {
        setMessages((prev) => [...prev, incoming]);
      }
      // If message is from a different room, it's not shown (user gets notification only)
    });

    socket.on("dm:history", (payload: DmHistoryPayload) => {
      console.log("📨 DM History received:", payload);
      console.log(`📨 DM history contains ${payload.messages?.length || 0} messages with user ${payload.target?.username}`);
      setSocketError("");
      setChatMode("dm");
      setDmTarget(payload.target);
      setDmMessages(payload.messages || []);
      console.log(`✅ Updated dmMessages: ${payload.messages?.length || 0} messages`);

      if (payload.target) {
        setUnreadDmCount((prev) => {
          const next = new Set(prev);
          next.delete(Number(payload.target.userId));
          console.log(`🔔 Cleared unread badge for user ${payload.target.userId}`);
          // ✅ CRITICAL FIX: Namespace localStorage with userId
          const userId = user?.id;
          if (userId) {
            localStorage.setItem(`unreadDmCount_${userId}`, JSON.stringify([...next]));
          }
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
          console.log(`💬 Updated conversation for user ${payload.target.userId}: "${lastMessageText}"`);
          return updated;
        });
      }
    });

    // ✅ FIXED: dm:new handler – uses new modular handler function with toast notifications
    socket.on("dm:new", (incoming: DirectMessageResponse) => {
      handleDmNewMessage({
        incoming,
        dmTargetRef,
        currentUserIdRef,
        dmMessagesRef,
        setDmMessages,
        setDmConversations,
        setUnreadDmCount,
        onNotification: (senderName, messageText, metadata) => {
          addNotification(senderName, messageText, "dm", metadata);
        },
      });
    });

    // ✅ FIX: Handle dm:contacts response from server
    socket.on("dm:contacts", (contacts: Record<string, unknown>[]) => {
      console.log(`📥 dm:contacts received:`, contacts);
      
      if (!Array.isArray(contacts) || contacts.length === 0) {
        console.log("📭 No existing DM contacts found");
        return;
      }

      // Map backend contact data to dmConversations format
      // This assumes backend returns array of contact_user_id objects
      try {
        setDmConversations((prevConversations) => {
          const newConversations = new Map(prevConversations);
          
          contacts.forEach((contactData: Record<string, unknown>) => {
            // Extract contact user ID (could be contact_user_id or id)
            const contactUserId = contactData.contact_user_id || contactData.id || contactData.user_id;
            const contactUsername = contactData.username || contactData.name || `User ${contactUserId}`;
            
            if (contactUserId && !newConversations.has(Number(contactUserId))) {
              newConversations.set(Number(contactUserId), {
                user: {
                  userId: Number(contactUserId),
                  username: String(contactUsername),
                  country: String(contactData.country || ""),
                },
                lastMessage: "No messages yet",
                timestamp: new Date().toISOString(),
              });
              console.log(`✅ Added DM contact: ${contactUsername} (ID: ${contactUserId})`);
            }
          });
          
          console.log(`📊 Total DM conversations: ${newConversations.size}`);
          return newConversations;
        });
      } catch (error) {
        console.error("❌ Error processing dm:contacts:", error);
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
      console.error("❌ Cannot join room: Socket not connected");
      return;
    }

    if (room.visibility === "private") {
      setPendingRoomJoin(room);
      setShowPasswordModal(true);
      setJoinPassword("");
      setPasswordError("");
      return;
    }

    console.log(`🤝 joinRoom called for room ${room.name} (ID: ${room.id}, roomId: ${room.roomId})`);
    
    // ✅ CRITICAL: Update ref immediately so room:joined handler knows we're viewing this room
    const roomIdNum = Number(room.roomId);
    selectedRoomIdRef.current = roomIdNum;
    console.log(`✅ Updated selectedRoomIdRef to ${roomIdNum}`);
    
    setSelectedUiRoomId(room.id);
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    resetRoomUi();
    
    console.log(`📤 Emitting room:join for roomId ${room.roomId}`);
    socket.emit("room:join", { roomId: room.roomId });
  };

  const joinRoomWithPassword = (room: UiRoom, password: string) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      setPasswordError("Socket is not connected");
      return;
    }

    console.log(`🤝 joinRoomWithPassword called for room ${room.name} (ID: ${room.id}, roomId: ${room.roomId})`);
    
    // ✅ CRITICAL: Update ref immediately so room:joined handler knows we're viewing this room
    const roomIdNum = Number(room.roomId);
    selectedRoomIdRef.current = roomIdNum;
    console.log(`✅ Updated selectedRoomIdRef to ${roomIdNum}`);

    setSelectedUiRoomId(room.id);
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
    resetRoomUi();
    
    console.log(`📤 Emitting room:join with password for roomId ${room.roomId}`);
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

    console.log(`💬 Opening DM with user ${target.username} (userId: ${target.userId})`);
    setDmTarget(target);
    setChatMode("dm");
    setDmMessages([]);
    setShowUsersDropdown(false);
    setViewMode("dms"); // ✅ FIX: Changed from "rooms" to "dms" to show DM conversation

    setUnreadDmCount((prev) => {
      const next = new Set(prev);
      next.delete(Number(target.userId));
      console.log(`🔔 Cleared unread badge for user ${target.userId}`);
      // ✅ CRITICAL FIX: Namespace localStorage with userId
      const userId = user?.id;
      if (userId) {
        localStorage.setItem(`unreadDmCount_${userId}`, JSON.stringify([...next]));
      }
      return next;
    });

    console.log(`📤 Emitting dm:history request for user ${target.userId}`);
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

    if (!socket || !socket.connected || !roomId || !dmTarget || !text) {
      console.log(`❌ Cannot send DM: socket=${!!socket}, connected=${socket?.connected}, roomId=${roomId}, dmTarget=${!!dmTarget}, text="${text}"`);
      return;
    }

    console.log(`📤 Sending DM to user ${dmTarget.userId}: "${text}"`);
    socket.emit("dm:send", {
      roomId,
      targetUserId: Number(dmTarget.userId),
      text,
    });

    setMessageInput("");
    console.log(`✅ DM message sent`);
  };

  return (
    <section className="fixed inset-0 top-22 bg-slate-50 flex flex-col overflow-hidden">
      {/* Toast Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onDismiss={dismissNotification}
        onClickNotification={(notification) => {
          console.log(`🔔 Notification clicked:`, notification);
          // When user clicks a DM notification, open that conversation
          if (notification.type === "dm") {
            const senderId = Number(notification.metadata?.senderId);
            console.log(`💬 Opening DM with sender ${senderId}`);
            if (!isNaN(senderId)) {
              setViewMode("dms");
              // ✅ FIX: Try to get from dmConversations first, fall back to creating from metadata
              const existing = dmConversations.get(senderId);
              if (existing) {
                console.log(`✅ Found conversation in dmConversations:`, existing.user);
                setDmTarget(existing.user);
              } else {
                // If not in conversations yet, try to create from sender info
                console.log(`⚠️ Sender ${senderId} not in dmConversations, creating from notification metadata`);
                setDmTarget({
                  userId: String(senderId),
                  username: notification.senderName || `User ${senderId}`,
                  country: "",
                  profile_picture: "",
                });
              }
              setSidebarOpen(true);
              console.log(`✅ DM conversation opened for user ${senderId}`);
            } else {
              console.error(`❌ Invalid senderId: ${notification.metadata?.senderId}`);
            }
          }
          dismissNotification(notification.id);
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR - Responsive */}
        <aside className={`${
          sidebarOpen ? "w-full sm:w-80" : "w-0"
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden`}>
          {/* Header with DM/Rooms tabs */}
          <div className="border-b border-slate-200 p-4 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-slate-900">Chats</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="sm:hidden p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          {/* Rooms/DMs tabs */}
          <div className="flex border-b border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode("rooms")}
              className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition ${
                viewMode === "rooms"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => setViewMode("dms")}
              className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition relative ${
                viewMode === "dms"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Messages
              {unreadDmCount.size > 0 && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                  {unreadDmCount.size}
                </span>
              )}
            </button>
          </div>

          {/* Create/Refresh buttons for rooms */}
          {viewMode === "rooms" && (
            <div className="border-b border-slate-200 p-3 flex gap-2 shrink-0">
              <button
                onClick={() => setShowCreate((prev) => !prev)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Create
              </button>
              <button
                onClick={() => void fetchRooms()}
                disabled={loadingRooms}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCcw size={16} className={loadingRooms ? "animate-spin" : ""} />
              </button>
            </div>
          )}

          {/* Create Room Form */}
          {showCreate && viewMode === "rooms" && (
            <div className="border-b border-slate-200 bg-blue-50 p-4 space-y-3 shrink-0">
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room Name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Language"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Capacity"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {visibility === "private" && (
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Room Password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
              )}
              <button
                onClick={createRoom}
                disabled={creating}
                className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Room"}
              </button>
            </div>
          )}

          {/* Rooms/DMs List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {viewMode === "rooms" ? (
              <>
                {(() => {
                  console.log("🎯 RENDERING ROOMS:");
                  console.log(`   - viewMode: ${viewMode}`);
                  console.log(`   - rooms.length: ${rooms.length}`);
                  console.log(`   - filteredRooms.length: ${filteredRooms.length}`);
                  console.log(`   - joinedRoomIds.size: ${joinedRoomIds.size}`);
                  console.log(`   - searchTerm: "${searchTerm}"`);
                  if (filteredRooms.length > 0) {
                    console.log(`   - Rooms to display: ${filteredRooms.map(r => r.name).join(", ")}`);
                  }
                  return null;
                })()}
                {filteredRooms.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-slate-500">No rooms found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {rooms.length === 0 
                        ? "Create one to get started" 
                        : `You're not joined to any rooms. ${joinedRoomIds.size > 0 ? "" : "(joinedRoomIds is empty)"}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredRooms.map((room) => {
                      const active = room.id === selectedUiRoomId;
                      const isJoined = joinedRoomIds.has(room.roomId);
                      return (
                        <div
                          key={room.id}
                          className={`rounded-lg border p-3 transition cursor-pointer ${
                            active
                              ? "border-blue-300 bg-blue-50"
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
                                // ✅ CRITICAL: Clear old messages immediately to prevent showing wrong room's messages
                                setMessages([]);
                                // ✅ FIX: Only close sidebar on small screens
                                if (isSmallScreen) {
                                  setSidebarOpen(false);
                                }
                                // ✅ CRITICAL: Convert roomId to number and update ref immediately
                                const roomIdNum = Number(room.roomId);
                                selectedRoomIdRef.current = roomIdNum;
                                const socket = socketRef.current;
                                console.log(`🔍 Clicked room ${room.name} (id: ${room.id}, roomId: ${roomIdNum}, type: ${typeof roomIdNum})`);
                                console.log(`📡 Socket connected: ${socket?.connected}, User joined: ${joinedRoomIds.has(roomIdNum)}`);
                                
                                // ✅ FIX: Only load messages if user is joined to this room
                                // Do NOT auto-join the room here - just view the messages
                                if (socket && socket.connected) {
                                  console.log(`📤 Emitting room:load for roomId ${roomIdNum} (type: ${typeof roomIdNum})`);
                                  socket.emit("room:load", { roomId: roomIdNum });
                                } else {
                                  console.log(`⚠️ Cannot emit: socket not connected`);
                                }
                              }}
                              className="flex-1 text-left"
                            >
                              <p className="text-sm font-semibold text-slate-900">{room.name}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>{room.language}</span>
                                <span>•</span>
                                <span>{room.visibility}</span>
                              </div>
                            </button>

                            {isJoined ? (
                              <button
                                onClick={() => leaveRoomFromCard(room.roomId)}
                                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold transition bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Leave
                              </button>
                            ) : (
                              <button
                                onClick={() => joinRoom(room)}
                                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold transition bg-blue-500 text-white hover:bg-blue-600"
                              >
                                Join
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                {dmConversations.size === 0 ? (
                  <div className="p-4 text-center">
                    <MessageCircle size={32} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">No messages yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start a conversation</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {Array.from(dmConversations.entries())
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
                            onClick={() => {
                              openDmWithUser(conv.user);
                              // ✅ FIX: Only close sidebar on small screens
                              if (isSmallScreen) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`w-full rounded-lg border p-3 text-left transition ${
                              isCurrentDmTarget
                                ? "border-blue-300 bg-blue-50"
                                : isUnread
                                ? "border-red-200 bg-red-50 hover:bg-red-100"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-300">
                                <img
                                  src={conv.user.profile_picture}
                                  alt={conv.user.username}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  isUnread ? "text-slate-900" : "text-slate-800"
                                }`}>
                                  {conv.user.username}
                                </p>
                                <p className={`text-xs truncate mt-0.5 ${
                                  isUnread ? "text-slate-700 font-medium" : "text-slate-500"
                                }`}>
                                  {conv.lastMessage}
                                </p>
                              </div>
                              {isUnread && (
                                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* MAIN CHAT AREA - Click to show sidebar on mobile */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          {/* MAIN CHAT */}
          <div className="bg-white overflow-visible flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white p-4 shrink-0 relative z-40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="sm:hidden p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <Menu size={20} className="text-slate-600" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {chatMode === "dm" && dmTarget
                        ? dmTarget.username
                        : selectedRoom?.name
                        ? selectedRoom.name
                        : "CultureConnect"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {chatMode === "dm" && dmTarget
                        ? dmTarget.country
                        : selectedRoom
                        ? `${roomUsers.length} online • ${selectedRoom.language}`
                        : "Select a chat to begin"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {chatMode === "room" && selectedRoom && (
                    <div className="flex items-center gap-1">
                      <div className="relative z-50">
                        <button
                          onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition"
                          title="Online users"
                        >
                          <Users size={18} className="text-slate-600" />
                        </button>

                        {showUsersDropdown && chatMode === "room" && (
                          <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-9999 min-w-60">
                            <div className="p-3 border-b border-slate-100">
                              <p className="text-xs font-semibold text-slate-700">
                                Online Users ({roomUsers.length})
                              </p>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
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
                                        // ✅ FIX: Only close sidebar on small screens
                                        if (isSmallScreen) {
                                          setSidebarOpen(false);
                                        }
                                      }}
                                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-blue-50 transition flex items-center gap-2"
                                    >
                                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                        <img
                                          src={ru.profile_picture}
                                          alt={ru.username}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm">{ru.username}</p>
                                        <p className="text-xs text-slate-500">{ru.country}</p>
                                      </div>
                                    </button>
                                  ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative z-50">
                        <button
                          onClick={() => setShowRoomMenu(!showRoomMenu)}
                          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition"
                          title="Room options"
                        >
                          <MoreVertical size={18} className="text-slate-600" />
                        </button>

                        {showRoomMenu && (
                          <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-9999 min-w-48">
                            <button
                              onClick={leaveRoom}
                              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition font-medium"
                            >
                              Leave Room
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {chatMode === "dm" && (
                    <button onClick={closeDm} className="p-1 hover:bg-slate-100 rounded-lg">
                      <X size={18} className="text-slate-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          {socketError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {socketError}
            </div>
          )}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 min-h-0">
            {!selectedRoom && !dmTarget ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-xl font-semibold text-slate-700">Select a chat to begin</p>
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
                    <div key={`${msg.id}-${idx}`} className={`flex gap-3 ${isFromCurrentUser ? "justify-end" : "justify-start"}`}>
                      {!isFromCurrentUser && (
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-slate-300 mt-0.5">
                          <img
                            src={displayAvatar}
                            alt={senderName}
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).src = defaultAvatar)}
                          />
                        </div>
                      )}
                      <div className={`flex flex-col max-w-xs ${isFromCurrentUser ? "items-end" : "items-start"}`}>
                        <p className={`text-xs font-medium mb-1 px-3 ${isFromCurrentUser ? "text-blue-600" : "text-slate-600"}`}>
                          {senderName}
                        </p>
                        <div
                          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                            isFromCurrentUser
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-slate-200 text-slate-900 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{messageText}</p>
                        </div>
                        <p className={`text-[11px] mt-1 px-3 ${isFromCurrentUser ? "text-slate-500" : "text-slate-500"}`}>
                          {formatMessageTime((msg as DirectMessageResponse).created_at || msg.timestamp)}
                        </p>
                      </div>
                      {isFromCurrentUser && (
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-slate-300 mt-0.5">
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
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-sm font-medium">Be the first to say hello!</p>
                  <p className="text-xs text-slate-500 mt-1">Start the conversation</p>
                </div>
              </div>
            ) : (
              <>
                {console.log(`📺 Rendering ${messages.length} room messages for room ${selectedRoom?.name}:`, messages)}
                {messages.map((msg, index) => {
                  const isFromCurrentUser = msg.username === user?.username;
                return (
                  <div key={`${msg.timestamp}-${index}`} className={`flex gap-2 ${isFromCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 shadow-sm ${
                        isFromCurrentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-slate-200 text-slate-900 rounded-bl-none"
                      }`}
                    >
                      <p className="mb-1 text-xs font-medium opacity-75">{msg.username}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="mt-1 text-[11px] opacity-70">{formatMessageTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white p-4 shrink-0">
            {(selectedRoom && joinedRoomIds.has(selectedRoom.roomId)) || chatMode === "dm" ? (
              <div className="flex gap-3 items-end">
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
                  className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <button
                  onClick={chatMode === "dm" ? sendDirectMessage : sendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center font-medium">Join a room or select a chat to start messaging</p>
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