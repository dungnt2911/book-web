const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/validate', ctrl.validateCoupon);

router.get('/', verifyToken, isAdmin, ctrl.getAllCoupons);
router.post('/', verifyToken, isAdmin, ctrl.createCoupon);
router.delete('/:id', verifyToken, isAdmin, ctrl.deleteCoupon);

module.exports = router;