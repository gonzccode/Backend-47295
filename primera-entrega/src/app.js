const express = require("express");
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");

const PORT = 8080;
const BASE_PREFIX = "api";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    return res.send("Welcome first installment")
})

app.use(`/${BASE_PREFIX}/products`, productsRoutes);
app.use(`/${BASE_PREFIX}/carts`, cartsRoutes);


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
} )