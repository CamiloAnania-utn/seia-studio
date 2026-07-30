const { Transaction, Catalogo, Categoria } = require('../models/associations');

// Crear un nuevo movimiento de dinero
const crearTransaccion = async (req, res) => {
  try {
    const { concepto, tipo, monto_efectivo, monto_transferencia, catalogo_id, categoria_id } = req.body;

    // 1. Validación básica de presencia
    if (!concepto || !tipo) {
      return res.status(400).json({ error: 'El concepto y el tipo (Ingreso/Egreso) son obligatorios' });
    }

    // 2. Validación estricta de Llaves Foráneas (Para evitar desastres contables)
    if (tipo === 'Ingreso' && !catalogo_id && !concepto) {
      return res.status(400).json({ error: 'Todo Ingreso debe estar asociado a un servicio o una descripción' });
    }
    if (tipo === 'Egreso' && !categoria_id) {
      return res.status(400).json({ error: 'Todo Egreso debe estar clasificado en una Categoría' });
    }

    // 3. Creación del registro con división matemática de caja/banco
    const nuevaTransaccion = await Transaction.create({
      concepto,
      tipo,
      monto_efectivo: monto_efectivo || 0,
      monto_transferencia: monto_transferencia || 0,
      catalogo_id: tipo === 'Ingreso' ? catalogo_id : null,
      categoria_id: tipo === 'Egreso' ? categoria_id : null
    });

    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    console.error('Error crítico al crear transacción:', error);
    res.status(500).json({ error: 'Hubo un error interno al registrar el movimiento' });
  }
};

// Obtener el historial de transacciones
const obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaction.findAll({
      order: [['fecha', 'DESC']], // Ordenamos para que los movimientos recientes salgan primero
      include: [
        { model: Catalogo, attributes: ['nombre'] }, // Traemos el nombre del servicio asociado
        { model: Categoria, attributes: ['nombre'] } // Traemos el nombre de la categoría asociada
      ]
    });
    res.status(200).json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error al leer el historial financiero' });
  }
};

module.exports = {
  crearTransaccion,
  obtenerTransacciones
};