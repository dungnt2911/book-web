const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const User = require('../models/user');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.get('/',                verifyToken, isAdmin, userController.getAllUsers);
router.post('/',               verifyToken, isAdmin, userController.createUser);
router.patch('/:id/toggle',    verifyToken, isAdmin, userController.toggleUserStatus);
router.patch('/:id/role',      verifyToken, isAdmin, userController.updateUserRole); 
router.delete('/:id',          verifyToken, isAdmin, userController.deleteUser);

module.exports = router;