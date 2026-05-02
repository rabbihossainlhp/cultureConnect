const {dbConnection} = require('../config/db');



const PostComment = {
    tableName:'post_comments',
    async createPostCommentsTable(){
        const query = `
            CREATE TABLE IF NOT EXISTS post_comments(
                id SERIAL PRIMARY KEY,
                post_id INTEGER NOT NULL REFERENCES cultural_post(id) ON DELETE CASCADE,
                author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'published',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );


            CREATE INDEX IF NOT EXISTS idx_post_id ON post_comments(post_id);
            CREATE INDEX IF NOT EXISTS idx_author_id ON post_comments(author_id);
            
        `;

        try{
            await dbConnection.query(query);
            console.log("Created comments table in DB");
        }catch(err){
            console.error('Error creating comments table in DB:  ', err.message)
        }
    },
}



module.exports = PostComment;