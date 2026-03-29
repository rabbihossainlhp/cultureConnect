//dependencies...
const db = require('../config/db');

const createRoomController = async (req,res) =>{
    const {slug,roomName,language,visibility, description,capacity} = req.body;

    if(!slug || !roomName || !language || !visibility ||  !capacity){
        return res.status(400).json({
            success:false,
            message: 'All field are required..'
        })
    };

    const normalizeDescription = typeof description === 'string' ? description.trim():null;


    try{
        const slugQuery = `
            SELECT name, slug, language, visibility, max_capacity
            FROM rooms 
            WHERE slug = $1
        `;



        const matchedSlug = await db.query(slugQuery,[slug]);

        if(matchedSlug.rows.length > 0){
            return res.status(400).json({
                success:false,
                message:'Room name or handler already exists'
            })
        };

        
        const createRoomQuery = `
            INSERT INTO rooms (slug,name,language,description,visibility,host_user_id,max_capacity)
            VALUES($1,$2, $3, $4, $5, $6,$7)
            RETURNING id,name,slug,language,visibility,max_capacity as capacity
        `;

        const createdRoom = await db.query(createRoomQuery,[slug,roomName,language,normalizeDescription,visibility,req.user.id,capacity]);
        return res.status(201).json({
            success:true,
            message:'Room created successfully!',
            room: createdRoom.rows[0]
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Server error during create a room!',
            error:err.message
        })
    }
}


const getRoomListController = async(req,res) =>{
    try{
        const roomListQuery = `
            SELECT id,name,description,language,status,visibility
            FROM rooms
        `;
        
        const roomList = await db.query(roomListQuery);
        if(roomList.rows.length === 0){
            return res.status(404).json({
                success:false,
                message:'Not found any room'
            });
        }


        return res.status(200).json({
            success:true,
            message:'Room list fetched successfully !!',
            data:roomList.rows
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Server error during fetch the room list',
            error: err.message
        });
    }
}

module.exports = {
    createRoomController,
    getRoomListController,
}