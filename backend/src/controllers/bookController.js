const Book = require('../models/book');
const path = require('path');
const fs   = require('fs');

// 1. Lấy tất cả sách
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Lấy 1 sách theo ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category');
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Thêm sách mới
exports.createBook = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const book = new Book(data);
    await book.save();
    res.status(201).json({ message: 'Đã thêm sách!', book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 4. Cập nhật sách
exports.updateBook = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      // Xóa ảnh cũ nếu có
      const old = await Book.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, '../uploads', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.image = req.file.filename;
    }
    const book = await Book.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    res.json({ message: 'Cập nhật thành công!', book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 5. Xóa sách
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
    if (book.image) {
      const imgPath = path.join(__dirname, '../uploads', book.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    res.json({ message: 'Đã xóa sách' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};