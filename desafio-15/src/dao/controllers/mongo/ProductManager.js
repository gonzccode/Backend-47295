const productsModel = require("../../models/products.model")

class ProductManager {

    constructor() {
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
                    /*Agregando en el DB Productos*/
                    return await productsModel.create({title, description, price, thumbnail, code, stock, status, category});
                } else {
                    let codeExist = await productsModel.findOne({code: code}) 
                    if (codeExist) {
                        return "ERROR: Ingresa otro código, este ya existe";
                    } else {
                        /*Agregando en el DB Productos*/
                        return await productsModel.create({title, description, price, thumbnail, code, stock, status, category});
                    }
                }
            }
        } catch (error) {
            return 'ERROR: Producto no agregado', error;
        }
    }

    getProducts = async () => {
        try {
            this.products = await productsModel.find().lean();
            return this.products;
        } catch (error) {
            this.products = []
            return this.products;
        }
    }    

    getProductById = async (id) => {
        try {
           const productFind = await productsModel.findById({_id: id}).lean();
           if(productFind) {
            return productFind;
           } else {
            return null;
           }
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    } 

    updateProduct = async (id, product) => {
        try {
            const productFind = await this.getProductById(id);
            if(productFind){
                return await productsModel.findByIdAndUpdate(id, {...product}); 
            }else {
                return false
            }
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    }

    deleteProduct = async (id) => {
        try {
            const productFind = await this.getProductById(id);
            if (productFind) {
                return await productsModel.findByIdAndDelete(id);
            } else {
                return false
            }
        } catch (error) {
            return 'ERROR: Producto no encontrado', error;
        }
    }
}

module.exports = ProductManager;