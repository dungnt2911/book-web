const jwt = require('jsonwebtoken');

//Xác thực người dùng (đã đăng nhập chưa)
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Cần đăng nhập!" });
        }

        // Format: Bearer token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token không tồn tại!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // lưu thông tin user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn!" });
    }
};

// Kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
    
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Không có quyền admin hoặc phiên đăng nhập hết hạn!" });
    }
    next();
};