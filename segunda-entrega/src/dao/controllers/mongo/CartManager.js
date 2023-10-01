const cartsModel = require("../../models/carts.model")

class CartManager {
    constructor () {
        this.carts = [];
    }

    getCart = async () => {
        try {
            this.carts = await cartsModel.find().lean();
            return this.carts
        } catch (error) {
            return error
        }
    };

    getCartId = async (id) => {
        try {
            const cartFind = await cartsModel.findById({_id: id}).lean();
            return cartFind
        } catch (error) {
            return error
        }
    };

    addCart = async () => {
        try {
            const newCart = await cartsModel.create({products: []});
            console.log(newCart)
            return newCart

        } catch (error) {
            return error
        }
    };

    addCartProduct = async (cid, pid) => {
       try {
        this.carts = await this.getCart();
        const cartFind = await cartsModel.findById({_id: cid}).lean();
        if (cartFind) {
            if(cartFind.products.length > 0) {
                const productFind = cartFind.products.find( product => product.productid === pid);
                const productFindIndex = cartFind.products.findIndex( product => product.productid === pid);
                if (productFind) {
                    productFind.quantity = productFind.quantity + 1;
                    cartFind.products[productFindIndex] = productFind;
                    await cartsModel.findByIdAndUpdate(cid, {...cartFind})
                    return this.getCartId(cid);
                } else {
                    const quantity = 1
                    cartFind.products.push({productid: pid, quantity: quantity});
                    await cartsModel.findByIdAndUpdate(cid, {...cartFind})
                    return this.getCartId(cid);
                    //return await cartFind.save();
                }
            } else {
                const quantity = 1
                cartFind.products.push({productid: pid, quantity: quantity});
                await cartsModel.findByIdAndUpdate(cid, {...cartFind})
                return this.getCartId(cid);
            }
        } else {
            return false; 
        }
        
       } catch (error) {
            return error
       }
    };
}

module.exports = CartManager;