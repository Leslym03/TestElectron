const prodForm = document.getElementById('prodForm');

const { remote } = require('electron')
const main = remote.require('./main')

let products = []
let editingStatus = false;
let editProductId = '';

const Prodname = document.getElementById('name');
const Prodprice = document.getElementById('price');
const Proddescripcion = document.getElementById('descripcion');

const productsList = document.getElementById('products')

prodForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    //console.log(Prodname.value)
    //console.log(Prodprice.value)
    //console.log(Proddescripcion.value)

    const newProduct = {
        name: Prodname.value,
        price: Prodprice.value,
        description: Proddescripcion.value
    }

    if (!editingStatus) {
        //crear producto
        const result = await main.createProduct(newProduct)
        console.log(result)
    } else {
        //console.log('editando')
        await main.updateProduct(editProductId, newProduct);
        editingStatus = false;
        editingStatus = '';
    }

    //reinicia formulario
    prodForm.reset();
    Prodname.focus();

    getProducts();
})

async function deleteProduct(id) {
    const response = confirm('Seguro de eliminar?')
    if (response) {
        await main.deleteProduct(id)
        await getProducts();
    }
    return;
}

async function editProduct(id) {
    const product = await main.getProductById(id);
    //console.log(product)
    Prodname.value = product.name;
    Prodprice.value = product.price;
    Proddescripcion.value = product.description;

    editingStatus = true;

    editProductId = product.id;
}

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        productsList.innerHTML += `
            <div class="card card-body my-2 animated fadeInLeft">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')" ">
                        Delete
                    </button>
                    <button class="btn btn-secondary" onclick="editProduct('${product.id}')">
                        Edit
                    </button> 
                </p>
            </div>
        `;
    })
}



const getProducts = async() => {
    products = await main.getProducts();
    //console.log(results)
    renderProducts(products);
}

async function init() {
    await getProducts();
}

init();