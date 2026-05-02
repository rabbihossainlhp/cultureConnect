import type { DirectMessageResponse, DmTargetUser, DirectMessage } from "../../../constants/interface";

interface DmConversation {
  user: DmTargetUser;
  lastMessage: string;
  timestamp: string;
}

interface DmSocketHandlerParams {
  incoming: DirectMessageResponse;
  currentUserIdRef: React.MutableRefObject<number | typeof NaN>;
  dmTargetRef: React.MutableRefObject<DmTargetUser | null>;
  dmMessagesRef: React.MutableRefObject<DirectMessage[]>;
  setDmMessages: (fn: (prev: DirectMessage[]) => DirectMessage[]) => void;
  setDmConversations: (fn: (prev: Map<number, DmConversation>) => Map<number, DmConversation>) => void;
  setUnreadDmCount: (fn: (prev: Set<number>) => Set<number>) => void;
  onNotification?: (senderName: string, messageText: string, metadata?: { senderId?: number | string }) => void;
}

/**
 * ✅ FIXED: Handles incoming DM messages with fresh state from refs
 * Properly displays messages in real-time when viewing the DM window
 */
export const handleDmNewMessage = ({
  incoming,
  currentUserIdRef,
  dmTargetRef,
  dmMessagesRef,
  setDmMessages,
  setDmConversations,
  setUnreadDmCount,
  onNotification,
}: DmSocketHandlerParams) => {
  // Extract sender and receiver IDs
  let senderUserId: number | null = incoming.sender_user_id || incoming.senderUserId;
  senderUserId = senderUserId ? Number(senderUserId) : null;

  let receiverUserId: number | null = incoming.receiver_user_id || incoming.receiverUserId;
  receiverUserId = receiverUserId ? Number(receiverUserId) : null;

  // Get current user ID from ref (always fresh)
  let currentUserId = currentUserIdRef.current;
  
  if (isNaN(currentUserId)) {
    // Fallback inference if needed
    const target = dmTargetRef.current;
    if (target && dmMessagesRef.current.length > 0) {
      const targetUserId = Number(target.userId);
      const senderIds = dmMessagesRef.current.map(m => {
        const m_response = m as DirectMessageResponse;
        return Number(m_response.sender_user_id ?? m_response.senderUserId);
      });
      const inferred = senderIds.find(id => id !== targetUserId && !isNaN(id));
      if (inferred) {
        currentUserId = inferred;
      }
    }
  }

  // Determine direction safely even if currentUserId is not ready yet.
  const isCurrentUserKnown = !isNaN(currentUserId as number);
  const isCurrentUserSender = isCurrentUserKnown && senderUserId === currentUserId;
  const isCurrentUserReceiver = isCurrentUserKnown && receiverUserId === currentUserId;
  const otherUserId = isCurrentUserSender
    ? receiverUserId
    : senderUserId;

  // Get fresh dmTarget from ref
  const currentDmTarget = dmTargetRef.current;
  const isViewingThisConversation =
    currentDmTarget &&
    (currentDmTarget.userId === String(otherUserId) || Number(currentDmTarget.userId) === otherUserId);

  const isImageMessage = incoming.message_type === "image" || incoming.messageType === "image" || Boolean(incoming.media_url || incoming.mediaUrl);
  const messageText = isImageMessage
    ? (incoming.message_text || incoming.text || "📷 Image")
    : (incoming.message_text || incoming.text || "Message");
  const timestamp = incoming.created_at || incoming.timestamp || new Date().toISOString();

  // Sender info
  const senderUserInfo = {
    userId: senderUserId ?? 0,
    username: incoming.sender_username || `User ${senderUserId}`,
    country: incoming.sender_country || "",
    profile_picture: incoming.sender_profile_picture || "",
  };

  // Receiver info
  const receiverUserInfo = {
    userId: receiverUserId ?? 0,
    username: incoming.receiver_username || `User ${receiverUserId}`,
    country: incoming.receiver_country || "",
    profile_picture: incoming.receiver_profile_picture || "",
  };

  // ✅ CRITICAL: Add message to chat window IMMEDIATELY if viewing this conversation
  if (isViewingThisConversation) {
    setDmMessages((prev) => [...prev, incoming]);
  }

  // ✅ Update conversation list on left panel
  if (otherUserId !== null && !isNaN(otherUserId)) {
    setDmConversations((prev) => {
      const updated = new Map(prev);
      const userToStore = isCurrentUserSender ? receiverUserInfo : senderUserInfo;

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

  // ✅ Handle unread badge & notifications for receiver side (and unknown state fallback)
  if (otherUserId !== null && !isNaN(otherUserId)) {
    const shouldNotify = (!isCurrentUserKnown || isCurrentUserReceiver) && !isViewingThisConversation;

    if (shouldNotify) {
      setUnreadDmCount((prev) => {
        const next = new Set(prev);
        next.add(otherUserId);
        return next;
      });

      if (onNotification) {
        const notificationName = senderUserInfo.username || `User ${senderUserId}`;
        onNotification(
          notificationName, 
          messageText, 
          { senderId: senderUserId ?? undefined }
        );
      }
    } else if (isViewingThisConversation) {
      // User IS viewing - clear unread badge immediately
      setUnreadDmCount((prev) => {
        const next = new Set(prev);
        next.delete(otherUserId);
        return next;
      });
    }
  }
};
