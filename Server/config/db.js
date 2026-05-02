
const {Pool} = require('pg');
require('dotenv').config();





const dbConnection = new Pool({
    connectionString:process.env.DB_CONNECTION_URI,
    ssl:{
        rejectUnauthorized:false
    },
})


const connectDB = async()=>{
    try{
        const res  = await dbConnection.query('SELECT NOW()');
        console.log("Database connection Successfully!!");

    }catch(err){
        console.log("Database connection failed: ",err)
    }


    dbConnection.on('connect',()=>{
        console.log('New Database connection established..');
    })
    dbConnection.on('error',(err)=>{
        console.log('Database error: ',err);
    })

}




const gracefulShutdown = async () =>{
    try{
        await dbConnection.end();
        console.log('Database connection closed..');
    }catch(err){
        console.log('Error shutdown DB connection',err.message);
    }

}

if(process.env.NODE_ENV !== 'test'){
    process.on('SIGTERM',gracefulShutdown);
    process.on('SIGINT',gracefulShutdown);
}






module.exports = {
    dbConnection,
    connectDB
};