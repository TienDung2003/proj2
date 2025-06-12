const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        amount: { type: Number, required: true, default: 1 }
    },
    { _id: false } // tránh tạo _id riêng cho mỗi item
);

const CartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        cartItems: [CartItemSchema]
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
