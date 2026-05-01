const { createPostController, getPostController } = require("../controllers//post/postController");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadPost } = require("../middleware/imageUpload.middleware");

const router = require("express").Router();

router.post("/create",authMiddleware,uploadPost, createPostController);
router.get("/list",getPostController);


module.exports = router;