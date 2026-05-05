const {createServer} = require('http');
const app = require('./app');
const initDB = require('./dbIniti');
const initSocket = require('./socket');
const { connectDB } = require('./config/db');
const { connectRedisClient } = require('./config/redis');


require('./config/db');

const server = createServer(app);

//init socket
const io = initSocket(server);
app.set('io',io);


const port = process.env.PORT || 4713;

server.listen(port, async()=>{
    console.log(`your app is running on http://localhost:${port}`);
    await connectDB();
    await connectRedisClient();
    await initDB();
})
