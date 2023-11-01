const { Router } = require("express");
const router = Router();
const userModel = require("../dao/models/user.model");
const ProductManager = require("../dao/controllers/mongo/ProductManager");

router.get("/logout", async (request, response) => {
    request.session.destroy((error) => {
        //esto redirecciona al login que tiene la ruta "/"
        if(!error) return response.redirect("/");
        return response.send({
            ok: false,
            message: 'Logout error',
            body: error
        })
    });
});


router.post("/login", async (request, response) => {
    const { email, password } = request.body;
    const session = request.session;
    console.log("session.routes => /login => session", session)
    const findUser = await userModel.findOne({email});
    if (!findUser) {
        return response.json({ message: `este usuario no esta registrado` });
    }
  
    if (findUser.password !== password) {
        return response.json({ message: `password incorrecto` });
    }

    console.log("session.routes => /login => findUser", findUser)
    request.session.user = { ...findUser };

    const productManager = new ProductManager();
    const listProducts = await productManager.getProducts();

    return response.render("home", { user: {
        first_name: request.session?.user?.first_name || findUser.first_name,
        last_name: request.session?.user?.last_name || findUser.last_name,
        email: request.session?.user?.email || email,
        age: request.session?.user?.age || findUser.age,
        role: request.session?.user?.role || findUser.role,
    },
    products: listProducts
    });

});

router.post("/register", async (request, response) => {
    try {
        const { first_name, last_name, email, age, role, password } = request.body;
        const userAdd = { first_name, last_name, email, age, role, password };
        const newUser = await userModel.create(userAdd);
        request.session.user = {email, first_name, last_name, age, role}
        return response.status(200).render("login")
    } catch (error) {
        console.log("~❌ file: session.router ~ error => post /register, ", error);
        return error
    }
    
});

module.exports = router;