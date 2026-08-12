const { Transaction, Catalogo, Categoria } = require('../models/associations');

// Crear un nuevo movimiento de dinero
const crearTransaccion = async (req, res) => {
  try {
    // 1. Extraemos 'es_aporte' y 'fecha' del req.body junto con el resto
    const { concepto, tipo, monto_efectivo, monto_transferencia, catalogo_id, categoria_id, fecha, es_aporte } = req.body;

    // 2. Lógica inteligente de fecha: Si el frontend manda una fecha (cortes atrasados), la usamos. Si no, usamos la de hoy.
    const fechaTransaccion = fecha ? new Date(fecha) : new Date();

    // 3. Validación básica de presencia
    if (!concepto || !tipo) {
      return res.status(400).json({ error: 'El concepto y el tipo (Ingreso/Egreso) son obligatorios' });
    }

    // 4. Validación estricta de Llaves Foráneas
    if (tipo === 'Ingreso' && !catalogo_id && !concepto) {
      return res.status(400).json({ error: 'Todo Ingreso debe estar asociado a un servicio o una descripción' });
    }
    if (tipo === 'Egreso' && !categoria_id) {
      return res.status(400).json({ error: 'Todo Egreso debe estar clasificado en una Categoría' });
    }

    // 5. Creación del registro
    const nuevaTransaccion = await Transaction.create({
      concepto,
      tipo,
      monto_efectivo: monto_efectivo || 0,
      monto_transferencia: monto_transferencia || 0,
      catalogo_id: tipo === 'Ingreso' ? catalogo_id : null,
      categoria_id: tipo === 'Egreso' ? categoria_id : null,
      fecha: fechaTransaccion,
      // Guardamos la bandera de aporte
      es_aporte: es_aporte || false
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

// ELIMINAR TRANSACCIÓN (Borrado Físico)
const eliminarTransaccion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscamos la transacción por su ID
    const transaccion = await Transaction.findByPk(id);
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

    // Destruimos físicamente el registro porque fue un error humano
    await transaccion.destroy();
    
    res.status(200).json({ message: 'Transacción anulada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  crearTransaccion,
  obtenerTransacciones,
  eliminarTransaccion
};