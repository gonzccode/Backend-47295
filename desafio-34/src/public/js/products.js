const socket = io();

const btnAddForm = document.getElementById("btn-add-product");
const formProduct = document.getElementById("add-product");

const addProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(formProduct);
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        code: formData.get('code'),
        stock: formData.get('stock'),
        category: formData.get('category'),
    };
    socket.emit('addProduct', product);
    formProduct.reset();
};

const deleteProduct = (e) => {
    socket.emit('deleteProduct', e.target.id);
};

socket.on("listProductsReal", listProductRealTime => {
    const listProductAll = document.getElementById("list-products-all");
    listProductAll.innerHTML = "";
    for(let product of listProductRealTime){
        listProductAll.innerHTML += `
            <div>
                <p>Product: ${product.title}</p>
                <p>Description: ${product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Code: $ ${product.code}</p>
                <p>Stock: ${product.stock}</p>
                <p>Category: ${product.category}</p>
                <button id=${product._id} class='btn btn-danger btn-del'>Delete</button>
                <p>----------------------------------</p>
            </div>
        `;
    };

});

btnAddForm.addEventListener('click', addProduct);

document.addEventListener('click', e => {
    e.target.matches('.btn-del') && deleteProduct(e);
});
