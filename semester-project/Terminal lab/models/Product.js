const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    rating: Number,
    stock: Number,
    image: String,
    isOnSale: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Product', productSchema);