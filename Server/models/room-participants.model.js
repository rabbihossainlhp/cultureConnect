const db = require('../config/db');


const RoomParticipants = {
    tableName:'room_participants',
    async createRoomParticipantsTable (){

        const query = ` 
            CREATE TABLE IF NOT EXISTS room_participants (
                id BIGSERIAL PRIMARY KEY,
                room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                role VARCHAR(20) NOT NULL DEFAULT 'member',
                is_online BOOLEAN NOT NULL  DEFAULT true,
                joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                left_at TIMESTAMP NULL,
                UNIQUE (room_id, user_id)
            );

            CREATE INDEX IF NOT EXISTS idx_room_participants_room_id ON room_participants(room_id);
            CREATE INDEX IF NOT EXISTS idx_room_participants_user_id ON room_participants(user_id);
            CREATE INDEX IF NOT EXISTS idx_room_participants_online ON room_participants(is_online);
        `;


        try{
            await db.query(query);
        }catch(err){
            console.error('Error catching during create room participants table');
            throw err;
        }
    }
};


module.exports = RoomParticipants;