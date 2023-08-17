const express = require("express");
const ProductManager = require("./ProductManager");
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.send("Utilizando express")
})

app.get("/products", async (req, res) => {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();

    if (req.query.limit) {
        const limit = parseInt(req.query.limit, 10);
        const productsLimit = products.filter( product => product.id <= limit);
        
        return res.send(productsLimit);
    } else {

        return res.send(products);
    }
})

app.get("/products/:pid", async (req, res) => {
    const productManager = new ProductManager();
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(pid);

    if(product) {
        return res.send(product);
    } else {
        return res.json({
            ok: false,
            message: 'ERROR: Producto no encontrado',
            id: pid
        })
    }
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
} )