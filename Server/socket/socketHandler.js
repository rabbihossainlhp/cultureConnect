
const handleSocketEvents = (io,socket) =>{

    socket.on('room:join',(roomId,userData)=>{
        socket.join(roomId);
        socket.emit('room:joined',{
            roomId,
            message: `You joind the room ${roomId}`
        });

        socket.to(roomId).emit('room:user_joined',{
            userId:userData.userId,
            username:userData.username,
            country:userData.country,
        });

        console.log(`${socket.id} joined this room `)
    });


    //room leave event....handle..>
    socket.on('room:leave',(roomId,userData)=>{
        socket.leave(roomId);

        socket.to(roomId).emit('room:user_left',{
            userId:userData.userId,
            username:userData.username,
        });
        console.log(`${socket.id} leave the room`);
    });



    socket.on('chat:send',(roomId,messageData)=>{
        io.to(roomId).emit('chat:new',{
            userId:messageData.userId,
            username:messageData.username,
            text:messageData.text,
            timestamp:messageData.timestamp
        });
        console.log(`message sent in room ${roomId}: ${messageData.text.substring(0,35)}...`);
    });
    
    
    socket.on('disconnect',(reason)=>{
        console.log('Socket disconnected:', socket.id, reason);
    });
}



module.exports = handleSocketEvents;