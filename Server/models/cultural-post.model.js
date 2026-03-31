const db = require('../config/db');


const CulturalPost = {
    tableName:"Cultural-Post",
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
                readtime VARCHAR(20),
                likes INTEGER NULL DEFAULT 0,
                comments VARCHAR(80) NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            )
        `;

        await db.query(query);
    }
    
};


module.exports = CulturalPost;