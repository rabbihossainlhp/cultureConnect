//dependencies....
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { getMessagesFromRedis, saveMessageToRedis } = require('../redis/redis.helper');


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
            const password = payload?.password || null;
            const room = await ensureActiveRoom(roomId);

            if(!roomId){
                return socket.emit('socket:error',{code:'INVALID ROOM', message:'invalid room id'});
            }
            if(!room){
                return socket.emit('socket:error',{code:'INACTIVE ROOM', message:'Inactive room not able to receive user'});
            }

            if(room.visibility === 'private'){
                if(!password){
                    return socket.emit('socket:error',{
                        code:'PASSWORD REQURIED',
                        message:'Password required for joining in a private room'
                    })
                }

                const findRoom = await db.query(`SELECT * FROM rooms WHERE id=$1`,[roomId]);
                const matchPassword = await bcrypt.compare(password,findRoom.rows[0].password);
                if(!matchPassword){
                    return socket.emit('socket:error',{
                        code:'PASSWORD INCORRECT or INVALID ROOM',
                        message:'Password not correct for joining in a private room or this room dose not exists'
                    })
                }
            }

            await setParticipantsOnline(roomId, user.id);
            socket.join(String(roomId));

            const redisMessages = await getMessagesFromRedis(roomId);

            let recentMessages;

            if(redisMessages.length >0){
                recentMessages = redisMessages;
                console.log(`Loaded ${recentMessages.length} messages from Redis..`);
            }else{
                recentMessages = await fetchRecentMessages(roomId);

                for(const msg of recentMessages){
                    await saveMessageToRedis(roomId,msg);
                }
                console.log(`Loaded ${recentMessages.length} messages from redis`);
            }

            const [onlineUsers] = await Promise.all([
                fetchOnlineUsers(roomId),
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



            const messageData = {
                id:Date.now()+Math.random(),
                roomId:roomId,
                userId:user.id,
                username:user.username,
                text:text,
                timestamp:new Date()
            };


            await saveMessageToRedis(roomId,messageData);

            //broadcast message to all users
            io.to(String(roomId)).emit('chat:new',messageData);



            const insertQuery = `
                INSERT INTO room_messages(room_id, sender_user_id, message_text, message_type)
                VALUES($1, $2, $3, 'text')
                RETURNING id, room_id AS "roomId", message_text AS text, created_at AS timestamp
            `;


            db.query(insertQuery,[roomId,user.id, text])
                .then((insertResult)=>{
                    const saved = insertResult.rows[0];
                    console.log(`Message permanently saved to DB: ${saved.id}`);
                })
                .catch((err) =>{
                    console.error(`Database (psql) saved failed: `,err.message);
                })


            // const insertResult = await db.query(insertQuery,[roomId,user.id, text]);
            // const saved = insertResult.rows[0];
            
            console.log(`message sent in room  instantly from redis -->${roomId}: ${text.substring(0,35)}...`);
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