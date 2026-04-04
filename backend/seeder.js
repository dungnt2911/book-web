const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./src/models/category'); // Kiểm tra lại đường dẫn này nhé

dotenv.config();

// Kết nối database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nhathu')
  .then(() => console.log('🚀 Đã kết nối để nạp dữ liệu...'))
  .catch(err => console.error(err));

const categories = [
  { name: 'Văn Học', slug: 'van-hoc', description: 'Các tác phẩm văn học kinh điển và hiện đại' },
  { name: 'Tâm Lý', slug: 'tam-ly', description: 'Sách về kỹ năng và thấu hiểu bản thân' },
  { name: 'Kinh Tế', slug: 'kinh-te', description: 'Kiến thức tài chính, kinh doanh' },
  { name: 'Khoa Học', slug: 'khoa-hoc', description: 'Khám phá thế giới và công nghệ' },
  { name: 'Thiếu Nhi', slug: 'thieu-nhi', description: 'Sách dành cho trẻ em' }
];

const seedDB = async () => {
  try {
    await Category.deleteMany({}); // Xóa hết cũ để nạp mới cho sạch
    await Category.insertMany(categories);
    console.log(' Đã nạp danh mục thành công!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();