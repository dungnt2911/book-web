const express = require('express');
const router  = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// 1. Lấy đơn hàng của cá nhân (Phải để TRƯỚC các route có tham số :id)
router.get('/my-orders', verifyToken, orderController.getMyOrders);

// 2. Tạo đơn hàng mới (BẮT BUỘC phải có verifyToken để lấy ID người mua)
router.post('/', verifyToken, orderController.createOrder);          

// 3. Admin lấy tất cả đơn hàng 
router.get('/', verifyToken, isAdmin, orderController.getOrders);

// 4. Admin cập nhật trạng thái 
router.put('/:id', verifyToken, isAdmin, orderController.updateOrder);

// 5. Xem chi tiết đơn hàng
router.get('/:id', verifyToken, isAdmin, orderController.getOrderById);

module.exports = router;