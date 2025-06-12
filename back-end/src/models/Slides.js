// models/Slide.js
const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false, // Cho phép slide không bắt buộc phải có liên kết sản phẩm
    },
});

const Slide = mongoose.model('Slide', slideSchema);
module.exports = Slide;