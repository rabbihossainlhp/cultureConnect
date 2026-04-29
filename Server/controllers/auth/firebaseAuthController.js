//dependencies...
const jwt = require('jsonwebtoken');
const firebaseAuthController = async(req,res) =>{
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

        const isProd = process.env.NODE_ENV==='production';
        const cookieOptions = {
            httpOnly:true,
            secure:isProd,
            sameSite:isProd?"none":"lax",
            maxAge:24*60*60*1000
        }

        const checkUser = `SELECT id FROM users WHERE email = $1`;
        const existUser = await db.query(checkUser,[email]);
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
                data: { username: existUser.rows[0].username, email: existUser.rows[0].email, country: existUser.rows[0].country }
            })
        };



        //if not exist the user...
        const createUserQuery = `
            INSERT INTO users(email,username,country,native_language)
            VALUES($1,$3,$4,$5)
            RETURNING id,email,username,country,native_language
        `;

        const result = await db.query(createUserQuery,[
            email,
            username,
            country || "Spain",
            nativeLanguage || "Spanish"
        ]);

        const createdUser = result.rows[0];

        const token = jwt.sign(
                {
                username:createdUser.rows[0].username,
                email:createdUser.rows[0].email
                },
                process.env.JWT_SECRET,
                {expiresIn:'1d'}
            );

        res.cookie("access_token",token,cookieOptions);

        return res.status(200).json({
            success:true,
            message:'User successfully registerd user with google!.',
            data: { username: createdUser.rows[0].username, email: createdUser.rows[0].email, country: createdUser.rows[0].country }
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