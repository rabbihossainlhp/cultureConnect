import { useRef, useState, useEffect } from "react";
import type { DirectMessage, DirectMessageResponse, DmTargetUser } from "../../../constants/interface";

export const useDmHandler = () => {
  // DM state
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
    dmMessagesRef.current = dmMessages;
  }, [dmMessages]);

  useEffect(() => {
    dmConversationsRef.current = dmConversations;
  }, [dmConversations]);

  useEffect(() => {
    unreadDmCountRef.current = unreadDmCount;
  }, [unreadDmCount]);

  // Persist DM conversations to localStorage
  useEffect(() => {
    try {
      const data = Array.from(dmConversations.entries());
      localStorage.setItem("dmConversations", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving dmConversations to localStorage:", error);
    }
  }, [dmConversations]);

  // Persist unread DM count to localStorage
  useEffect(() => {
    try {
      const data = Array.from(unreadDmCount);
      localStorage.setItem("unreadDmCount", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving unreadDmCount to localStorage:", error);
    }
  }, [unreadDmCount]);

  const closeDm = () => {
    setChatMode("room");
    setDmTarget(null);
    setDmMessages([]);
  };

  return {
    // State
    chatMode,
    setChatMode,
    dmTarget,
    setDmTarget,
    dmMessages,
    setDmMessages,
    dmConversations,
    setDmConversations,
    unreadDmCount,
    setUnreadDmCount,
    // Refs
    dmTargetRef,
    currentUserIdRef,
    dmMessagesRef,
    dmConversationsRef,
    unreadDmCountRef,
    // Functions
    closeDm,
  };
};
