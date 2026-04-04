const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Lấy TẤT CẢ reviews (chỉ admin)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
    try {
        const Review = require('../models/review');
        const reviews = await Review.find()
            .populate('user', 'username email')
            .populate('book', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/:bookId',          reviewController.getReviews);
router.post('/:bookId',         verifyToken, reviewController.createReview);
router.delete('/:id',           verifyToken, isAdmin, reviewController.deleteReview);

module.exports = router;