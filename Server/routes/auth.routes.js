//dependencies.....
const router = require('express').Router();
const { loginController, registerController, logoutController } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth.middleware');



router.post('/register',registerController);
router.post('/login', loginController);
router.post('/logout',authMiddleware,logoutController);



module.exports = router;