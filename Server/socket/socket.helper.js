//dependencies....
const db = require('../config/db');

const normalizedRoomId = (value) =>{
    const n = Number(value);
    return Number.isInteger(n) && n>0? n : null;
};


const normalizedText = (value) =>{
    if(typeof value !== 'string') return '';
    return value.trim();
};


const ensureActiveRoom = async (roomId) =>{
    const roomQuery = `
        SELECT id, slug, name, language, visibility, status, host_user_id
        FROM rooms
        WHERE id=$1 AND  status='active'
        LIMIT 1
    `;

    const roomResult = await db.query(roomQuery,[roomId]);
    return roomResult.rows[0] || null;
};


const fetchOnlineUsers = async(roomId)=>{
    const usersQuery = `
        SELECT 
        u.id AS "userId",
        u.username,
        u.country,
        u.profile_picture

        FROM room_participants rp JOIN users u ON u.id = rp.user_id
        WHERE rp.room_id = $1
        AND rp.is_online = true
        ORDER BY u.username ASC
    `;

    const usersResult = await db.query(usersQuery,[roomId]);
    return usersResult.rows;
};


const fetchRecentMessages = async(roomId) =>{
    const messageQuery = `
        SELECT 
        rm.id,
        rm.room_id AS "roomId",
        rm.message_text AS text,
        rm.created_at AS timestamp,
        u.id AS "userId",
        u.username
        
        FROM room_messages rm
        JOIN users u ON u.id = rm.sender_user_id
        WHERE rm.room_id = $1
        AND rm.deleted_at IS NULL
        ORDER BY rm.created_at DESC
        LIMIT 20
    `;

    const result = await db.query(messageQuery,[roomId]);
    return result.rows.reverse();
};


const setParticipantsOnline = async (roomId,userId) =>{
    const onlineUserQuery = `
        INSERT INTO room_participants (room_id,user_id,role,is_online,joined_at,left_at)
        VALUES ($1,$2, 'member', true, CURRENT_TIMESTAMP,NULL)
        ON CONFLICT (room_id, user_id)
        DO UPDATE SET 
            is_online = true,
            left_at = NULL
    `;

    await db.query(onlineUserQuery,[roomId,userId]);
};


const setParticipantsOffline = async (roomId,userId) =>{
    const offlineUserQuery = `
        UPDATE room_participants
        SET is_online = false,
            left_at = CURRENT_TIMESTAMP
        WHERE room_id = $1
        AND user_id = $2
    `;

    await db.query(offlineUserQuery,[roomId,userId]);
};



const isParticipantsOnline = async(roomId,userId) =>{
    const membershipsQuery = `
        SELECT 1
        FROM room_participants
        WHERE room_id = $1
        AND user_id = $2
        AND is_online = true
        LIMIT 1
    `;

    const result = await db.query(membershipsQuery,[roomId,userId]);
    return result.rows.length > 0;
};




const addRommToUserJoinedRoom = async (userId,roomId) =>{
    console.log(`DEBUGGG: adding room ${roomId} (type: ${typeof roomId}) to user ${userId}`)
    const query = `
        UPDATE users
        SET joined_rooms = array_append(
            COALESCE(joined_rooms, '{}'::integer[]),
            $1::integer
        )
        WHERE id=$2
        AND NOT $1::integer= ANY(COALESCE(joined_rooms, '{}'::integer[]))
        RETURNING joined_rooms
    `;

    try{
        const result = await db.query(query,[roomId,userId]);
        if(result.rows.length>0){
            console.log(`Room ${roomId} added to user ${userId}'s joined_rooms:`,result.rows[0].joined_rooms)
        }
    }catch(err){
        console.error('Error adding room to joined_rooms column',err.message);
        throw err;
    }
}



const removeRoomFromUserJoinedRooms = async (userId, roomId) => {
    const query = `
        UPDATE users 
        SET joined_rooms = array_remove(joined_rooms, $1)
        WHERE id = $2
        RETURNING joined_rooms
    `;
    
    try {
        const result = await db.query(query, [roomId, userId]);
        if (result.rows.length > 0) {
            console.log(` Room ${roomId} removed from user ${userId}'s joined_rooms:`, result.rows[0].joined_rooms);
            return result.rows[0].joined_rooms;
        }
    } catch(err) {
        console.error(` Error removing room from joined_rooms:`, err.message);
        throw err;
    }
};



const getUserJoinedRooms = async(userId) =>{
    const query = `
        SELECT joined_rooms 
        FROM users
        WHERE id =  $1
    `

    try {
        const result = await db.query(query, [userId]);
        if (result.rows.length > 0) {
            const joinedRooms = result.rows[0].joined_rooms || [];
            console.log(` User ${userId} is in rooms: ${joinedRooms}`);
            return result.rows[0].joined_rooms;
        }
    } catch(err) {
        console.error(` Error fetching user's joined_rooms:`, err.message);
        throw err;
    }
}






//export them....
module.exports = {
    normalizedRoomId,
    normalizedText,
    ensureActiveRoom,
    fetchOnlineUsers,
    fetchRecentMessages,
    setParticipantsOnline,
    setParticipantsOffline,
    isParticipantsOnline,
    addRommToUserJoinedRoom,
    removeRoomFromUserJoinedRooms,
    getUserJoinedRooms

}