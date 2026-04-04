const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true }, // Thêm trường này để hiển thị và làm URL đẹp
  description: String,
  status: { type: String, default: 'active' } // Thêm trạng thái ẩn/hiện
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);