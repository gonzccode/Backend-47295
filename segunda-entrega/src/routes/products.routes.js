const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/controllers/mongo/ProductManager");
const productsModel = require("../dao/models/products.model");
const productsData = require("../database/mongo/products");

/*Agregando datos a Mongo*/
router.get("/insertion", async (req, res) => {
    try {
        const products = await productsModel.insertMany(productsData);
        return res.json({
            message: 'products insert successfully',
            productsInserted: products
        })
    } catch (error) {
        return error
    }
});


router.get("/", async (req, res) => {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();

    if (req.query.limit) {
        const limit = parseInt(req.query.limit, 10);
        const productsLimit = products.filter( product => product.id <= limit);
        
        return res.send(productsLimit);
    } else {

        return res.send(products);
    }
});

router.get("/:pid", async (req, res) => {
    const productManager = new ProductManager();
    const pid = req.params.pid;
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
});

router.post("/", async (req, res) => {
    const productManager = new ProductManager();
    const productBody = req.body;
    const {title, description, price, code, stock, category} = productBody
    if (!title || !description || !price || !code || !stock || !category) {
        return res.json({
            ok: false,
            message: 'ERROR: Debes completar todo los campos',
            product: productBody
        })
    } else if (title == "" || description == "" || price == "" || code == "" || stock == "" || category == "" ) {
        return res.json({
            ok: false,
            message: 'ERROR: Debes completar todo los campos',
            product: productBody
        })
    } else {
        await productManager.addProduct(productBody)
        const listProducts = await productManager.getProducts();
        return res.json({
            ok:true,
            message: 'producto creado correctamente',
            products: listProducts
        })
    }
});

router.put("/:pid", async (req, res) => {
    const productManager = new ProductManager();
    const pid = req.params.pid;
    const productBody = req.body;
    await productManager.updateProduct(pid, productBody);
    const listProducts = await productManager.getProducts();
    return res.json({
        ok: true,
        message: `producto ${pid} actualizado`,
        pid: pid,
        products: listProducts
    });

});

router.delete("/:pid", async (req, res) => {
    const productManager = new ProductManager();
    const pid = req.params.pid;
    const productDelete = await productManager.deleteProduct(pid);
    const listProducts = await productManager.getProducts();
    
    if(productDelete) {
        return res.json({
            ok: true,
            message: `producto ${pid} eliminado`,
            pid: pid,
            products: listProducts
        });
    } else {
        return res.json({
            ok: false,
            message: 'ERROR: El id ingresado está fuera de rango',
            id: pid
        })
    }
});

module.exports = router;
