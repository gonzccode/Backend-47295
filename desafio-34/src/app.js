const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const homeRoutes = require("./routes/home.routes");
const chatRoutes = require("./routes/chat.routes");
const sessionRoutes = require("./routes/session.routes");
const viewRoutes = require("./routes/views.routes")
const ProductManager = require("./dao/controllers/mongo/ProductManager");
const {PORT, DB_NAME, DB_USER, DB_PASSWORD} = require("./config/config");

const productManager = new ProductManager();
const PORT_API = Number(PORT) || 8080;
const BASE_PREFIX = "api";
const MONGO_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@ecommerce.l0js7fh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
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

//configurando session
app.use(cookieParser());
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 60 * 3600,
        }),
        secret: "secretSession",
        resave: false,
        saveUninitialized: false,
    })
)

//iniciando passport github
initializePassport();
app.use(passport.initialize());

//get para realtimeproducts
app.get("/realtimeproducts", (req, res) => {
    res.status(200).render('realTimeProducts');
});

//get para routes products y carts
app.use('/', viewRoutes);
app.use('/chat', chatRoutes);
app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/carts`, cartsRoutes);
app.use(`/${BASE_PREFIX}/session`, sessionRoutes);

//construyendo server
const server = app.listen(PORT_API, () => {
    console.log(`Running on Port ${PORT_API}`);
});
const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("cliente conectado");

    //extrayendo lista de productos para real time products
    let listProductRealTime = await productManager.getProducts();
    
    //enviando la lista de producto con el mensaje listproducts
    socket.emit('listProductsReal', listProductRealTime);

    //escuchando el mensaje addproduct paraagregar producto
    socket.on('addProduct', async (product) => {
        await productManager.addProduct(product); 
        listProductRealTime =await productManager.getProducts();
        socket.emit('listProductsReal', listProductRealTime);
    });

    //escuchando el mensaje deleteproduct para eliminar producto
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        listProductRealTime =await productManager.getProducts();
        socket.emit('listProductsReal', listProductRealTime);
    });

});

mongoose.connect(
    MONGO_URL
);