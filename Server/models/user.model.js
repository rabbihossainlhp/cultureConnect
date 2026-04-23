//dependencies.....
const db = require('../config/db');

const User = {
    tableName : 'users',
    async createUserTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                username VARCHAR(120) NOT NULL,
                country VARCHAR(100) NOT NULL,
                native_language VARCHAR(50) NOT NULL,
                profile_picture VARCHAR(500),
                bio TEXT,
                is_verified BOOLEAN DEFAULT false,
                joined_rooms INTEGER[] DEFAULT '{}'::integer[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
        `;


        try{
            await db.query(query);
        }catch(err){
            console.error('Error creating user table:', err)
            throw err;
        }
    },


    async alterTableAddJoinedRoom(){
        const query = `ALTER TABLE users 
                        ADD COLUMN IF NOT EXISTS joined_rooms INTEGER[] DEFAULT '{}'::integer[]`;
        
        try{
            await db.query(query);
            console.log('joined_rooms col added');
        }catch(err){
            console.error('joined_rooms column already exists: ',err.message);
        }
    },


    async initializeJoinedRoomsForExistingUsers(){
        const query = `UPDATE users 
                        SET joined_rooms = '{}'::integer[]
                        WHERE joined_rooms IS NULL
                        RETURNING id,joined_rooms
                        `;
        
        try{
            await db.query(query);
            console.log('initialized joined rooms for existing user');
        }catch(err){
            console.error('initialize join room for existing user erro....: ',err.message);
        }
    }

    



}



module.exports = User;