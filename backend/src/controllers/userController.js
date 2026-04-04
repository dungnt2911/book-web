const User = require('../models/user');
const bcrypt = require('bcrypt');
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được đăng ký rồi ông ơi!' });
        }

        // Tạo user mới
        // Lưu ý: Nếu trong model User ông đã có hàm pre-save để hash mật khẩu thì không cần hash ở đây.
        // Còn nếu chưa có thì dùng dòng này: const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password, // Password sẽ tự hash nếu model đã setup
            role: role || 'user'
        });

        await newUser.save();

        res.status(201).json({
            message: 'Thêm người dùng thành công!',
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error('Lỗi createUser:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo người dùng' });
    }
};

// 1. Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        // Lấy hết user, chỉ trừ mật khẩu ra cho bảo mật
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Cập nhật trạng thái (Khóa/Mở khóa)
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Không thể khóa tài khoản Admin!" });
        }

        // Đảo ngược trạng thái status (active <-> blocked)
        const newStatus = (user.status === 'active' || !user.status) ? 'blocked' : 'active';
        user.status = newStatus;
        await user.save();
        res.status(200).json({ 
            message: `Đã ${newStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản`, 
            status: newStatus
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role không hợp lệ' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        res.json({ message: 'Đã cập nhật quyền!', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Xóa người dùng (Nếu cần)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa người dùng thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};