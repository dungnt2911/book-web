const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // Để làm hiển thị giảm giá
  image: { type: String },    // Lưu link ảnh sau khi upload
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: String, required: true },
  publisher: { type: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }, // Số lượng tồn kho
  isFeatured: { type: Boolean, default: false } // Sách nổi bật
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);