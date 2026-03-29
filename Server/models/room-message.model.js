const db = require('../config/db');


const RoomMessage = {
    tableName:'room_messages',
    async createRoomMessageTable(){
        const query = `
            CREATE TABLE IF NOT EXISTS room_messages (
                id BIGSERIAL PRIMARY KEY,
                room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                sender_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                message_text TEXT NOT NULL,
                message_type VARCHAR(25) NOT NULL DEFAULT 'text',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                edited_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            );

            CREATE INDEX IF NOT EXISTS idx_room_messages_id_created_at ON room_messages(room_id,created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_room_messages_sender_user_id ON room_messages(sender_user_id);
            
        `;

        try{
            await db.query(query)
        }catch(err){
            console.error('Error catching create RoomMessage table',err);
            throw err;
        }
    }



}


module.exports = RoomMessage;