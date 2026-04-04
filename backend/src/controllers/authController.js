const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const User = require('../models/user');

// Đăng ký
exports.register = async (req, res) => {
  try {
    
    const { username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được đăng ký' });
    }

    const newUser = new User({
      username: username || email, 
      email,
      password 
    });

    await newUser.save();

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    console.error('Lỗi register:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

    res.json({
    message: 'Đăng nhập thành công',
    token,
    user: { 
      id: user._id, 
      email: user.email, 
      username: user.username, 
      role: user.role 
    }
  });
} catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};