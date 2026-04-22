const express = require('express');
const {Server} = require('socket.io');
const {createServer} = require('http');
require('dotenv').config();
const redisClient = require('./config/redis');
const useMiddleware = require('./middleware/common.middleware');
const socketAuthMiddleware  = require('./middleware/socketAuth.middleware');
const useRoutes = require('./routes/routes');
const User = require('./models/user.model');
const handleSocketEvents = require('./socket/socketHandler');
const handleDmEvents = require('./socket/dmSocketHandler');
const Rooms = require('./models/room.model');
const RoomMessage = require('./models/room-message.model');
const RoomParticipants = require('./models/room-participants.model');
const CulturalPost = require('./models/cultural-post.model');
const DirectMessage = require('./models/direct-message.model');
const EmailVerificationCode = require('./models/email-verification-code.model');




//Main app.
const app = express();


//use Common Middlewares...
useMiddleware(app);


// app.use((req,res,next)=>{
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//     console.log('Headers: ', req.headers);
//     console.log('Body: ',req.body);
//     next();
// })


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
    handleDmEvents(io,socket);
})

app.set('io',io);

app.get('/api/redis-test',async(req,res)=>{
    try{
        await redisClient.set('testKey','45324Test-value..');

        const value = await redisClient.get('testKey');

        return res.status(200).json({
            success:true,
            message:'redis working',
            data:value 
        });

        
    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Redis test failed',
            error:err.message
        })
    }
})







const port = process.env.PORT || 4713;
server.listen(port, async()=>{
    console.log(`your app is running on http://localhost:${port}`);
    try{
        await User.createUserTable();
        await Rooms.createRoomsTable();
        await Rooms.alterTableAddPasswordCol();
        await RoomMessage.createRoomMessageTable();
        await RoomParticipants.createRoomParticipantsTable();
        await CulturalPost.createCulturalPostTable();
        await DirectMessage.createDirectMessaeTable();
        await EmailVerificationCode.createEmailVerifyTable();
        console.log('Table created')
    }catch(err){
        console.error('error during creating table', err);
        console.error(err.stack);
    }
})