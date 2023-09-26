const { Router } = require("express");
const router = Router();
const CartManager = require("../dao/controllers/fs/CartManager");
const ProductManager = require("../dao/controllers/fs/ProductManager");

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
    const cart = await cartManager.getCartId(Number(cid));
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
    const product = await productManager.getProductById(Number(pid));
    const cart = await cartManager.addCartProduct(Number(cid), Number(pid))
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