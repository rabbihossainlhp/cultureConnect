const {Server} = require('socket.io');
const socketAuthMiddleware  = require('./middleware/socketAuth.middleware');
const handleSocketEvents = require('./socket/socketHandler');
const handleDmEvents = require('./socket/dmSocketHandler');


const initSocket = (server)=>{
    const io = new Server(server,{
        cors:{
            origin:[process.env.CLIENT_URL || 'http://localhost:5173'],
            credentials:true,
        },
    });

    io.use(socketAuthMiddleware);
    
    io.on('connection',(socket)=>{
        console.log("Socket connected:", socket.id);
    
        handleSocketEvents(io,socket);
        handleDmEvents(io,socket);
    });

    return io;
}



module.exports = initSocket;