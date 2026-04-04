const Category = require('../models/category');
const Book = require('../models/book');

// 1. Lấy tất cả thể loại
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tạo thể loại mới
exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. Cập nhật thể loại
exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4. Xóa thể loại
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        
        const booksCount = await Book.countDocuments({ category: categoryId });

        
        if (booksCount > 0) {
            return res.status(400).json({ 
                message: `Không thể xóa! Danh mục này đang chứa ${booksCount} cuốn sách. Hãy xóa hoặc chuyển sách sang danh mục khác trước.` 
            });
        }

       
        const deletedCat = await Category.findByIdAndDelete(categoryId);
        
        if (!deletedCat) {
            return res.status(404).json({ message: "Không tìm thấy danh mục để xóa" });
        }

        res.status(200).json({ message: "Xóa danh mục thành công!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};