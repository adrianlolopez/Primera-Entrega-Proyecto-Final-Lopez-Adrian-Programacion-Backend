const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;

    // Leer los carritos desde carrito.json
    fs.readFile('data/carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Parsear los carritos
        const carts = JSON.parse(data);

        // Buscar el carrito con el ID proporcionado
        const cart = carts.find(cart => cart.id == cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Enviar los productos del carrito como respuesta
        res.json(cart.products);
    });
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    // Leer los carritos desde carrito.json
    fs.readFile('data/carrito.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Parsear los carritos
        let carts = JSON.parse(data);

        // Encontrar el carrito con el ID proporcionado
        const cartIndex = carts.findIndex(cart => cart.id == cartId);
        if (cartIndex === -1) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Agregar el producto al carrito
        carts[cartIndex].products.push({ product: productId, quantity: 1 });

        // Escribir los carritos actualizados en carrito.json
        fs.writeFile('data/carrito.json', JSON.stringify(carts, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            // Enviar una respuesta de éxito
            res.send('Producto agregado al carrito exitosamente');
        });
    });
});

module.exports = router;
