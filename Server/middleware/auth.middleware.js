//dependencies...
const db = require('../config/db');
const jwt = require("jsonwebtoken");


const authMiddleware = async (req,res,next) =>{
    try{
        const token = req.cookies['access_token'];
        const decoded =  jwt.verify(token,process.env.JWT_SECRET);
        const query = `SELECT id,username,email,country,native_language,profile_picture,bio FROM users WHERE email=$1`;

        const user = await db.query(query,[decoded.email]);
        if(user.rows.length === 0){
            return res.status(401).json({
                success:false,
                message:"UnAuthorized!"
            })
        }
        req.user = user.rows[0];
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:"Invalid or expire token",
        });
        
    }
}


module.exports = authMiddleware;