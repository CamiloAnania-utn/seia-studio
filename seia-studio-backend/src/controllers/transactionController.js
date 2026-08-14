const { Transaction, Catalogo, Categoria } = require('../models/associations');

// Crear un nuevo movimiento de dinero
const crearTransaccion = async (req, res) => {
  try {
    // AÑADIDO: Extraemos 'es_aporte' del req.body junto con el resto de datos
    const { concepto, tipo, monto_efectivo, monto_transferencia, catalogo_id, categoria_id, fecha, es_aporte } = req.body;

    // Parsear fecha en zona horaria local, no UTC
    // Cuando recibimos "2026-08-14", lo convertimos a fecha local, no a UTC
    let fechaTransaccion;
    if (fecha) {
      const [year, month, day] = fecha.split('-').map(Number);
      const ahora = new Date();
      // Usar el día elegido pero con la hora actual
      fechaTransaccion = new Date(year, month - 1, day, ahora.getHours(), ahora.getMinutes(), ahora.getSeconds());
      
      // Validación: No permitir fechas en el futuro
      const hoy = new Date();
      const hoyAlFinal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
      if (fechaTransaccion > hoyAlFinal) {
        return res.status(400).json({ error: 'No se pueden registrar transacciones de días futuros' });
      }
    } else {
      fechaTransaccion = new Date();
    }

    // 1. Validación básica de presencia
    if (!concepto || !tipo) {
      return res.status(400).json({ error: 'El concepto y el tipo (Ingreso/Egreso) son obligatorios' });
    }
    
    // 2. Validación adicional: Asegurar que la fecha no sea futura (por si acaso)
    const hoy = new Date();
    const hoyAlFinal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
    if (fechaTransaccion > hoyAlFinal) {
      return res.status(400).json({ error: 'No se pueden registrar transacciones de días futuros' });
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
      monto_efectivo,
      monto_transferencia,
      catalogo_id: tipo === 'Ingreso' ? catalogo_id : null,
      categoria_id: tipo === 'Egreso' ? categoria_id : null,
      fecha: fechaTransaccion,
      // AÑADIDO: Le decimos al ORM que guarde la bandera de aporte
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