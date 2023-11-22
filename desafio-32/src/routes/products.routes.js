const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/controllers/mongo/ProductManager");
const productsModel = require("../dao/models/products.model");
const productsData = require("../database/mongo/products");

/*Agregando datos a Mongo*/
router.get("/insertion", async (req, res) => {
    try {
        const products = await productsModel.insertMany(productsData);
        return res.json({
            message: 'products insert successfully',
            productsInserted: products
        })
    } catch (error) {
        return error
    }
});


router.get("/", async (req, res) => {
    const productManager = new ProductManager();
    const { limit = 10, page = 1, sort: sortPage, query } = req.query;
    const products = await productManager.getProducts();

    /*para QUERY se tiene los filtros de categoria y stock
    categoria => education, sport, entertainment
    status => true o false
    
    para SORT es respecto al precio*/

    if(sortPage && !query) {
        const {
            docs,
            totalDocs,
            limit: limitPages,
            totalPages,
            prevPage,
            nextPage,
            page : pageActual,
            hasPrevPage,
            hasNextPage,
        } = await productsModel.paginate({}, {page, limit, sort: {price: sortPage}, lean: true} );

        //retornando un objeto con los valores
        return res.status(200).render("products", {
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: pageActual,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage? `?limit=${limit}&page=${Number(page) - 1}&sort=${sortPage}` : null,
            nextLink: hasNextPage ? `?limit=${limit}&page=${Number(page) + 1}&sort=${sortPage}` : null
        });

    } else if (!sortPage && query){
        const {
            docs,
            totalDocs,
            limit: limitPages,
            totalPages,
            prevPage,
            nextPage,
            page : pageActual,
            hasPrevPage,
            hasNextPage,
        } = await productsModel.paginate({category: query}, {page, limit, lean: true} );

        //retornando un objeto con los valores
        return res.status(200).render("products", {
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: pageActual,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) - 1}&query=${query}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) + 1}&query=${query}` : null
        });

    } else if (!sortPage & !query) {
        const {
            docs,
            totalDocs,
            limit: limitPages,
            totalPages,
            prevPage,
            nextPage,
            page : pageActual,
            hasPrevPage,
            hasNextPage,
        } = await productsModel.paginate({}, {page, limit, lean: true} );

        //retornando un objeto con los valores
        return res.status(200).render("products", {
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: pageActual,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) - 1}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) + 1}` : null
        });

    } else {
        const {
            docs,
            totalDocs,
            limit: limitPages,
            totalPages,
            prevPage,
            nextPage,
            page : pageActual,
            hasPrevPage,
            hasNextPage,
        } = await productsModel.paginate({category: query}, {page, limit, sort: {price: sortPage}, lean: true} );

        //retornando un objeto con los valores
        return res.status(200).render("products", {
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: pageActual,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) - 1}&query=${query}&sort=${sortPage}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/api/products?limit=${limit}&page=${Number(page) + 1}&query=${query}&sort=${sortPage}` : null
        });
    }
});

router.get("/:pid", async (req, res) => {
    const productManager = new ProductManager();
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);

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
    await productManager.updateProduct(pid, productBody);
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
    const productDelete = await productManager.deleteProduct(pid);
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
