const getProfileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth.middleware');

const router = require('express').Router();

router.get("/", authMiddleware, getProfileController);


module.exports = router;