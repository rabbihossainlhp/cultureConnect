const {dbConnection} = require('../../config/db');

const addCommentController = async(req,res)=>{
    try{
        const {postId,content} = req.body;
        const authorId = req.user?.id;

        if(!postId || !content.trim()){
            return res.status(400).json({
                success:false,
                message:"Post id and comment content must required! "
            });
        }

        const checkPost = await dbConnection.query(`SELECT id FROM cultural_post WHERE id=$1`,[postId]);
        
        if(checkPost.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        const insertCommentQuery = `
            INSERT INTO post_comments(post_id,author_id,content)
            VALUES($1,$2,$3)
            RETURNING id,post_id,author_id,content,created_at
        `;

        const comment = await dbConnection.query(insertCommentQuery,[postId,authorId,content.trim()]);

        //update comment count on post's table....
        await dbConnection.query(`UPDATE cultural_post SET comments_count = comments_count + 1 WHERE id = $1`,[postId])

        return res.status(200).json({
            success:true,
            message:"Comment added successfully",
            data:comment.rows[0]
        });


    }catch(err){
        console.error('Error adding post-s comment: ',err.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        })
    }
}






const getCommentController = async(req,res)=>{
    try{
        const {postId} = req.params;

        if(!postId ){
            return res.status(400).json({
                success:false,
                message:"Post id  must required! "
            });
        }

        const checkPost = await dbConnection.query(`SELECT id FROM cultural_post WHERE id=$1`,[postId]);
        
        if(checkPost.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });
        }

        const getCommentQuery = `
            SELECT 
                pc.id,
                pc.post_id,
                pc.author_id,
                pc.content,
                pc.created_at,
                u.username,
                u.profile_picture
            FROM post_comments pc
            JOIN users u ON pc.author_id = u.id
            WHERE pc.post_id = $1 
            AND pc.status = 'published'
            AND pc.deleted_at IS NULL
            ORDER BY pc.created_at DESC
        `;

        const comments = await dbConnection.query(getCommentQuery,[postId]);

        return res.status(200).json({
            success:true,
            message:"Comment fetched successfully",
            data:comments.rows
        });

        
    }catch(err){
        console.error('Error getting post-s comment: ',err.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        })
    }
}






const deleteCommentController = async(req,res)=>{
    try{
        const {commentId} = req.params;
        const userId = req.user?.id;

        if(!commentId || !userId){
            return res.status(400).json({
                success:false,
                message:"Comment id and user id must required! "
            });
        }

        const checkComment = await db.query(`SELECT author_id,post_id FROM post_comments WHERE id=$1`,[commentId]);
        
        if(checkComment.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:"Comment not found"
            });
        }


        if(checkComment.rows[0].author_id !== userId){
            return res.status(403).json({
                success:false,
                message:"Unauthorized to delete this comment"
            });
        }


        //soft delete....
        await db.query(`UPDATE post_comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,[commentId]);

        //again update comment count 
        await db.query(`UPDATE cultural_post SET comments_count = comments_count - 1 WHERE id = $1`,[checkComment.rows[0].post_id])


        return res.status(200).json({
            success:true,
            message:"Comment deleted successfully",
        });

        
    }catch(err){
        console.error('Error deleting post-s comment: ',err.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:err.message
        })
    }
}





module.exports = {
    addCommentController,
    getCommentController,
    deleteCommentController
}