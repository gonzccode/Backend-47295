const { Router } = require("express");
const router = Router();
const ProductManager = require("../controllers/ProductManager");

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
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductsById(pid);

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
    await productManager.updateProduct(Number(pid), productBody);
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
    const productDelete = await productManager.deleteProduct(Number(pid));
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
