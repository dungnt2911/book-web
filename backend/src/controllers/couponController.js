const Coupon = require('../models/coupon');

// 1. Admin lấy danh sách mã
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 2. Admin tạo mã mới
exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json({ message: "Thêm mã thành công!", coupon: newCoupon });
  } catch (err) { res.status(400).json({ message: "Mã đã tồn tại hoặc dữ liệu sai!" }); }
};

// 3. Xóa mã
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa mã giảm giá!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// 4. KIỂM TRA MÃ (Dùng lúc khách thanh toán)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), status: 'active' });

    if (!coupon) return res.status(404).json({ message: "Mã không tồn tại hoặc đã hết hạn" });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ message: "Mã đã quá hạn sử dụng" });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Mã đã hết lượt sử dụng" });
    if (orderTotal < coupon.minAmount) return res.status(400).json({ message: `Đơn hàng tối thiểu phải từ ${coupon.minAmount}đ` });
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });

    res.json({ message: "Áp dụng mã thành công!", coupon });
  } catch (err) { res.status(500).json({ message: err.message }); }
};