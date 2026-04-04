const Order = require('../models/order');
const Book  = require('../models/book');

// 1. LẤY ĐƠN HÀNG CỦA TÔI (Bổ sung mới)
exports.getMyOrders = async (req, res) => {
  try {
    // Tìm các đơn hàng mà trường user khớp với ID người đang đăng nhập
    const orders = await Order.find({ user: req.user.id }) 
      .populate('items.book', 'title image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Lấy tất cả đơn hàng (Admin - Giữ nguyên)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.book', 'title image')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Tạo đơn hàng mới (Sửa chỗ gán User)
exports.createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      // SỬA Ở ĐÂY: Dùng req.user.id từ Token đã verify
      user: req.user.id 
    });
    await order.save();

    // Logic cập nhật stock và sold (Giữ nguyên)
    const updatePromises = (req.body.items || []).map(item => {
      if (!item.book || !item.qty) return null;
      return Book.findByIdAndUpdate(
        item.book,
        {
          $inc: {
            stock: -item.qty,
            sold:  +item.qty
          }
        },
        { new: true }
      );
    }).filter(Boolean);

    await Promise.all(updatePromises);
    res.status(201).json({ message: 'Đặt hàng thành công!', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 4. Cập nhật trạng thái (Giữ nguyên)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json({ message: 'Đã cập nhật!', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 5. Lấy chi tiết bằng ID (Giữ nguyên)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.book', 'title image')
      .populate('user', 'username email');
    
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};