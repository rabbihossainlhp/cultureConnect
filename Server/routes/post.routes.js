const { createPostController } = require("../controllers/postController");
const authMiddleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/create",authMiddleware,createPostController);


module.exports = router;