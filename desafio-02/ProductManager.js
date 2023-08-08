class ProductManager {
    static id = 1

    constructor() {
        this.products = []
    }

    addProduct = ({title, description, price, thumbnail, code, stock} ) => {
        /*se verifica si algunos de los valores no están siendo ingresado*/
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "ERROR: Debes completar todo los campos";
        } else if (title == "" || description == "" || price == "" || thumbnail == "" || code == "" || stock == "") {
            return "ERROR: Debes completar todo los campos";
        } else {
            if (this.products.length == 0) {
                this.products.push({id: ProductManager.id, title, description, price, thumbnail, code, stock});
                ProductManager.id++;
            } else {
                let codeExist = this.products.some( product => product.code === code )
                if (codeExist) {
                    return "ERROR: Ingresa otro código, este ya existe";
                } else {
                    this.products.push({id: ProductManager.id, title, description, price, thumbnail, code, stock });
                    ProductManager.id++;
                }
            }
            
        }
    }

    getProducts = () => this.products

    getProductById = (id) => this.products.find( product => product.id === id ) || 'ERROR: Producto no encontrado';
}

const productManager = new ProductManager();

console.log("-------------------------")
/*hacemos la muestra del array producto vacio*/
console.log(productManager.getProducts())

console.log("-------------------------")

/*ingresamos el primer producto*/
productManager.addProduct({
	title: 'producto prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 25
});

/*mostrando el producto ingresado*/
console.log(productManager.getProducts());

console.log("-------------------------")

/*probando si el codigo se repite*/
productManager.addProduct({
	title: 'producto prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 25
});

console.log("-------------------------")
/*buscando producto*/
/*producto no encontrado*/
console.error(productManager.getProductById(3));
console.log("-------------------------")
/*producto enconntrado*/
console.log(productManager.getProductById(1));

console.log("-------------------------")
/*agregando nuevo producto*/
productManager.addProduct({
	title: 'producto prueba 2',
	description: 'Este es un producto prueba 2',
	price: 100,
	thumbnail: 'Con imagen',
	code: 'abc456',
	stock: 15
});

/*mostrando el producto ingresado*/
console.log(productManager.getProducts());