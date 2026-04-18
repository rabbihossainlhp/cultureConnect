//dependencies....
const db = require('../config/db');
const redisClient = require('../config/redis');


const MAX_MESSAGE_LENGTH = 500;


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




const saveMessageToRedis = async(roomId,message) =>{
    try{
        const key = `room:${roomId}:message`;

        await redisClient.rpush(key,JSON.stringify(message));

        const messageCount = await redisClient.llen(key);

        if(messageCount>100){
            await redisClient.ltrim(key,-100,-1);
        }

        console.log('Message saved to Redis for room --> ', roomId);

    }catch(error){
        console.error("Save error to Redis..",error.message);
    }
}



const getMessagesFromRedis = async (roomId) =>{
    
}








const handleSocketEvents = (io,socket) =>{

    const user = socket.data.user;


    if(!user){
        socket.emit('socket:error',{code:'UNAUTHORIZED',message:'user context missing..'});
        socket.disconnect(true);
        return;
    }
    
    socket.on('room:join', async(payload)=>{
        try{
            const roomId = normalizedRoomId(payload?.roomId ?? payload);
            const room = await ensureActiveRoom(roomId);

            if(!roomId){
                return socket.emit('socket:error',{code:'INVALID ROOM', message:'invalid room id'});
            }
            if(!room){
                return socket.emit('socket:error',{code:'INACTIVE ROOM', message:'Inactive room not able to receive user'});
            }


            await setParticipantsOnline(roomId, user.id);
            socket.join(String(roomId));

            const [onlineUsers,recentMessages] = await Promise.all([
                fetchOnlineUsers(roomId),
                fetchRecentMessages(roomId),
            ]);


            socket.emit('room:joined',{
                room,
                users:onlineUsers,
                messages: recentMessages, 
            });

            socket.to(String(roomId)).emit('room:user_joined',{
                userId:user.id,
                username:user.username,
                country:user.country,
            });

            console.log(`${socket.id} joined this room `)
        }catch(err){
            console.error('room:join error:' ,err.message);
            socket.emit('socket:error', {code:'JOIN_FAILED', message:'Faild to join the room'});
        };
        
    });


    //room leave event....handle..>
    socket.on('room:leave',async(payload)=>{
        try{
            const roomId = normalizedRoomId(payload?.roomId?? payload);
            if(!roomId){
                return socket.emit('socket:error', {code:"INVALID ROOM", message:'invalid room id'});
            };

            await setParticipantsOffline(roomId,user.id);
            socket.leave(String(roomId));

            socket.to(String(roomId)).emit('room:user_left',{
                userId:user.id,
                username:user.username,
            });
            console.log(`${socket.id} leave the room`);
        }catch(err){
            console.error('room:leave error:' ,err.message);
            socket.emit('socket:error', {code:'LEAVE_FAILED', message:'Faild to leave the room'});
        };
        
    });



    socket.on('chat:send',async(payload)=>{

        try{

            const roomId = normalizedRoomId(payload?.roomId);
            const text = normalizedText(payload?.text);

            if(!roomId){
                return socket.emit('socket:error', {code:"INVALID ROOM", message:'invalid room id'});
            }
            if(!text){
                return socket.emit('socket:error', {code:"EMPTY_MESSAGE", message:'message cannot be empty'});
            }


            if(text.length > MAX_MESSAGE_LENGTH){
                return socket.emit('socket:error',{
                    code:'MESSAGE_TOO_LONG',
                    message:`Message too long. Max ${MAX_MESSAGE_LENGTH} characters`,
                });
            };

            const memeberOnline = await isParticipantsOnline(roomId,user.id);
            if(!memeberOnline){
                return socket.emit('socket:error', {
                    code:'NOT_IN_ROOM',
                    message:'Join room before to sending message',
                });
            };


            const insertQuery = `
                INSERT INTO room_messages(room_id, sender_user_id, message_text, message_type)
                VALUES($1, $2, $3, 'text')
                RETURNING id, room_id AS "roomId", message_text AS text, created_at AS timestamp
            `;

            const insertResult = await db.query(insertQuery,[roomId,user.id, text]);
            const saved = insertResult.rows[0];


            io.to(String(roomId)).emit('chat:new',{
                id:saved.id,
                roomId:saved.roomId,
                userId:user.id,
                username: user.username,
                text: saved.text,
                timestamp:saved.timestamp
            });
            console.log(`message sent in room ${roomId}: ${text.substring(0,35)}...`);
        }catch(err){
            console.error('caht:send error:' ,err.message);
            socket.emit('socket:error', {code:'SEND_FAILED', message:'Faild to send message in the room'});
        };
    });
    
    
    socket.on('disconnect', async(reason)=>{
        try{
            const joinedRooms = [...socket.rooms].filter((r)=> r !== socket.id);
            
            for(const room of joinedRooms){
                const roomId = normalizedRoomId(room);
                if(!roomId) continue;

                await setParticipantsOffline(roomId, user.id);
                
                socket.to(String(roomId)).emit('room:user_left',{
                    userId: user.id,
                    username:user.username,
                });
            }

            console.log('Socket disconnected:', socket.id, reason);

        }catch(err){
            console.error('disconnect cleanup error: ', err.message);
        }
    });
}



module.exports = handleSocketEvents;