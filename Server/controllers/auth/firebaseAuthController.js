//dependencies...
const jwt = require('jsonwebtoken');
const {dbConnection} = require('../../config/db');



const firebaseAuthController = async(req,res) =>{

    const authProvider = "google";


    try{

        if(!req.body || typeof req.body !=='object'){
            return res.status(400).json({
                success:false,
                message:'Invalid json body'
            });
        }

        const {username,email,country,nativeLanguage,profilePicture,firebaseUid} = req.body;

        
        if(!username || !email){
            return res.status(400).json({
                success:false,
                message:"All the necessary fields are required"
            })
        }

        console.log("reach userinfo: ",username,email,country,nativeLanguage,profilePicture)

        const isProd = process.env.NODE_ENV==='production';
        const cookieOptions = {
            httpOnly:true,
            secure:isProd,
            sameSite:isProd?"none":"lax",
            maxAge:24*60*60*1000,
            path:"/"
        }

        const checkUser = `SELECT id,username,email,profile_picture FROM users WHERE email = $1`;
        const existUser = await dbConnection.query(checkUser,[email]);
        if(existUser.rows.length>0){
            const token = jwt.sign(
                    {
                    username:existUser.rows[0].username,
                    email:existUser.rows[0].email
                    },
                    process.env.JWT_SECRET,
                    {expiresIn:'1d'}
            );

            res.cookie("access_token",token,cookieOptions);

            return res.status(200).json({
                success:true,
                message:'User successfully logedIn user with google!.',
                data: {id:existUser.rows[0].id, username: existUser.rows[0].username, email: existUser.rows[0].email, profilePicture: existUser.rows[0].profile_picture }
            })
        };



        //if not exist the user...
        const createUserQuery = `
            INSERT INTO users(email,username,country,native_language,profile_picture,auth_provider,firebase_uid)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING id,email,username,country,native_language
        `;

        const result = await dbConnection.query(createUserQuery,[
            email,
            username,
            country || "Spain",
            nativeLanguage || "Spanish",
            profilePicture? profilePicture : "",
            authProvider,
            firebaseUid

        ]);

        const createdUser = result.rows[0];

        const token = jwt.sign(
                {
                username:createdUser.username,
                email:createdUser.email
                },
                process.env.JWT_SECRET,
                {expiresIn:'1d'}
            );

        res.cookie("access_token",token,cookieOptions);

        return res.status(200).json({
            success:true,
            message:'User successfully registerd user with google!.',
            data: {id:createdUser.id, username: createdUser.username, email: createdUser.email, profilePicture: createdUser.profile_picture }
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:`Server error happend!! during continue with google `,
            error:err

        });
    }
}



module.exports = {firebaseAuthController};