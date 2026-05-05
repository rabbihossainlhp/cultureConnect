const express = require('express');
require('dotenv').config();

const redisClient = require('./config/redis');
const useMiddleware = require('./middleware/common.middleware');
const useRoutes = require('./routes/routes');



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





//export app.
module.exports = app;