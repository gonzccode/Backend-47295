const mongoose = require("mongoose");

const usersCollection = "Users";

const usersSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    }, 
    last_name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: function() {
            if ( this. email == 'adminCoder@coder.com'){
                return 'admin'
            } else {
                return 'user'
            }
        }
    },
    password: {
        type: String
    },
    cart: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Carts"
                }
            }
        ]
    }
});

const userModel = mongoose.model(usersCollection, usersSchema);

module.exports = userModel;