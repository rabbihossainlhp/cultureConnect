const db = require('../config/db');
const bcrypt = require('bcrypt');




const getProfileController = async (req,res) =>{
    if(!req.user){
        res.status(401).json({
            success:false,
            message:"Inavlid user",
        })
    }

    const user = req.user;
    
    return res.status(200).json({
        success:true,
        data:{username:user.username, email:user.email, country:user.country,bio:user.bio,native_language:user.native_language,profile_picture:user.profile_picture},
        message:"User request Successfully completed.",
    })

}




//update user profile
const updateProfileController = async (req,res) =>{
    const user = req.user;
    const {password,newPassword,nativeLanguage,bio} = req.body;
    const profilePicture = req.file? req.file.path : 'https://i.pinimg.com/736x/43/6c/ac/436cac73f5fff533999f31147c3538b7.jpg';
    
    try{
        if(newPassword){
            const userQuery = `
                SELECT id,email,username,password,country FROM users WHERE id=$1
            `;

            const result = await db.query(userQuery,[user.id]);
            if(result.rows.length === 0){
                return res.status(404).json({
                    success:false,
                    message:"Not found user"
                })
            }

            const isMatchPassword = await bcrypt.compare(password,result.rows[0].password);
            if(!isMatchPassword){
                return res.status(400).json({
                    success:false,
                    message:"Password didn't matched with old"
                })
            }

            const hashPass = await bcrypt.hash(newPassword,10); 
            const passwordUpdateQuery = `
                UPDATE users
                    SET password = $1
                WHERE id = $2 AND email = $3
            `;

            await db.query(passwordUpdateQuery,[hashPass,user.id,user.email]);
            return res.status(200).json({
                    success:true,
                    message:"Password Changed succesfully"
            })
        }


        if(nativeLanguage || profilePicture || bio){
            const updateUserQuery = `
                UPDATE users 
                    SET native_language = $1,
                        profile_picture = $2,
                        bio = $3
                WHERE id = $4 AND email = $5
                RETURNING *
            `;

            const updatedUser = await db.query(updateUserQuery,[nativeLanguage?nativeLanguage.trim():user.native_language, profilePicture?profilePicture:user.profile_picture,bio?bio:"",user.id,user.email]);
            if(updatedUser.rows.length === 0){
                return res.status(400).json({
                    success:false,
                    message:"Profile info change failed!!"
                })
            }


            return res.status(200).json({
                    success:true,
                    message:"Profile update successfully",
                    data:updatedUser.rows[0]
            })

        }else{
            return res.status(400).json({
                    success:false,
                    message:"Invalid field that user want to change"
            })
        }

    }catch(err){
        console.log("Server Error occouring update profile info",err.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
            error: err.message
        });
    }
}






module.exports = {
    getProfileController,
    updateProfileController
};