const {dbConnection} = require('../config/db');


const CulturalPost = {
    tableName:"cultural_post",
    async createCulturalPostTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS cultural_post(
                id SERIAL PRIMARY KEY,
                author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(300) NOT NULL,
                description TEXT,
                tags TEXT[],
                slug VARCHAR(250),
                post_image TEXT,
                status VARCHAR(20) NOT NULL DEFAULT 'published',
                readtime VARCHAR(20),
                likes INTEGER[]  DEFAULT '{}',
                likes_count INTEGER NOT NULL DEFAULT 0,
                comments_count INTEGER NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            )
        `;

        try{
            await dbConnection.query(query);
            console.log("Created cultural post table in DB");
        }catch(err){
            console.error('Error creating cultural post table in DB:  ', err.message)
        }
    }
    
};


module.exports = CulturalPost;