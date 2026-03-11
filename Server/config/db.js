const {Pool} = require('pg');
require('dotenv').config();


const dbConnection = new Pool({
    connectionString:process.env.DB_CONNECTION_URI,
    connectionTimeoutMillis:30000,
    ssl:{
        rejectUnauthorized:false
    },
})


dbConnection.query('SELECT NOW()', (err,res)=>{
    if(err){
        console.log('Database Connectin failed:!! ', err);
    }else{
        console.log('Database Connected Successfully!! ',res)
    }
})


dbConnection.on('connect',()=>{
    console.log('New Database connection established..');
})
dbConnection.on('error',(err)=>{
    console.log('Database error: ',err);
})



const gracefulShutdown = async () =>{
    try{
        await dbConnection.end();
        console.log('Database connection closed..');
    }catch(err){
        console.log('Error shutdown DB connection',err.message);
    }

}

process.on('SIGTERM',gracefulShutdown);
process.on('SIGINT',gracefulShutdown);





module.exports = dbConnection;