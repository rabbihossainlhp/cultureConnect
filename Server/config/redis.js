//dependencies....
const {createClient} = require('redis');


const isProd = process.env.NODE_ENV === 'production';

const redisUrl = isProd ? process.env.REDIS_URL : 'redis://localhost:6379';

const client = createClient({
    url:redisUrl,
    port:6379,
    socket:{
        reconnectStrategy:(reties) =>{
            const delay = Math.min(reties * 50,500);
            return delay
        }
    }
});



const connectRedisClient = async()=>{
    try{
        await client.connect();
        console.log("Redis Connected");

        client.on('ready',()=>{
            console.log('Redis Client Ready');
        });

    }catch(err){
        console.error('Redis connection error: ',err.message);
    }
}




client.on('error',(err)=>{
    console.error('Redis Client Error: ', err.message);
});



module.exports = {
    client,
    connectRedisClient
};