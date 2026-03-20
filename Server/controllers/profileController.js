const db = require('../config/db');


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
        data:{username:user.username, email:user.email, country:user.country},
        message:"User request Successfully completed.",
    })

}


module.exports = getProfileController;