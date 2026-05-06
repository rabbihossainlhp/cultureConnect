import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { DirectMessageResponse, Message, RoomUser } from "../../../constants/interface";
import type { User } from "../../../contexts/AuthContext";
import type { DmHistoryPayload, RoomJoinedPayload } from "../../../types";

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
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4713", {
      withCredentials: true,
    });

    // Connection events
    socket.on("connect", () => {
      handlers.onConnect();
    });

    socket.on("disconnect", () => {
      handlers.onDisconnect();
    });

    socket.on("socket:error", (payload: { code?: string; message?: string }) => {
      handlers.onSocketError(payload);
    });

    // Room events
    socket.on("room:joined", (payload: RoomJoinedPayload) => {
      handlers.onRoomJoined(payload);
    });

    socket.on("room:messages", (payload: { roomId: number; messages: Message[] }) => {
      handlers.onRoomMessages(payload);
    });

    socket.on("room:user_joined", (user: RoomUser) => {
      handlers.onRoomUserJoined(user);
    });

    socket.on("room:user_left", (user: RoomUser) => {
      handlers.onRoomUserLeft(user);
    });

    socket.on("chat:new", (message: Message) => {

      handlers.onChatNew(message);
    });

    // DM events
    socket.on("dm:history", (payload: DmHistoryPayload) => {
      handlers.onDmHistory(payload);
    });

    socket.on("dm:new", (message: DirectMessageResponse) => {
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
