//dependencies....
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendOtpMail} = require('../config/email');





const loginController = async(req,res) =>{
    
    try{
        const {email,password} = req.body; 
        
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Must provide necessary credentials!'
            })
        }
        
        
        const loginQuery = `
            SELECT username,email,password,country FROM users WHERE email=$1;
        `;

        const result = await db.query(loginQuery,[email]);

        if(result.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:'User not found',
            })
        }

        const matchPassword = await bcrypt.compare(password,result.rows[0].password);

        if(!matchPassword){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials!"
            })
        }

        const token = jwt.sign(
            {
            username:result.rows[0].username,
            email:result.rows[0].email
            },
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );


        const isProd = process.env.NODE_ENV==='production';
        const cookieOptions = {
            httpOnly:true,
            secure:isProd,
            sameSite:isProd?"none":"lax",
            maxAge:24*60*60 *1000,
        }
        
        res.cookie("access_token",token,cookieOptions);

        return res.status(200).json({
            success:true,
            message:"user login successfully",
            data: { username: result.rows[0].username, email: result.rows[0].email, country: result.rows[0].country }
        })


    }catch(err){
        console.log(err.message)
        return res.status(500).json({
            success:false,
            message:'Server error happend!! during login'
        })
    }
}






const registerController = async(req,res) =>{
    try{

        if(!req.body || typeof req.body !=='object'){
            return res.status(400).json({
                success:false,
                message:'Invalid json body'
            });
        }

        const {username,email,password,country,nativeLanguage} = req.body;

        
        if(!username || !email || !password || !country || !nativeLanguage){
            return res.status(400).json({
                success:false,
                message:"All the necessary fields are required"
            })
        }

        const checkUser = `SELECT id FROM users WHERE email = $1`;
        const existUser = await db.query(checkUser,[email]);
        if(existUser.rows.length>0){
            return res.status(409).json({
                success:false,
                message:"Email already exists"
            });
        };

        
        const hashPass = await bcrypt.hash(password,10);
        const inserUserQuery = `
            INSERT INTO users (username, email, password, country, native_language)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id,email,username,country,native_language, created_at;
        `

        const result = await db.query(inserUserQuery,[
            username,
            email,
            hashPass,
            country,
            nativeLanguage
        ])


        return res.status(201).json({
            success:true,
            message:'User registered successfully!!',
            data:result.rows[0],
        })



    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:`Server error happend!! during regiseter `,
            error:err

        });
    }
}





const logoutController = async(req,res)=>{
    try{
        res.clearCookie("access_token");
        return res.status(200).json({
            success:true,
            message:"Logout successfull!",
        })
    }catch(err){
        console.log("server err during logout");
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        })
    }
}





const sendOtpController = async(req,res) =>{
    try{
        const {email,password,username,country,nativeLanguage} = req.body;

        if(!email || !password || !username || !country || !nativeLanguage){
            return res.status(400).json({
                success:false,
                message:"All fields are requrid"
            });
        }


        const checkUserQuery = `SELECT id FROM users WHERE email=$1`;
        const existUser = await db.query(checkUserQuery,[email]);
        if(existUser.rows.length>0){
            return res.status(409).json({
                success:false,
                message:"Email already registerd. Please login"
            })
        }



        const checkPendingQuery = `SELECT id FROM email_verification_codes WHERE email=$1`;
        const pendingResult = await db.query(checkPendingQuery,[email]);
        if(pendingResult.rows.length>0){
            await db.query(`DELETE FROM email_verification_codes WHERE email=$1`,[email]);
        }



        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);
        
    }catch(err){
        console.error('Error during sendOtp in controller: ',err.message);
        return res.status(500).json({
            success:false,
            message:'Server error during OTP sending'
        });
    }
};



module.exports = {
    loginController,
    registerController,
    logoutController


}