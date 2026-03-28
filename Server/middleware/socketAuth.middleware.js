const db = require('../config/db');
const jwt = require("jsonwebtoken");



const socketAuthMiddleware = async (socket,next) =>{
    try{
        const cookie = socket.handshake.headers.cookie;
        console.log("PRINTING WHOLE SOCKET",socket);

        if(!cookie){
            return next(new Error('No authentication token provided'));
        };

        const matchToken = cookie.match(/access_token=([^;]+)/);
        if(!matchToken || !matchToken[1]){
            return next(new Error('Token not found in cookie'));
        };

        const token = matchToken[1];

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const userResult = await db.query('SELECT id,email,username,country FROM users WHERE email = $1',[decoded.email]);
        
        if(userResult.rows.length === 0){
            return next(new Error('User not found'));
        }

        socket.data.user = userResult.rows[0];


        next();

    }catch(err){
        console.error('Socket authentication error: ',err.message);
        next(new Error(`Authentication failed: ${err.message}` ));
    }
}


module.exports = socketAuthMiddleware;