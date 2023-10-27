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

    updateCart = async (cid, productsBody) => {
        try {
            let cartFind = await cartsModel.findById({_id: cid});
            if(cartFind){
                cartFind = { cartFind, ...productsBody}
                await cartsModel.findByIdAndUpdate(cid, {...cartFind})
                return this.getCartId(cid); 
            } else {
                return false
            }
        } catch (error) {
            console.log("~❌ file: cart.manager ~ error => updateCart, ", error);
            return error
        }
    };

    updateProductToCart = async (cid, pid, product) => {
        try {
            const cartFind = await cartsModel.findById({_id: cid});
            if(cartFind){
                if(cartFind.products.length > 0) {
                    const productFind = cartFind.products.find( prod => prod._id == pid);
                    const productFindIndex = cartFind.products.findIndex( prod => prod._id == pid);
                    if (productFind) {
                        productFind.quantity = Number(product.quantity);
                        cartFind.products[productFindIndex] = productFind;
                        await cartsModel.findByIdAndUpdate(cid, {...cartFind})
                        return this.getCartId(cid);
                    } else {
                        return false
                    }
                } else {
                    return false
                }

            } else {
                return false
            }
        } catch (error) {
            console.log("~❌ file: cart.manager ~ error => updateProductToCart, ", error);
            return error
        }
    };

    deleteProductToCart = async (cid, pid) => {
        try {
            const cartFind = await cartsModel.findById({_id: cid}).lean();
            if(cartFind){
                if(cartFind.products.length > 0) {
                    const products = cartFind.products.filter( prod => prod._id != pid);
                    cartFind['products'] = products;
                    await cartsModel.findByIdAndUpdate(cid, {...cartFind});
                    return this.getCartId(cid);
                } else {
                    return false
                }
            } else {    
                return false
            }
            
        } catch (error) {
            console.log("~❌ file: cart.manager ~ error => deleteCart, ", error);
            return error
        }
    };

    deleteProducts = async (cid) => {
        try {
            const cartFind = await cartsModel.findById({_id: cid});
            if(cartFind){
                cartFind['products'] = [];
                await cartsModel.findByIdAndUpdate( cid, {...cartFind});
                return this.getCartId(cid);
            } else {
                return false
            }
        } catch (error) {
            console.log("~❌ file: cart.manager ~ error => deleteProducts, ", error);
            return error;
        }
        
    }
}

module.exports = CartManager;