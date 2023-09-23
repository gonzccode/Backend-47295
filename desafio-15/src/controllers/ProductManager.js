const fs = require('fs');
const path = require('path');

class ProductManager {
    static id = 1;

    constructor() {
        this.path = path.join(`${__dirname}/../database/products.json`);
        this.products = [];
    }

    addProduct = async ({title, description, price, thumbnail = "sin imagen", code, stock, status= true, category}) => {
        try {
            this.products = await this.getProducts();
            /*se verifica si algunos de los valores no están siendo ingresado*/
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return "ERROR: Debes completar todo los campos";
            } else if (title == "" || description == "" || price == "" || thumbnail == "" || code == "" || stock == "") {
                return "ERROR: Debes completar todo los campos";
            } else {
                if (this.products.length == 0) {
                    this.products.push({id: this.products.length + ProductManager.id, title, description, price, thumbnail, code, stock});
                    ProductManager.id++;
                    /*Agregando en el archivo Productos*/
                    return await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                } else {
                    let codeExist = this.products.some( product => product.code == code )
                    if (codeExist) {
                        return "ERROR: Ingresa otro código, este ya existe";
                    } else {
                        this.products.push({id: this.products.length + ProductManager.id, title, description, price, thumbnail, code, stock });
                        ProductManager.id++;
                        /*Agregando en el archivo Productos*/
                        return await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                    }
                }
            }
        } catch (error) {
            return 'ERROR: Producto no agregado', error;
        }
    }

    getProducts = async () => {
        try {
            this.products = await fs.promises.readFile(this.path);
            return JSON.parse(this.products);
        } catch (error) {
            this.products = []
            return this.products;
        }
    }    

    getProductById = async (id) => {
        try {
           this.products = await this.getProducts();
           let product = this.products.find( product => product.id === id );
           if(product) {
            return product;
           } else {
            return null;
           }
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    } 

    updateProduct = async (id, product) => {
        try {
            this.products = await this.getProducts();
            let productFind = await this.getProductById(id);
            let productIndex = this.products.findIndex(product => product.id === id);
            this.products[productIndex] = {...productFind, ...product};
            return await fs.promises.writeFile(this.path, JSON.stringify(this.products));
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    }

    deleteProduct = async (id) => {
        try {
            this.products = await this.getProducts();
            let productFind = this.products.find( product => product.id === id );
            if(productFind) {
                this.products = this.products.filter( product => product.id !== id );
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                return console.log(`Producto ${id} eliminado`);
            } else {
                console.log('ERROR: Producto no encontrado, no se pudo eliminar');
            }
            
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    }
}

module.exports = ProductManager;