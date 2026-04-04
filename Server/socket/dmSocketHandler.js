// Dependencies
const DirectMessage = require("../models/direct-message.model");
const db = require("../config/db");

const MAX_DM_LENGTH = 500;

// Normalize roomId: Convert to integer, return null if invalid
const normalizedRoomId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Normalize userId: Convert to integer, return null if invalid
const normalizedUserId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Normalize text: Trim whitespace, return empty string if not string
const normalizedText = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

// Creates deterministic DM room key: "dm:1:5" (always smaller ID first)
const getDmRoomKey = (userId1, userId2) => {
  const minId = Math.min(userId1, userId2);
  const maxId = Math.max(userId1, userId2);
  return `dm:${minId}:${maxId}`;
};

// Check if both users are online in the same group room
const areBothInRoom = async (roomId, userId1, userId2, io) => {
  try {
    const roomKey = String(roomId);
    console.log(`\nDM CHECK START`);
    console.log(`Checking room: "${roomKey}" for users ${userId1} and ${userId2}`);
    
    // Debug: Log all rooms
    const allRooms = io.sockets.adapter.rooms;
    console.log(`Available rooms:`, Array.from(allRooms.keys()).slice(0, 10));
    
    const socketsInRoom = await io.sockets.adapter.rooms.get(roomKey);
    console.log(`Sockets in room "${roomKey}":`, socketsInRoom?.size || 0);

    if (!socketsInRoom || socketsInRoom.size === 0) {
      console.log(` NO SOCKETS FOUND in room "${roomKey}"`);
      return false;
    }

    let user1Found = false;
    let user2Found = false;
    let usersInRoom = [];
    let socketDetails = [];

    for (const socketId of socketsInRoom) {
      const socket = io.sockets.sockets.get(socketId);
      if (!socket) {
        console.log(`Socket ${socketId} not found in sockets collection`);
        continue;
      }

      console.log(`\n  Socket: ${socketId}`);
      console.log(`socket.data exists: ${!!socket.data}`);
      console.log(`socket.data.user exists: ${!!socket.data?.user}`);
      
      const userId = socket.data?.user?.id;
      console.log(`    - userId: ${userId}`);
      
      if (userId) {
        usersInRoom.push(userId);
        socketDetails.push({ socketId, userId });
        if (userId === userId1) user1Found = true;
        if (userId === userId2) user2Found = true;
      } else {
        console.log(` No user.id found in socket.data`);
      }
    }

    console.log(`\n Summary:`);
    console.log(`   Users found in room: ${usersInRoom}`);
    console.log(`   User ${userId1} found: ${user1Found}`);
    console.log(`   User ${userId2} found: ${user2Found}`);
    console.log(` DM CHECK END \n`);

    return user1Found && user2Found;
  } catch (error) {
    console.error("Error checking both users in room:", error.message);
    console.error(error.stack);
    return false;
  }
};

// Fetch target user details from database
const fetchTargetUser = async (userId) => {
  try {
    const query = `SELECT id, username, country FROM users WHERE id = $1`;
    const result = await db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      userId: user.id,
      username: user.username,
      country: user.country,
    };
  } catch (error) {
    console.error("Error fetching target user:", error.message);
    return null;
  }
};




const getDmHistory = async(currentUserId,targetUserId,limit = 30)=>{
    try{
        const query = `
            SELECT id,sender_user_id,receiver_user_id, message_text,created_at 
            FROM direct_messages
            WHERE (sender_user_id = $1 AND receiver_user_id = $2)
                OR (sender_user_id = $2 AND receiver_user_id = $1)
            ORDER BY created_at ASC
            LIMIT $3
        `;
        const result = await db.query(query,[currentUserId,targetUserId, limit]);
        return result.rows;
    }catch(err){
        console.error('Error fetching DM history: ',err.message);
        throw err;
    }
};

const saveDmMessage = async (currentUserId,targetUserId,text) =>{
    try{
        const query = `
            INSERT INTO direct_messages(sender_user_id,receiver_user_id,message_text)
            VALUES($1,$2,$3)
            RETURNING id,sender_user_id,receiver_user_id,message_text,created_at
        `;
        const result = await db.query(query,[currentUserId,targetUserId, text]);
        return result.rows[0];
    }catch(err){
        console.error('Error saving DM message: ',err.message);
        throw err;
    }
}




// Fetch DM conversation history between two users
const fetchDmHistory = async (currentUserId, targetUserId, limit = 30) => {
  try {
    const messages = await getDmHistory(currentUserId, targetUserId, limit);
    return messages || [];
  } catch (error) {
    console.error("Error fetching DM history:", error.message);
    return [];
  }
};





// Main DM Socket Handler - Called when user connects
const handleDmEvents = (io, socket) => {
  const user = socket.data.user;

  if (!user) {
    socket.emit("socket:error", { code: "UNAUTHORIZED", message: "User context missing" });
    socket.disconnect(true);
    return;
  }

  // DM HISTORY EVENT: Frontend clicks user to open DM
  socket.on("dm:history", async (payload) => {
    try {
      const roomId = normalizedRoomId(payload?.roomId);
      const targetUserId = normalizedUserId(payload?.targetUserId);

      // Validation: Valid room and user
      if (!roomId) {
        return socket.emit("socket:error", { code: "INVALID_ROOM", message: "Invalid room ID" });
      }
      if (!targetUserId) {
        return socket.emit("socket:error", { code: "INVALID_USER", message: "Invalid target user ID" });
      }

      // Validation: Can't DM yourself
      if (user.id === targetUserId) {
        return socket.emit("socket:error", {
          code: "INVALID_TARGET",
          message: "Cannot message yourself",
        });
      }

      // Validation: Both users must be online in the same room
      const bothInRoom = await areBothInRoom(roomId, user.id, targetUserId, io);
      if (!bothInRoom) {
        return socket.emit("socket:error", {
          code: "DM_PERMISSION_DENIED",
          message: "Both users must be in the same room to start DM",
        });
      }

      // Fetch target user details
      const targetUser = await fetchTargetUser(targetUserId);
      if (!targetUser) {
        return socket.emit("socket:error", { code: "USER_NOT_FOUND", message: "Target user not found" });
      }

      // Create DM room and join it
      const dmRoomKey = getDmRoomKey(user.id, targetUserId);
      socket.join(dmRoomKey);

      // Fetch conversation history
      const messages = await fetchDmHistory(user.id, targetUserId);

      // Send DM history to frontend
      socket.emit("dm:history", {
        target: targetUser,
        messages: messages,
      });

      console.log(`✓ DM history: User ${user.id} opened conversation with User ${targetUserId}`);
    } catch (error) {
      console.error("dm:history error:", error.message);
      socket.emit("socket:error", { code: "DM_HISTORY_ERROR", message: "Failed to load DM history" });
    }
  });

  // DM SEND EVENT: Frontend sends a DM message
  socket.on("dm:send", async (payload) => {
    try {
      const roomId = normalizedRoomId(payload?.roomId);
      const targetUserId = normalizedUserId(payload?.targetUserId);
      const text = normalizedText(payload?.text);

      // Validation: Valid room and user
      if (!roomId) {
        return socket.emit("socket:error", { code: "INVALID_ROOM", message: "Invalid room ID" });
      }
      if (!targetUserId) {
        return socket.emit("socket:error", { code: "INVALID_USER", message: "Invalid target user ID" });
      }

      // Validation: Message not empty
      if (!text) {
        return socket.emit("socket:error", { code: "EMPTY_MESSAGE", message: "Message cannot be empty" });
      }

      // Validation: Message length limit
      if (text.length > MAX_DM_LENGTH) {
        return socket.emit("socket:error", {
          code: "MESSAGE_TOO_LONG",
          message: `Message must be less than ${MAX_DM_LENGTH} characters`,
        });
      }

      // Validation: Can't DM yourself
      if (user.id === targetUserId) {
        return socket.emit("socket:error", { code: "INVALID_TARGET", message: "Cannot message yourself" });
      }

      // Validation: Both users must be online in the room
      const bothInRoom = await areBothInRoom(roomId, user.id, targetUserId, io);
      if (!bothInRoom) {
        return socket.emit("socket:error", {
          code: "DM_PERMISSION_DENIED",
          message: "Both users must be in the same room to send DM",
        });
      }

      // Save DM to database
      const savedMessage = await saveDmMessage(user.id, targetUserId, text);

      // Broadcast to DM room
      const dmRoomKey = getDmRoomKey(user.id, targetUserId);
      socket.join(dmRoomKey);

      io.to(dmRoomKey).emit("dm:new", {
        id: savedMessage.id,
        senderUserId: savedMessage.sender_user_id,
        receiverUserId: savedMessage.receiver_user_id,
        text: savedMessage.message_text,
        timestamp: savedMessage.created_at,
      });

      console.log(`✓ DM sent: User ${user.id} → User ${targetUserId}`);
    } catch (error) {
      console.error("dm:send error:", error.message);
      socket.emit("socket:error", { code: "DM_SEND_ERROR", message: "Failed to send DM" });
    }
  });
};

module.exports = handleDmEvents;
