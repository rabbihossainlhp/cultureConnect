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
  console.log("📨 Processing DM:new event:", incoming);
  console.log(`📨 Raw sender_user_id: ${incoming.sender_user_id}, type: ${typeof incoming.sender_user_id}`);
  console.log(`📨 Raw receiver_user_id: ${incoming.receiver_user_id}, type: ${typeof incoming.receiver_user_id}`);

  // Extract sender and receiver IDs
  let senderUserId: number | null = incoming.sender_user_id || incoming.senderUserId;
  senderUserId = senderUserId ? Number(senderUserId) : null;

  let receiverUserId: number | null = incoming.receiver_user_id || incoming.receiverUserId;
  receiverUserId = receiverUserId ? Number(receiverUserId) : null;

  console.log(`📋 DM IDs - sender: ${senderUserId} (${typeof senderUserId}), receiver: ${receiverUserId} (${typeof receiverUserId})`);

  // Get current user ID from ref (always fresh)
  let currentUserId = currentUserIdRef.current;
  console.log(`👤 currentUserIdRef: ${currentUserId} (${typeof currentUserId}), isNaN: ${isNaN(currentUserId)}`);
  
  if (isNaN(currentUserId)) {
    // Fallback inference if needed
    const target = dmTargetRef.current;
    console.log(`⚠️ currentUserId is NaN, attempting fallback inference. dmTargetRef:`, target);
    if (target && dmMessagesRef.current.length > 0) {
      const targetUserId = Number(target.userId);
      const senderIds = dmMessagesRef.current.map(m => {
        const m_response = m as DirectMessageResponse;
        return Number(m_response.sender_user_id ?? m_response.senderUserId);
      });
      const inferred = senderIds.find(id => id !== targetUserId && !isNaN(id));
      if (inferred) {
        currentUserId = inferred;
        console.log(`✅ Inferred currentUserId: ${currentUserId}`);
      }
    }
  }

  console.log(`👤 Final current user: ${currentUserId}`);

  // Determine if current user is receiving this message
  const isCurrentUserReceiver = receiverUserId === currentUserId;
  const otherUserId = isCurrentUserReceiver ? senderUserId : receiverUserId;

  console.log(`🔄 isCurrentUserReceiver: ${isCurrentUserReceiver}, otherUserId: ${otherUserId}`);

  // Get fresh dmTarget from ref
  const currentDmTarget = dmTargetRef.current;
  const isViewingThisConversation =
    currentDmTarget &&
    (currentDmTarget.userId === String(otherUserId) || Number(currentDmTarget.userId) === otherUserId);

  console.log(`👁️ isViewingThisConversation: ${isViewingThisConversation}`);
  console.log(`👁️ currentDmTarget: ${currentDmTarget?.username} (userId: ${currentDmTarget?.userId}), otherUserId: ${otherUserId}`);

  const messageText = incoming.message_text || incoming.text || "Message";
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

  console.log("🔍 DM Handler Debug:", {
    isCurrentUserReceiver,
    isViewingThisConversation,
    currentUserId,
    senderUserId,
    receiverUserId,
    otherUserId,
    messageText,
  });

  // ✅ CRITICAL: Add message to chat window IMMEDIATELY if viewing this conversation
  if (isViewingThisConversation) {
    console.log("✅ Adding message to DM window in real-time");
    setDmMessages((prev) => [...prev, incoming]);
  }

  // ✅ Update conversation list on left panel
  if (otherUserId !== null && !isNaN(otherUserId)) {
    console.log(`💬 Updating conversation list for user ${otherUserId}`);
    setDmConversations((prev) => {
      const updated = new Map(prev);
      const userToStore = isCurrentUserReceiver ? senderUserInfo : receiverUserInfo;

      if (!updated.has(otherUserId)) {
        console.log(`➕ Adding new conversation with user ${otherUserId} (${userToStore.username})`);
        updated.set(otherUserId, {
          user: userToStore,
          lastMessage: messageText,
          timestamp: timestamp,
        });
      } else {
        console.log(`🔄 Updating existing conversation with user ${otherUserId}`);
        const existing = updated.get(otherUserId)!;
        updated.set(otherUserId, {
          ...existing,
          lastMessage: messageText,
          timestamp: timestamp,
        });
      }
      console.log(`📊 DM Conversations size: ${updated.size}`, Array.from(updated.entries()).map(([id, conv]) => `[${id}: ${conv.user.username}]`).join(", "));
      return updated;
    });
  } else {
    console.log(`⚠️ otherUserId is null or NaN (${otherUserId}), cannot update conversations`);
  }

  // ✅ Handle unread badge & notifications for BOTH sender and receiver
  if (otherUserId !== null && !isNaN(otherUserId)) {
    // ✅ Show notification and mark unread for BOTH parties if not viewing conversation
    if (!isViewingThisConversation) {
      console.log(`🔔 Marking as unread and showing notification for user ${otherUserId}`);
      setUnreadDmCount((prev) => {
        const next = new Set(prev);
        next.add(otherUserId);
        console.log(`📌 Unread count updated: ${next.size} unread conversations`);
        return next;
      });

      // Show notification to both sender and receiver
      if (onNotification) {
        // If current user is receiver, show sender's name. If sender, show receiver's name
        const notificationName = isCurrentUserReceiver 
          ? (senderUserInfo.username || `User ${senderUserId}`)
          : (receiverUserInfo.username || `User ${receiverUserId}`);
        console.log(`🔔 Triggering notification: "${notificationName}" - "${messageText}"`);
        onNotification(
          notificationName, 
          messageText, 
          { senderId: (isCurrentUserReceiver ? senderUserId : receiverUserId) ?? undefined }
        );
      } else {
        console.log(`⚠️ onNotification callback not provided`);
      }
    } else if (isViewingThisConversation) {
      // User IS viewing - clear unread badge immediately
      setUnreadDmCount((prev) => {
        const next = new Set(prev);
        next.delete(otherUserId);
        console.log(`✅ Cleared unread for user ${otherUserId}`);
        return next;
      });
    }
  } else {
    console.log(`⚠️ otherUserId is null or NaN (${otherUserId}), cannot update notifications`);
  }
};
