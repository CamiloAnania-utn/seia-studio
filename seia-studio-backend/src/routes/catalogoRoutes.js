const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

// Ruta para obtener todos los servicios activos (GET /api/catalogo)
router.get('/', catalogoController.obtenerServicios);

// Ruta para crear un nuevo servicio (POST /api/catalogo)
router.post('/', catalogoController.crearServicio);

// Ruta para editar un servicio existente (PUT /api/catalogo/:id)
router.put('/:id', catalogoController.editarServicio);

// Ruta para eliminar un servicio, lo cambia a false (DELETE /api/catalogo/:id)
router.delete('/:id', catalogoController.eliminarServicio);

module.exports = router;