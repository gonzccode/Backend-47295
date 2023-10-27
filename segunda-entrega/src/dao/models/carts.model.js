const mongoose = require("mongoose");

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

// cartsSchema.pre("findById", function() {
//     this.populate("products.product");
// });

const cartModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartModel;