const fs = require('fs');
const path = require('path');

class ProductManager {
    static id = 1;

    constructor() {
        this.path = path.join(`${__dirname}/products.json`);
        this.products = [];
    }

    addProduct = async ({title, description, price, thumbnail, code, stock} ) => {
        try {
            this.products = await this.getProducts();
            /*se verifica si algunos de los valores no están siendo ingresado*/
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return "ERROR: Debes completar todo los campos";
            } else if (title == "" || description == "" || price == "" || thumbnail == "" || code == "" || stock == "") {
                return "ERROR: Debes completar todo los campos";
            } else {
                if (this.products.length == 0) {
                    this.products.push({id: ProductManager.id, title, description, price, thumbnail, code, stock});
                    ProductManager.id++;
                    /*Agregando en el archivo Productos*/
                    return await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                } else {
                    let codeExist = this.products.some( product => product.code == code )
                    if (codeExist) {
                        return "ERROR: Ingresa otro código, este ya existe";
                    } else {
                        this.products.push({id: ProductManager.id, title, description, price, thumbnail, code, stock });
                        ProductManager.id++;
                        /*Agregando en el archivo Productos*/
                        return await fs.promises.writeFile(this.path, JSON.stringify(this.products))
                    }
                }
            }
        } catch (error) {
            console.log(error);
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
            return 'ERROR: Producto no encontrado';
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
            console.log(error);
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
            console.log('ERROR: Producto no encontrado', error);
        }
    }
 }

const functionProducts = async () => {
    const productManager = new ProductManager();

    console.log("-------------------------")
    console.log("Array Producto vacio")
    console.log(await  productManager.getProducts())
    console.log("-------------------------")

    /*INGRESAMOS EL PRIMER PRODUCTO*/
    await productManager.addProduct({
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
    });

    console.log("Se agregó el producto")
    console.log(await productManager.getProducts());
    console.log("-------------------------")

    /*BUSCANDO PRODUCTO*/
    console.log("Producto encontrado")
    console.log(await productManager.getProductById(1));
    console.log("-------------------------")
    console.error(await productManager.getProductById(3));
    console.log("-------------------------")

    /*ACTUALIZANDO PRODUCTO*/
    await productManager.updateProduct(1, 
        {
            title: 'producto actualizado',
            description: 'descripcion actualizado'
        }
    )
    console.log("Producto actualizado")
    console.log( await productManager.getProducts());
    console.log("-------------------------")

    /*ELIMINANDO PRODUCTO*/
    await productManager.deleteProduct(1);
    console.log("-------------------------")

    /*MOSTRANDO PRODUCTOS*/
    console.log("MOSTRANDO PRODUCTOS")
    console.log( await productManager.getProducts());
}

functionProducts();

