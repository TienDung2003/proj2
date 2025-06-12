const Cart = require('../models/CartModel')

const addToCart = async ({ userId, productId, quantity }) => {
    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }],
        })
    } else {
        const index = cart.items.findIndex((item) => item.product.toString() === productId)

        if (index > -1) {
            cart.items[index].quantity += quantity
        } else {
            cart.items.push({ product: productId, quantity })
        }

        await cart.save()
    }

    return cart
}

const getCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    return cart
}

const removeFromCart = async ({ userId, productId }) => {
    const cart = await Cart.findOne({ user: userId })

    if (!cart) return null

    cart.items = cart.items.filter(item => item.product.toString() !== productId)
    await cart.save()
    return cart
}

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('ser', userId);

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ status: 'ERR', message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({ status: 'OK', message: 'Cart cleared successfully' });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: error.message });
    }
};


module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
}
