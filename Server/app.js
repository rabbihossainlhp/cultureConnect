const express = require('express');
require('dotenv').config();
const useMiddleware = require('./middleware/common.middleware');
const useRoutes = require('./routes/routes');
const User = require('./models/user.model');




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




const port = process.env.PORT || 3000;
app.listen(port, async()=>{
    console.log(`your app is running on http://localhost:${port}`);
    try{
        await User.createUserTable();
        console.log('Table created')
    }catch(err){
        console.log('error during creating table', err);
    }
})