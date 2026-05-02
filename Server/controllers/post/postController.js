//dependencies....
const db = require('../../config/db');


const createPostController = async (req,res) =>{
    const {title,description,tags,slug,readtime} = req.body;
    const authorId = req.user?.id;
    const postImage = req.file?.path || 'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg';

    if(!title || !description || !tags || !slug){
        return res.status(400).json({
            success:false,
            message:"All required assets must provide to create a post"
        });
    }

    try{
        // Parse tags if it's a string (from FormData)
        let tagsArray = tags;
        if (typeof tags === 'string') {
            try {
                tagsArray = JSON.parse(tags);
            } catch {
                tagsArray = tags.split(',').map(t => t.trim());
            }
        }

        const postQuery = `
            INSERT INTO cultural_post(title,author_id,description,tags,slug,post_image,readtime)
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING id,author_id,title,description,tags,slug,post_image
        `;

        const createdPost = await db.query(postQuery,[title,authorId,description,tagsArray,slug,postImage,readtime]);

        if(createdPost.rows.length === 0){
            return res.status(400).json({
                success:false,
                message:"Post creation Faild"
            })
        }

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




const getPostController = async (req,res)=>{
    try{
        const getPostQuery = `
            SELECT
                id,
                author_id,
                title,
                description,
                tags,
                slug,
                post_image,
                status,
                readtime,
                likes_count AS likes,
                comments_count,
                created_at
            FROM cultural_post
            WHERE status='published'
            ORDER BY created_at DESC
        `;

        const allPost = await db.query(getPostQuery);

        if(allPost.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Posts Not found"
            })
        }

        return res.status(200).json({
                success:true,
                message:"Posts fetched successfully!",
                data: allPost.rows
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Server Error During Get Post",
            error:err.message
        })
    }
}




module.exports = {
    createPostController,
    getPostController,
}