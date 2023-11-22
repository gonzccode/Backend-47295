const fs = require("fs/promises");
const path = require('path');

class CartManager {
    constructor () {
        this.path = path.join(`${__dirname}/../../../database/fs/carts.json`);
        this.carts = [];
    }

    getCart = async () => {
        try {
            this.carts = await fs.readFile(this.path);
            return JSON.parse(this.carts)
        } catch (error) {
            return error
        }
    };

    getCartId = async (id) => {
        try {
            this.carts = await this.getCart();
            const cartFind = this.carts.find( cart => cart.id === id);
            return cartFind
        } catch (error) {
            return error
        }
    };

    addCart = async () => {
        try {
            this.carts = await this.getCart();
            if (this.carts.length > 0){
                this.carts.push({
                    id: this.carts.length + 1,
                    products: []
                })
            } else {
                this.carts.push({
                    id: 1,
                    products: []
                })
            }

            return await fs.writeFile(this.path, JSON.stringify(this.carts));

        } catch (error) {
            return error
        }
    };

    addCartProduct = async (cid, pid) => {
       try {
        this.carts = await this.getCart();
        const cartFind = this.carts.find( cart => cart.id === cid);
        const cartFindIndex = this.carts.findIndex( cart => cart.id === cid);
        if (cartFind) {
            if(cartFind.products.length > 0) {
                const productFind = cartFind.products.find( product => product.productid === pid);
                const productFindIndex = cartFind.products.findIndex( product => product.productid === pid);
                if (productFind) {
                    productFind.quantity = productFind.quantity + 1;
                    cartFind.products[productFindIndex] = productFind;
                    this.carts[cartFindIndex] = cartFind;
                    return await fs.writeFile(this.path, JSON.stringify(this.carts));

                } else {
                    const quantity = 1
                    cartFind.products.push({productid: pid, quantity: quantity});
                    this.carts.push(cartFind)
                    return await fs.writeFile(this.path, JSON.stringify(this.carts))
                    
                }
            } else {
                const quantity = 1
                cartFind.products.push({productid: pid, quantity: quantity});
                this.carts[cartFindIndex] = cartFind;
                return await fs.writeFile(this.path, JSON.stringify(this.carts))

            }
            
        } else {
            this.carts.push({
                id: cid,
                products: [
                    {
                        productid: pid,
                        quantity: 1
                    }
                ]
            })
            return await fs.writeFile(this.path, JSON.stringify(this.carts));
            
        }
        
       } catch (error) {
            return error
       }
    };
}

module.exports = CartManager;