const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/controllers/mongo/ProductManager");

router.get("/", async (request, response) => {
    const productManager = new ProductManager();
    const listProducts = await productManager.getProducts();
    console.log("home router ", listProducts)
    response.status(200).render("home", {products: listProducts});
});

module.exports = router;