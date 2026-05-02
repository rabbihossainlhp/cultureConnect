const { createPostController, getPostController } = require("../controllers//post/postController");
const { addCommentController, getCommentController, deleteCommentController } = require("../controllers/post/commentController");
const { likeUnlikePostController } = require("../controllers/post/likeController");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadPost } = require("../middleware/imageUpload.middleware");

const router = require("express").Router();

router.post("/create",authMiddleware,uploadPost, createPostController);
router.get("/list",getPostController);

router.post("/like-unlike",authMiddleware,likeUnlikePostController),


router.post("/:postId/comment",authMiddleware,addCommentController);
router.get("/:postId/comments",getCommentController);
router.delete("/comment/:commentId",authMiddleware,deleteCommentController);



module.exports = router;