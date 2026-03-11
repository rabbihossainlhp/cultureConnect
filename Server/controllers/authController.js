


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

}




module.exports = {
    loginController,

}