//dependencies.....
const db = require('../config/db');

const Rooms = {
    tableName : 'rooms',
    async createRoomsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS rooms (
                id BIGSERIAL PRIMARY KEY,
                slug VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(150) NOT NULL,
                description TEXT,
                language VARCHAR(50),
                visibility VARCHAR(20) NOT NULL DEFAULT 'public',
                status VARCHAR(20) NOT NULL DEFAULT 'active',
                host_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                max_capacity INTEGER NOT NULL DEFAULT 100,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
            CREATE INDEX IF NOT EXISTS idx_rooms_visibility ON rooms(visibility);
            CREATE INDEX IF NOT EXISTS idx_rooms_host_user_id ON rooms(host_user_id);
        `;


        try{
            await db.query(query);
        }catch(err){
            console.error('Error creating rooms table:', err)
            throw err;
        }
    }

}



module.exports = Rooms;