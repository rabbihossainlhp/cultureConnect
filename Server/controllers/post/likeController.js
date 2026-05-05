//dependencies....
const {dbConnection} = require('../../config/db');


const likeUnlikePostController = async(req,res)=>{
    try{    
        const userId = Number(req.user?.id);
        const postId = Number(req.body?.postId);

        if(!postId || !userId){
            return res.status(400).json({
                success:false,
                message:"Post ID and User ID requried"
            });
        }

        const checkQuery = `
            SELECT likes FROM cultural_post WHERE id=$1
        `;

        const checkPost = await dbConnection.query(checkQuery,[postId]);

        if(checkPost.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Post not found",
            });
        }

        const likedBy = Array.isArray(checkPost.rows[0].likes)
            ? checkPost.rows[0].likes.map((id) => Number(id))
            : [];

        const updated = likedBy.filter((id) => id !== userId);

        //update like/unlike-info into post table query....
        const updateQueryForLikeUnlike = `
            UPDATE cultural_post 
            SET likes = $1::INTEGER[], likes_count = COALESCE(array_length($1::INTEGER[],1),0)
            WHERE id = $2
            RETURNING id,likes,likes_count
        `;


        


        if(likedBy.includes(userId)){

            const result = await dbConnection.query(updateQueryForLikeUnlike,[updated,postId]);
            return res.status(200).json({
                success:true,
                message:"Post Unliked successfully",
                data:result.rows[0]
            })
        }



        likedBy.push(userId);


        const result = await dbConnection.query(updateQueryForLikeUnlike,[likedBy,postId]);

        return res.status(200).json({
            success:true,
            message:"Post liked successfully",
            data:result.rows[0]
        })
    }catch(err){
        console.error('Error liking post: ',err.message);
        return res.status(500).json({
            success:false,
            message:"Server Error",
            error:err.message 
        });
    }
}



module.exports = {
    likeUnlikePostController
}