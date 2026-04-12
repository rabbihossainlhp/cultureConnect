//dependencies.....
const router = require('express').Router();
const { loginController, registerController, logoutController, verifyOtpController } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');



router.post('/register',registerController);
router.post('/otp-verify', verifyOtpController)
router.post('/login', loginController);
router.post('/logout',authMiddleware,logoutController);



module.exports = router;