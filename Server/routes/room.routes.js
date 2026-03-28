const { createRoomController } = require('../controllers/roomController');
const authMiddleware = require('../middleware/auth.middleware');

const router = require('express').Router();

router.post("/create-room",authMiddleware, createRoomController);

module.exports = router