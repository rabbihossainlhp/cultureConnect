const User = require('./models/user.model');
const PostComment = require('./models/post-comment.model');
const Rooms = require('./models/room.model');
const RoomMessage = require('./models/room-message.model');
const RoomParticipants = require('./models/room-participants.model');
const CulturalPost = require('./models/cultural-post.model');
const DirectMessage = require('./models/direct-message.model');
const EmailVerificationCode = require('./models/email-verification-code.model');




const initDB = async()=>{
    try{
        await User.createUserTable();
        await User.alterTableAddJoinedRoom();
        await User.initializeJoinedRoomsForExistingUsers();
        await User.removeJoinedRoomsDuplicates();
        await User.alterTableHybridPassword();
        await PostComment.createPostCommentsTable();
        await Rooms.createRoomsTable();
        await Rooms.alterTableAddPasswordCol();
        await RoomMessage.createRoomMessageTable();
        await RoomMessage.addMediaColumn();
        await RoomParticipants.createRoomParticipantsTable();
        await CulturalPost.createCulturalPostTable();
        await DirectMessage.createDirectMessaeTable();
        await DirectMessage.addMediaAndTypeColumn();
        await EmailVerificationCode.createEmailVerifyTable();
        
        console.log('Table created')
    }catch(err){
        console.error("DB init error: ", err);
    }
}


module.exports = initDB;