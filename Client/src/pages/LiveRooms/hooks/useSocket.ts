import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { DirectMessageResponse, RoomJoinedPayload, DmHistoryPayload, Message, RoomUser, User } from "../../../constants/interface";

interface SocketEventHandlers {
  onConnect: () => void;
  onDisconnect: () => void;
  onSocketError: (payload: { code?: string; message?: string }) => void;
  onRoomJoined: (payload: RoomJoinedPayload) => void;
  onRoomMessages: (payload: { roomId: number; messages: Message[] }) => void;
  onRoomUserJoined: (user: RoomUser) => void;
  onRoomUserLeft: (user: RoomUser) => void;
  onChatNew: (message: Message) => void;
  onDmHistory: (payload: DmHistoryPayload) => void;
  onDmNew: (message: DirectMessageResponse) => void;
}

export const useSocket = (user: User | null, handlers: SocketEventHandlers) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:4713", {
      withCredentials: true,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("✓ Socket connected:", socket.id);
      handlers.onConnect();
    });

    socket.on("disconnect", () => {
      console.log("✗ Socket disconnected");
      handlers.onDisconnect();
    });

    socket.on("socket:error", (payload: { code?: string; message?: string }) => {
      console.error("🚨 Socket error:", payload);
      handlers.onSocketError(payload);
    });

    // Room events
    socket.on("room:joined", (payload: RoomJoinedPayload) => {
      console.log("✓ Room joined:", payload.room.id);
      handlers.onRoomJoined(payload);
    });

    socket.on("room:messages", (payload: { roomId: number; messages: Message[] }) => {
      console.log(`✓ Room ${payload.roomId} messages loaded:`, payload.messages.length);
      handlers.onRoomMessages(payload);
    });

    socket.on("room:user_joined", (user: RoomUser) => {
      console.log("✓ User joined room:", user.username);
      handlers.onRoomUserJoined(user);
    });

    socket.on("room:user_left", (user: RoomUser) => {
      console.log("✓ User left room:", user.username);
      handlers.onRoomUserLeft(user);
    });

    socket.on("chat:new", (message: Message) => {
      console.log("💬 New room message:", message.text.substring(0, 30));
      handlers.onChatNew(message);
    });

    // DM events
    socket.on("dm:history", (payload: DmHistoryPayload) => {
      console.log("📨 DM history loaded:", payload.messages.length, "messages");
      handlers.onDmHistory(payload);
    });

    socket.on("dm:new", (message: DirectMessageResponse) => {
      console.log("📨 New DM received:", message.message_text?.substring(0, 30));
      handlers.onDmNew(message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only reconnect if user changes

  return socketRef;
};
