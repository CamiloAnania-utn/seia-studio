const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Ruta para ver el historial (GET /api/transacciones)
router.get('/', transactionController.obtenerTransacciones);

// Ruta para registrar un cobro o pago (POST /api/transacciones)
router.post('/', transactionController.crearTransaccion);

module.exports = router;