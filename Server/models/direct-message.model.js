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
    },


    async addMediaAndTypeColumn(){
        const query = `
            ALTER TABLE direct_messages
                ADD COLUMN IF NOT EXISTS message_type VARCHAR(25) NOT NULL DEFAULT 'text',
                ADD COLUMN IF NOT EXISTS media_url TEXT
        `;

        try{
            await db.query(query);
            console.log("media_url and type column added in direct_message table")
        }catch(err){
            console.error("ADD media column error ondirect_message: ",err.message)
        }
    }
}


module.exports = DirectMessage;