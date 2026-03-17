const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/requireAuth');
const postController = require('../controllers/postController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', requireAuth, upload.single('image'), postController.createPost);
router.put('/:id', requireAuth, upload.single('image'), postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
