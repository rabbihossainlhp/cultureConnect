//dependencies.....
const router = require('express').Router();
const { loginController, registerController, logoutController, verifyOtpController } = require('../controllers/auth/authController');
const { firebaseAuthController } = require('../controllers/auth/firebaseAuthController');
const authMiddleware = require('../middleware/auth.middleware');



router.post('/continue-with-google',firebaseAuthController);

router.post('/register',registerController);
router.post('/otp-verify', verifyOtpController)
router.post('/login', loginController);
router.post('/logout',authMiddleware,logoutController);




module.exports = router;