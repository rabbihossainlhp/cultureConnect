const { createRoomController, getRoomListController } = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth.middleware');

const router = require('express').Router();

router.post("/create-room",authMiddleware, createRoomController);
router.get("/room-list",authMiddleware,getRoomListController);


module.exports = router