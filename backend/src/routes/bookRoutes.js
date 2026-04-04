const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= PUBLIC =================
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);

// ================= ADMIN =================
router.post(
  '/',
  verifyToken,
  isAdmin,
  upload.single('image'),
  bookController.createBook
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  upload.single('image'),
  bookController.updateBook
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  bookController.deleteBook
);

module.exports = router;