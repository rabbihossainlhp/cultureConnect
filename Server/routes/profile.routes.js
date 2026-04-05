const {getProfileController,updateProfileController} = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth.middleware');
const { uploadProfile } = require('../middleware/imageUpload.middleware');



const router = require('express').Router();

router.get("/", authMiddleware, getProfileController);
router.put("/", authMiddleware, uploadProfile, updateProfileController);


module.exports = router;