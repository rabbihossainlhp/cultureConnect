//dependencies....
const db = require('../config/db');
const bcrypt = require('bcrypt');




const loginController = async(req,res) =>{
    try{
        const {email,password} = req.body;

    }catch(err){
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
        console.log(req.body)

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
        return res.status(500).json({
            success:false,
            message:`Server error happend!! during regiseter `,
            error:err

        });
    }
}




module.exports = {
    loginController,
    registerController,


}