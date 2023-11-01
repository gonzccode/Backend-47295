const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/controllers/mongo/ProductManager");
const authMdw = require("../middleware/auth.middleware");


router.get("/", async (request, response) => {
    response.render("login");
});

router.get('/register', async (request, response) => {
    response.render("register");
});
 
//esto cuando actualiza la pagina o entra a la ruta home y aun conservará los datos ingresados en login, el middleware es el intermediario
router.get('/home', authMdw, async (request, response) => {
    const userSession = request.session.user;
    console.log("views.routes /home userSession", userSession)
    const productManager = new ProductManager();
    const listProducts = await productManager.getProducts();
    response.status(200).render("home", {user: userSession._doc , products: listProducts});
});

module.exports = router;