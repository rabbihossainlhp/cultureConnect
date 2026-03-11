const express = require('express');
const useMiddleware = require('./middleware/common.middleware');
const useRoutes = require('./routes/routes');



//Main app.
const app = express();

//use Common Middlewares...
useMiddleware(app);


//useAllRoutes...
useRoutes(app);


//use Basic route..
app.use('/',(req,res)=>{
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






app.listen(3333,()=>{console.log(
    "your app is running on port 3333"
)})