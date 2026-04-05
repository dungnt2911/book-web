const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true }, // Mã (VD: NHATHU20)
  discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' }, // Giảm theo % hoặc số tiền cố định
  discountValue: { type: Number, required: true }, // Giá trị giảm 
  minAmount: { type: Number, default: 0 }, // Đơn hàng tối thiểu để áp dụng
  maxDiscount: { type: Number }, // Giảm tối đa bao nhiêu (dành cho loại percent)
  expiryDate: { type: Date, required: true }, // Ngày hết hạn
  usageLimit: { type: Number, default: 100 }, // Số lượng mã tối đa
  usedCount: { type: Number, default: 0 }, // Số lượng đã dùng
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
