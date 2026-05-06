//dependencies....
const {createClient} = require('redis');


const isProd = process.env.NODE_ENV === 'production';

const redisUrl = isProd ? (process.env.REDIS_URL || "").trim() : 'redis://localhost:6379';


if(!redisUrl){
    throw new Error("Redus URL missing in production env.");
}


const client = createClient({
    url:redisUrl,

    socket:{
        connectTimeout:10000,
        keepAlive:10000,
        reconnectStrategy:(retries) =>{
            const delay = Math.min(retries * 200,5000);
            return delay
        }
    }
});



const connectRedisClient = async()=>{
    try{
        if(!client.isOpen){
            await client.connect();
        }
        await client.ping();
        console.log("Redis Connected");

    }catch(err){
        console.error('Redis connection error: ',err);
    }
}



client.on('ready',()=>{
    console.log('Redis Client Ready');
});

client.on('error',(err)=>{
    console.error('Redis Client Error: ', err.message);
});


client.on('reconnecting',()=>{
    console.log('Redis reconnecting....');
});



module.exports = {
    client,
    connectRedisClient
};