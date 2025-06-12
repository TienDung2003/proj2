const Cart = require("../models/CartModel");
const mongoose = require("mongoose");
const cartService = require('../services/CartService');

// Lưu hoặc cập nhật giỏ hàng
const saveCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        if (!userId || !Array.isArray(cartItems)) {
            return res.status(400).json({
                status: "ERROR",
                message: "userId và cartItems là bắt buộc"
            });
        }

        const existingCart = await Cart.findOne({ user: userId });

        if (existingCart) {
            existingCart.cartItems = cartItems;
            existingCart.updatedAt = Date.now();
            await existingCart.save();
            return res.status(200).json({
                status: "OK",
                message: "Cập nhật giỏ hàng thành công",
                data: existingCart
            });
        } else {
            const newCart = new Cart({ user: userId, cartItems });
            await newCart.save();
            return res.status(201).json({
                status: "OK",
                message: "Tạo giỏ hàng thành công",
                data: newCart
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi không xác định khi lưu giỏ hàng"
        });
    }
};

// Lấy giỏ hàng theo userId
const getCartByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "ERROR",
                message: "userId không hợp lệ"
            });
        }

        const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");
        if (!cart) {
            return res.status(404).json({
                status: "ERROR",
                message: "Không tìm thấy giỏ hàng"
            });
        }

        return res.status(200).json({
            status: "OK",
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: error.message || "Lỗi không xác định khi lấy giỏ hàng"
        });
    }
};
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", status: "ERROR" });
        }

        cart.cartItems = []; // Xoá tất cả sản phẩm
        await cart.save();

        return res.status(200).json({ message: "Cart cleared successfully", status: "OK" });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: "ERROR" });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ status: 'ERR', message: 'Missing productId' });
        }

        const cart = await cartService.removeFromCart({ userId, productId });
        if (!cart) {
            return res.status(404).json({ status: 'ERR', message: 'Cart not found' });
        }

        return res.status(200).json({ status: 'OK', message: 'Product removed from cart', data: cart });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const removeMultipleFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds)) {
            return res.status(400).json({ status: 'ERR', message: 'Danh sách sản phẩm không hợp lệ' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ status: 'ERR', message: 'Cart not found' });

        cart.items = cart.items.filter(item => !productIds.includes(item.product.toString()));
        await cart.save();

        return res.status(200).json({ status: 'OK', message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: error.message });
    }
};
module.exports = {
    saveCart,
    getCartByUser,
    clearCart,
    removeFromCart,
    removeMultipleFromCart

};
