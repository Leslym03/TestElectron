const { BrowserWindow, Notification } = require('electron')
const { getConnection } = require('./database')

async function createProduct(product) {
    try {
        const conn = await getConnection();
        //console.log(product)
        product.price = parseFloat(product.price)
        const result = await conn.query('INSERT INTO product SET ?', product)
            //console.log(result)

        new Notification({
            title: 'Electron Mysql',
            body: 'New product saved seccessfully'
        }).show();

        product.id = result.insertId;
        return product;


    } catch (error) {
        console.log(error);
    }
};

async function getProducts() {
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM product ORDER BY id DESC');
    console.log(results)
    return results;
};


async function deleteProduct(id) {
    const conn = await getConnection();
    const results = await conn.query('DELETE FROM product WHERE id = ?', id);
    console.log(results)
    return results;
}

async function getProductById(id) {
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM product WHERE id = ?', id);
    return results[0];
}

async function updateProduct(id, product) {
    const conn = await getConnection();
    const results = await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);
    console.log(results)
    return results;
}



let window

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            // dentro de la ventana importar modulos de node
            nodeIntegration: true,
            // Funcione remote
            enableRemoteModule: true,
        },
    });
    window.loadFile('src/ui/index.html');
}

module.exports = {
    createProduct,
    createWindow,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
};