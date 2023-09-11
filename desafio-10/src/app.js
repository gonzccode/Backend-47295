const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");

const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const homeRoutes = require("./routes/home.routes");

const PORT = 8080;
const BASE_PREFIX = "api";
const app = express();

//configurando handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

//configurando carpeta public
app.use(express.static(`${__dirname}/public`));

//configuracion para que sea leido disntintos formatos en los params
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//get para realtimeproducts
app.get("/realtimeproducts", (request, response) => {
    response.status(200).render('realTimeProducts');
});

//get para routes products y carts
app.use('/', homeRoutes);
app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/carts`, cartsRoutes);

//construyendo server
const server = app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});
const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("cliente conectado");

    //extrayendo lista de productos para real time products
    const listProductRealTime = await productManager.getProduct();

    //enviando la lista de producto con el mensaje listproducts
    socket.emit('listProductsReal', listProductRealTime);

    //escuchando el mensaje addproduct paraagregar producto
    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product);
    })

    //escuchando el mensaje deleteproduct para eliminar producto
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(Number(id));
    })

});