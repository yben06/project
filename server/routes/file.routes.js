const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const uploadController = require("../controllers/upload.controller");
const postController = require("../controllers/post.controller");

// file storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const newFileName = `${file.fieldname}-${Date.now()}${ext}`;
		cb(null, newFileName);
	},
});
const upload = multer({ storage });

// routes with files
router.patch("/upload", upload.single("file"), uploadController.uploadProfil);
router.post("/", upload.single("file"), postController.createPost);

module.exports = router;
