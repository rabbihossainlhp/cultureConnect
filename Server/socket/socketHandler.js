//dependencies....
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { getMessagesFromRedis, saveMessageToRedis } = require('../redis/redis.helper');
const {
    ensureActiveRoom, 
    setParticipantsOnline, 
    getUserJoinedRooms, 
    fetchRecentMessages, 
    removeRoomFromUserJoinedRooms, 
    setParticipantsOffline, 
    normalizedRoomId, 
    normalizedText, 
    fetchOnlineUsers, 
    isParticipantsOnline,
    addRommToUserJoinedRoom
} = require('./socket.helper');





const MAX_MESSAGE_LENGTH = 500;



const handleSocketEvents = (io,socket) =>{

    const user = socket.data.user;


    if(!user){
        socket.emit('socket:error',{code:'UNAUTHORIZED',message:'user context missing..'});
        socket.disconnect(true);
        return;
    }


    //auto-rejoin functionality...
    (async ()=>{
        try{
            console.log(`User${user.username} is connected, checking joined_rooms..`);
            
            const joinedRooms = await getUserJoinedRooms(user.id);

            if(joinedRooms.length>0){
                console.log(`auto   rejoining user to rooms: [${joinedRooms.join(', ')}]`);
                
                for(let roomId of joinedRooms){
                    try{
                        const room = await ensureActiveRoom(roomId);
                        if(room){
                            await setParticipantsOnline(roomId,user.id);
                            socket.join(String(roomId));

                            const redisMessages = await getMessagesFromRedis(roomId);

                            let recentMessages;
                            if(redisMessages.length>0){
                                recentMessages = redisMessages;
                                console.log(`Auto rejoined ${user.username} to room ${roomId} (${redisMessages.length} msgs from redis..)`);
                            }else{
                                recentMessages = await fetchRecentMessages(roomId);
                                for(let msg of recentMessages){
                                    await saveMessageToRedis(roomId,msg);
                                }
                                console.log(`Auto rejoined ${user.username} to room ${roomId} (${recentMessages.length} msgs from DB..)`);
                            }

                            const onlineUsers = await fetchOnlineUsers(roomId);

                            socket.emit('room:joined', {
                                room,
                                users:onlineUsers,
                                messages:recentMessages
                            })


                            socket.to(String(roomId)).emit('room:user_joined',{
                                userId:user.id,
                                username:user.username,
                                country:user.country,
                            });
                        }else{
                            console.log(`Room ${roomId} is inactive room, removing   from joined_rooms`);
                            await removeRoomFromUserJoinedRooms(user.id,roomId)
                        }
                    }catch(err){
                        console.error('Error auto-rejoining room ', err.message);
                    }
                }
            }else{
                console.log('User has no joined room yet');
            }
        }catch(err){
            console.error('Error on socket connect: ', err.message);
        }
    })();


    
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

                if(!findRoom.rows[0] || !findRoom.rows[0].room_password){
                    return socket.emit('socket:error',{
                        code:'NVALID ROOM',
                        message:'May this room dose not exists'
                    })
                }
                const matchPassword = await bcrypt.compare(password,findRoom.rows[0].room_password);
                if(!matchPassword){
                    return socket.emit('socket:error',{
                        code:'PASSWORD INCORRECT ',
                        message:'Password not correct for joining in a private room '
                    })
                }
            }

            await setParticipantsOnline(roomId, user.id);
            
            await addRommToUserJoinedRoom(user.id,roomId);

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

            await removeRoomFromUserJoinedRooms(user.id,roomId);

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
    


    socket.on('room:load',async(payload)=>{
        try{
            const roomId = normalizedRoomId(payload?.roomId);
            if(!roomId){
                return socket.emit('socket:error',{
                    code:'INVALID ROOM',
                    message:'Invalid room id'
                })
            }

            const redisMessages = await getMessagesFromRedis(roomId);
            let recentMessages;

            if(redisMessages.length>0){
                recentMessages = redisMessages;
            }else{
                recentMessages = await fetchRecentMessages(roomId);
                for(let msg of recentMessages){
                    await saveMessageToRedis(roomId,msg);
                }
            }

            socket.emit('room:messages',{roomId,messages:recentMessages});
            console.log(`Loaded ${recentMessages.length} messages for room ${roomId}`);
        }catch(err){
            console.error('Error during socket-s room load',err.message);
        }
    })


    
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