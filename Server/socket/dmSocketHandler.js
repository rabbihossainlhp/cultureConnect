// Dependencies
const DirectMessage = require("../models/direct-message.model");
const db = require("../config/db");
const { saveDmToRedis, getDmFromRedis,getDmRoomKey,clearDmFromRedis, batchSaveDmToRedis } = require("../redis/redis.helper");





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
    const query = `SELECT id, username, country,profile_picture FROM users WHERE id = $1`;
    const result = await db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      userId: user.id,
      username: user.username,
      country: user.country,
      profile_picture:user.profile_picture,
    };
  } catch (error) {
    console.error("Error fetching target user:", error.message);
    return null;
  }
};




const getDmHistory = async(currentUserId,targetUserId,limit = 30)=>{
    try{
        const query = `
            SELECT 
            dm.id,
            dm.sender_user_id,
            u_sender.username as sender_username,
            u_sender.country as sender_country,
            u_sender.profile_picture as sender_profile_picture,
            dm.receiver_user_id,
            u_receiver.username as receiver_username,
            u_receiver.country as receiver_country,
            u_receiver.profile_picture as receiver_profile_picture,
            dm.message_text,
            dm.created_at
            FROM direct_messages dm
            LEFT JOIN users u_sender ON dm.sender_user_id = u_sender.id
            LEFT JOIN users u_receiver ON dm.receiver_user_id = u_receiver.id
            WHERE (dm.sender_user_id = $1 AND dm.receiver_user_id = $2)
                OR (dm.sender_user_id = $2 AND dm.receiver_user_id = $1)
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
      // const bothInRoom = await areBothInRoom(roomId, user.id, targetUserId, io);
      // if (!bothInRoom) {
      //   return socket.emit("socket:error", {
      //     code: "DM_PERMISSION_DENIED",
      //     message: "Both users must be in the same room to start DM",
      //   });
      // }

      // Fetch target user details
      const targetUser = await fetchTargetUser(targetUserId);
      if (!targetUser) {
        return socket.emit("socket:error", { code: "USER_NOT_FOUND", message: "Target user not found" });
      }

      // Create DM room and join it
      const dmRoomKey = getDmRoomKey(user.id, targetUserId);
      socket.join(dmRoomKey);

      // Fetch conversation history
      const redisDms = await getDmFromRedis(user.id,targetUserId);

      let messages;
      if(redisDms.length>0){
        messages = redisDms;
        console.log(`Loaded ${redisDms.length} DMs from Redis`);
      }else{
        messages = await fetchDmHistory(user.id, targetUserId);
        for(const msg of messages){
          await batchSaveDmToRedis(user.id,targetUserId,msg);
        }
        console.log(`Loaded ${messages.length} DMs from PSQL`);
      }


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
      const receiverUser = await fetchTargetUser(targetUserId);

      // Validation: Valid room and user
      if (!roomId) {
        return socket.emit("socket:error", { code: "INVALID_ROOM", message: "Invalid room ID" });
      }
      if (!targetUserId) {
        return socket.emit("socket:error", { code: "INVALID_USER", message: "Invalid target user ID" });
      }

      if (!text) {
        return socket.emit("socket:error", { code: "EMPTY_MESSAGE", message: "Message cannot be empty" });
      }

      if (text.length > MAX_DM_LENGTH) {
        return socket.emit("socket:error", {
          code: "MESSAGE_TOO_LONG",
          message: `Message must be less than ${MAX_DM_LENGTH} characters`,
        });
      }

      if (user.id === targetUserId) {
        return socket.emit("socket:error", { code: "INVALID_TARGET", message: "Cannot message yourself" });
      }

      // const bothInRoom = await areBothInRoom(roomId, user.id, targetUserId, io);
      // if (!bothInRoom) {
      //   return socket.emit("socket:error", {
      //     code: "DM_PERMISSION_DENIED",
      //     message: "Both users must be in the same room to send DM",
      //   });
      // }

      //first handle save to radis....

      const msseageData = {
        id: Date.now() + Math.random(),
        sender_user_id: user.id,
        sender_username:user.username,
        sender_country:user.country,
        sender_profile_picture:user.profile_picture || "",
        receiver_user_id: targetUserId,
        receiver_username:receiverUser?.username || `User ${targetUserId}`,
        receiver_country:receiverUser?.country || "",
        receiver_profile_picture: receiverUser?.profile_picture || "",
        message_text: text,
        created_at: new Date(),
      }

      await saveDmToRedis(user.id,targetUserId,msseageData);

      // Save DM to database --> PSQL
      saveDmMessage(user.id, targetUserId, text)
        .then((savedMsg)=>{
          console.log(` DM saved to DB: ${savedMsg.id}`);
        })
        .catch((err)=>{
          console.error(' DB save failed: ',err.message);
        })

      // Broadcast to DM room
      const dmRoomKey = getDmRoomKey(user.id, targetUserId);
      io.to(String(dmRoomKey)).emit('dm:new',msseageData);


      console.log(`DM sent: User ${user.id} → User ${targetUserId}`);
    } catch (error) {
      console.error("dm:send error:", error.message);
      socket.emit("socket:error", { code: "DM_SEND_ERROR", message: "Failed to send DM" });
    }
  });
};

module.exports = handleDmEvents;
