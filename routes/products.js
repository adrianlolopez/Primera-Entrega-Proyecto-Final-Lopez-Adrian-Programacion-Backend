const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta POST /api/products
router.post('/', (req, res) => {
    // Leer los productos actuales desde productos.json
    fs.readFile('data/productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }

        // Parsear los productos actuales
        const productos = JSON.parse(data);

        // Obtener los datos del nuevo producto desde el cuerpo de la solicitud
        const newProduct = req.body;

        // Generar un nuevo ID para el producto
        const newProductId = productos.length + 1;

        // Asignar el nuevo ID al producto
        newProduct.id = newProductId;

        // Agregar el nuevo producto al array de productos
        productos.push(newProduct);

        // Escribir los productos actualizados en productos.json
        fs.writeFile('data/productos.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            // Enviar una respuesta de éxito
            res.status(201).send('Producto agregado exitosamente');
        });
    });
});

// Ruta raíz: GET /api/products
router.get('/', (req, res) => {
    // Leer los productos desde productos.json
    fs.readFile('data/productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Parsear los productos y enviarlos como respuesta
        const productos = JSON.parse(data);
        res.json(productos);
    });
});

// Ruta PUT /api/products/:pid
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    // Leer los productos actuales desde productos.json
    fs.readFile('data/productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Parsear los productos actuales
        const productos = JSON.parse(data);

        // Encontrar el producto que coincide con el ID proporcionado
        const productIndex = productos.findIndex(product => product.id == productId);
        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado');
        }

        // Actualizar el producto con los datos proporcionados
        productos[productIndex] = { ...productos[productIndex], ...updatedProduct };

        // Escribir los productos actualizados en productos.json
        fs.writeFile('data/productos.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            // Enviar una respuesta de éxito
            res.send('Producto actualizado exitosamente');
        });
    });
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;

    // Leer los productos actuales desde productos.json
    fs.readFile('data/productos.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Parsear los productos actuales
        let productos = JSON.parse(data);

        // Filtrar los productos para excluir el producto con el ID proporcionado
        productos = productos.filter(product => product.id != productId);

        // Escribir los productos actualizados en productos.json
        fs.writeFile('data/productos.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error interno del servidor');
            }
            // Enviar una respuesta de éxito
            res.send('Producto eliminado exitosamente');
        });
    });
});

module.exports = router;
