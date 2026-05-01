const { mediaUploadController } = require("../controllers/media/mediaController");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadMessages } = require("../middleware/imageUpload.middleware");

const router = require("express").Router();


router.post("/message-image",authMiddleware,uploadMessages,mediaUploadController);

module.exports = router;