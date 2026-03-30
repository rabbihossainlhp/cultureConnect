//dependencies....
const db = require('../config/db');


const createPostController = async (req,res) =>{
    const {title,description,tags,slug} = req.body;
    const postImage = req.file? req.file.path : 'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg';

    if(!title || !descripton || !tags || !slug){
        return res.status(400).json({
            success:false,
            message:"All required assets must provide to create a post"
        });
    }


    try{
        const postQuery = `
            INSERT INTO cultural_post(title,description,tags,slug,post_image)
            VALUES($1,$2,$3,$4,$5)
            RETURNING id,author_id,title,description,tags,slug,post_image
        `;

        const createdPost = await db.query(postQuery,[title,description,tags,slug,postImage]);

        if(createdPost.rows.length === 0){
            return res.status(400).json({
                success:false,
                message:"Post creation Faild"
            })
        } ''

        return res.status(201).json({
            success:true,
            message:"Post Created Successfully!!"
        })

    }catch(err){
        console.log("Server error during create a post: ",err.message);
        return res.status(500).json({
            success:false,
            message:"Server Error During Create a Post",
            error:err.message
        })
    }
}



module.exports = {
    createPostController,
}