const { Router } = require("express");
const router = Router();
const ProductManager = require("../controllers/ProductManager");
const path = require("path");

router.get("/", async (request, response) => {
    const pathDb = path.join(`${__dirname}/../database/products.json`);
    const productManager = new ProductManager(pathDb);
    const listProducts = await productManager.getProducts();
    response.status(200).render("home", {products: listProducts});
});

module.exports = router;