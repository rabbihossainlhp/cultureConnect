const db = require('../config/db');


const authMiddleware = async (req,res,next) =>{
    try{
        const token = req.cookies['access_token'];
        const query = `SELECT `;
        console.log(req.cookies['access_token'])
    }catch(err){
        console.log("authMiddleware error ");
        next(err);
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        });
        
    }
}


module.exports = authMiddleware;