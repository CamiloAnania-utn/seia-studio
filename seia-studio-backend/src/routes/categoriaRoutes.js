const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Ruta para obtener todas las categorías (GET /api/categorias)
router.get('/', categoriaController.obtenerCategorias);

// Ruta para crear una categoría (POST /api/categorias)
router.post('/', categoriaController.crearCategoria);

module.exports = router;