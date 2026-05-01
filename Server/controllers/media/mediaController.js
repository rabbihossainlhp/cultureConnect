

const mediaUploadController = async(req,res) =>{
    try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"No image file uploaded"
            });
        }

        const mediaUrl = req.file.path;
        return res.status(200).json({
            success:true,
            message:"Image upload successfully",
            mediaUrl,
            url:mediaUrl,
            data:{
                mediaUrl,
                url:mediaUrl
            }
        })

    }catch(err){
        console.error("MediaUploadController error: ",err.message);
        return res.status(500).json({
            success:false,
            message:"Failed to upload image",
            error:err.message
        })
    }
}



module.exports={
    mediaUploadController
}