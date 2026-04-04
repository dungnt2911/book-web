const Review = require('../models/review');
const Book = require('../models/book');

// Lấy đánh giá theo sách
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Gửi đánh giá
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        // Kiểm tra đã đánh giá chưa
        const existing = await Review.findOne({ 
            book: req.params.bookId, 
            user: req.user.id 
        });
        if (existing) {
            return res.status(400).json({ message: 'Bạn đã đánh giá cuốn sách này rồi!' });
        }

        const review = await Review.create({
            book: req.params.bookId,
            user: req.user.id,
            rating,
            comment
        });
        const allReviews = await Review.find({ book: req.params.bookId });

const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

await Book.findByIdAndUpdate(req.params.bookId, {
    rating: avgRating.toFixed(1),
    numReviews: allReviews.length
});

        const populated = await review.populate('user', 'username email');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa đánh giá (admin)
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa đánh giá' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};