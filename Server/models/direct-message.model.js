const db = require('../config/db');


const DirectMessage = {
    tableName:'direct_message',
    async createDirectMessaeTable(){
        const messageQuery = `
            CREATE TABLE IF NOT EXISTS direct_messages (
                id BIGSERIAL PRIMARY KEY,
                sender_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                receiver_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                message_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at  TIMESTAMP,
                CHECK(sender_user_id <> receiver_user_id)
            );

            CREATE INDEX IF NOT EXISTS idx_dm_pair_created_at ON direct_messages(sender_user_id,receiver_user_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_dm_receiver_created_at ON direct_messages(receiver_user_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_dm_sender_created_at ON direct_messages(sender_user_id, created_at DESC);

        `


        try{
            await db.query(messageQuery);
            
        }catch(err){
            console.error('Error catching during create DM table');
            throw err;
        }
    }
}


module.exports = DirectMessage;