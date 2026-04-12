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


        const checkPendingOtpQuery = `SELECT id FROM email_verification_codes WHERE email=$1`;
        const pendingResult = await db.query(checkPendingOtpQuery,[email]);
        if(pendingResult.rows.length>0){
            await db.query(`DELETE FROM email_verification_codes WHERE email=$1`,[email]);
        }



        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Generated OTP for ${email}: ${otp}`);

        //hashed password....
        const hashPass = await bcrypt.hash(password,10);

        //set otp expire time
        const expiresAt = new Date(Date.now() + 10*60*1000);

        const userDataForVerificationTable = {
            password:hashPass,
            username,
            country,
            nativeLanguage
        }


        const insertOtpUserQuery = `
            INSERT INTO email_verification_codes (email,otp_code,user_data,expires_at)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `

        await db.query(insertOtpUserQuery,[
            email,
            otp,
            JSON.stringify(userDataForVerificationTable),
            expiresAt
        ])


        const emailSent = await sendOtpMail(email,otp);
        if(!emailSent){
            await db.query(`DELETE FROM email_verification_codes WHERE email=$1`,[email]);
            return res.status(500).json({
                success:false,
                message:'Failed to send email, Try again'
            })
        }

        return res.status(200).json({
            success:true,
            message:'OTP sent to email. Please verify to complete registration.',
            email:email,
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





const verifyOtpController = async (req,res)=>{
    try{
        const {email,otp} = req.body;
        
        if(!email || !otp){
            return res.status(400).json({
                success:false,
                message:'Email and otp required'
            });
        }

        const findVerificationQuery = `SELECT * FROM email_verification_codes WHERE email = $1`;
        const verificationResult = await db.query(findVerificationQuery,[email]);

        if(verificationResult.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"No pending verifications. please  signup again"
            });
        }

        const verification = verificationResult.rows[0];

        const now = new Date();
        const expireTime = new Date(verification.expires_at);

        if(now>expireTime){
            await db.query(`DELETE FROM email_verification_codes WHEERE id=$1`,[verification.id]);

            return res.status(410).json({
                success:false,
                message:'OTP expired. Signup again'
            });
        }

        //check otp matching....
        if(verification.otp_code !== otp){
            const newAttempts = verification.attempts +1;
            if(newAttempts>=5){
                await db.query(`DELETE FROM email_verification_codes WHERE id=$1`,[verification.id]);

                return res.status(429).json({
                    success:false,
                    message:'Too many wrong attempts. Signup again'
                });
            }

            //update attempt count even thats wrong
            await db.query(`UPDATE email_verification_codes SET attempts=$1 WHEERE id=$2`,[newAttempts,verification.id]);

            return res.status(401).json({
                success:false,
                message:'Wrong OTP. Total 5 times user can take attempts'
            });

        }


        const userData = verification.user_data;

        const createUserQuery = `
            INSERT INTO users(email,password,username,country,native_language)
            VALUES($1,$2,$3,$4,$5)
            RETURNING id,email,username,country,native_language
        `;

        const result = await db.query(inserUserQuery,[
            email,
            userData.password,
            userData.username,
            userData.country,
            userData.nativeLanguage
        ]);

        const createdUser = result.rows[0];

        await db.query(`DELETE FROM email_verification_codes WHERE id=$1`,[verification.id]);

        const token = jwt.sign(
            {
            username:createdUser.username,
            email:createdUser.email
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


        return res.status(201).json({
            success:true,
            message:"Email verified! Account created successfully.",
            data:{
                id:createUserQuery.id,
                username:createUserQuery.username,
                email:createdUser.email,
                country:createdUser.country,
                nativeLanguage:createUserQuery.native_language
            }
        })


    }catch(err){
        console.error('Error during verifyOtp in controller: ',err.message);
        return res.status(500).json({
            success:false,
            message:'Server error during OTP verify'
        });
    }
}






module.exports = {
    loginController,
    registerController,
    logoutController,
    verifyOtpController

}