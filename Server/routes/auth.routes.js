//dependencies.....
const router = require('express').Router();
const { loginController, registerController } = require('../controllers/authController');



router.post('/register',registerController);
router.post('/login', loginController);


module.exports = router;