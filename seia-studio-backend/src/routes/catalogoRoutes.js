const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');

// Ruta para obtener todos los servicios activos (GET /api/catalogo)
router.get('/', catalogoController.obtenerServicios);

// Ruta para crear un nuevo servicio (POST /api/catalogo)
router.post('/', catalogoController.crearServicio);

module.exports = router;