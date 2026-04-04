const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../configs/passport');
const jwt = require('jsonwebtoken');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://127.0.0.1:5500/frontend/Auth.html' }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.redirect(`http://127.0.0.1:5500/frontend/Auth.html?token=${token}`);
    }
);

module.exports = router;