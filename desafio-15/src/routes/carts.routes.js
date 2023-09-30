const { Router } = require("express");
const router = Router();
const CartManager = require("../dao/controllers/mongo/CartManager");
const ProductManager = require("../dao/controllers/mongo/ProductManager");
const cartsModel = require("../dao/models/carts.model");
const cartsData = require("../database/mongo/carts");

router.get("/insertion", async (req, res) => {
    try {
        const carts = await cartsModel.insertMany(cartsData);
        return res.json({
            message: 'carts insert successfully',
            productsInserted: carts
        })
    } catch (error) {
        return error
    }
});

router.get("/", async (req, res) => {
    const cartManager = new CartManager()
    const listCarts = await cartManager.getCart();
    return res.json({
        ok: true,
        message: 'lista de carritos exitoso',
        carts: listCarts
    })
});

router.get("/:cid", async (req, res) => {
    const cartManager = new CartManager();
    const cid = req.params.cid;
    const cart = await cartManager.getCartId(cid);
    if(cart){
        return res.json({
            ok: true,
            message: 'carrito encontrado',
            cid: cid,
            cart: cart.products
        })
    } else {
        return res.json({
            ok: false,
            message: 'carrito no encontrado',
            cid: cid,
            cart: cart
        })
    }
    
});

router.post("/", async (req, res) => {
    const cartManager = new CartManager();
    const cartBody = req.body
    const cart = await cartManager.addCart();
    return res.json({
        ok:true,
        message: 'carrito creado',
        cart: cart
    })
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartManager = new CartManager();
    const productManager = new ProductManager();
    const cid = req.params.cid;
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    const cart = await cartManager.addCartProduct(cid, pid)
    return res.json({
        ok: true,
        message: `agregado exitosamente a carrito ${cid} el producto ${pid}`,
        cid: cid,
        pid: pid,
        product: product,
        cart: cart
    })
});



module.exports = router;