const { createPostController, getPostController } = require("../controllers/postController");
const authMiddleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/create",authMiddleware,createPostController);
router.get("/list",getPostController);


module.exports = router;