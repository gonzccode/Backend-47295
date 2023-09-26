const mongoose = require("mongoose");

const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    category: {
        type: String,
        required: true,
    }
});

const productModel = mongoose.model(productsCollection, productsSchema);

module.exports = productModel;