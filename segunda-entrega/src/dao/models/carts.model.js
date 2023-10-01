const mongoose = require("mongoose");

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

const cartModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartModel;