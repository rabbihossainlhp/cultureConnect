//dependencies...
const redisClient = require('../config/redis');


const saveMessageToRedis = async(roomId,message) =>{
    try{
        const key = `room:${roomId}:messages`;

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
    try{
        const key = `room:${roomId}:messages`;

        const messages = await redisClient.lrange(key,0,-1);

        return messages.map(msg =>JSON.parse(msg));
    }catch(err){
        console.error('Redis fetching error: ',err.message);
        return [];
    }
}



const clearRoomMessagesFromRedis = async (roomId)=>{
    try{
        const key = `room:${roomId}:messages`;
        await redisClient.del(key);
        console.log("Cleard messages from redis of room:",roomId);
    }catch(err){
        console.error(`Redis clear error: `,err.message);
    }
}






//Direct message (DM) Helpers...

const getDmRoomKey = (userId1, userId2) => {
  const minId = Math.min(userId1, userId2);
  const maxId = Math.max(userId1, userId2);
  return `dm:${minId}:${maxId}`;
};

const saveDmToRedis = async(currentUserId, targetUserId, message) =>{
    try{
        const dmKey = getDmRoomKey(currentUserId,targetUserId);
        //add msg end of the list...
        await redisClient.rpush(dmKey,JSON.stringify(message));

        const messageCount = await redisClient.llen(dmKey);
        if(messageCount>50){
            await redisClient.ltrim(dmKey,-50,-1);
        }

        console.log('DM saved to redis: '+currentUserId + '---->' + targetUserId);
    }catch(er){
        console.error('Redis DM save error: ', er.message);
    }
}





//to get dm messages 
const getDmFromRedis = async(currentUserId, targetUserId) =>{
    try{
        const dmKey = getDmRoomKey(currentUserId,targetUserId);
        //fetch message
        const messages = await redisClient.lrange(dmKey,0,-1);
        return messages.map(msg=>JSON.parse(msg));

    }catch(er){
        console.error('Redis DM fetch error: ', er.message);
        return [];
    }
}





// clear dm from redis...
const clearDmFromRedis = async(currentUserId, targetUserId) =>{
    try{
        const dmKey = getDmRoomKey(currentUserId,targetUserId);
        //delete the key...
        await redisClient.del(dmKey);

    }catch(er){
        console.error('Redis DM clear error: ', er.message);
    }
}





//export them...
module.exports = {
    saveMessageToRedis,
    getMessagesFromRedis,
    clearRoomMessagesFromRedis,
    saveDmToRedis,
    getDmFromRedis,
    clearDmFromRedis,
}
