const express = require("express");
const router = express.Router()
const { removeMultipleFromCart, removeFromCart, clearCart, getCartByUser, saveCart } = require('../controllers/cartController');
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.get('/:userId', getCartByUser);    // <-- Đây là API lấy giỏ hàng theo user
router.post('/save', saveCart);
router.delete('/remove', removeFromCart);
router.delete('/clear', authUserMiddleWare, clearCart);
router.post('/remove-multiple', removeMultipleFromCart);
module.exports = router
