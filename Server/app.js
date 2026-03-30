const express = require('express');
const {Server} = require('socket.io');
const {createServer} = require('http');
require('dotenv').config();
const useMiddleware = require('./middleware/common.middleware');
const socketAuthMiddleware  = require('./middleware/socketAuth.middleware');
const useRoutes = require('./routes/routes');
const User = require('./models/user.model');
const handleSocketEvents = require('./socket/socketHandler');
const Rooms = require('./models/room.model');
const RoomMessage = require('./models/room-message.model');
const RoomParticipants = require('./models/room-participants.model');
const CulturalPost = require('./models/cultural-post.model');




//Main app.
const app = express();


//use Common Middlewares...
useMiddleware(app);


//useAllRoutes...
useRoutes(app);


//use Basic route..
app.get('/',(req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            message:'Successfully working your server on this route'
        });
    }catch(err){
        console.log('Server error on root route');
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
})





//Connect DB
require('./config/db');


const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
        credentials:true,
    },
});

io.use(socketAuthMiddleware);

io.on('connection',(socket)=>{
    console.log("Socket connected:", socket.id);

    handleSocketEvents(io,socket);
})


app.set('io',io);



const port = process.env.PORT || 3000;
server.listen(port, async()=>{
    console.log(`your app is running on http://localhost:${port}`);
    try{
        await User.createUserTable();
        await Rooms.createRoomsTable();
        await RoomMessage.createRoomMessageTable();
        await RoomParticipants.createRoomParticipantsTable();
        await CulturalPost.createCulturalPostTable();
        console.log('Table created')
    }catch(err){
        console.error('error during creating table', err);
        console.error(err.stack);
    }
})