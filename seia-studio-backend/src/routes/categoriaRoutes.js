const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Ruta para obtener todas las categorías (GET /api/categorias)
router.get('/', categoriaController.obtenerCategorias);

// Ruta para crear una categoría (POST /api/categorias)
router.post('/', categoriaController.crearCategoria);

// Ruta para editar una categoría (PUT /api/categorias/:id)
router.put('/:id', categoriaController.editarCategoria);

// Ruta para eliminar una categoría (DELETE /api/categorias/:id)
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;