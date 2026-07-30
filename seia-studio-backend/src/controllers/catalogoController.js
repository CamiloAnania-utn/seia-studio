const { Catalogo } = require('../models/associations');

// Crear un nuevo servicio en el catálogo
const crearServicio = async (req, res) => {
  try {
    const { nombre, precio_actual } = req.body;

    // Validación estricta
    if (!nombre || precio_actual === undefined) {
      return res.status(400).json({ error: 'El nombre y el precio actual son obligatorios' });
    }

    const nuevoServicio = await Catalogo.create({
      nombre,
      precio_actual
    });

    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ error: 'Hubo un error en el servidor al crear el servicio' });
  }
};

// Obtener todos los servicios activos
const obtenerServicios = async (req, res) => {
  try {
    // Filtramos para que solo devuelva los servicios que no han sido dados de baja
    const servicios = await Catalogo.findAll({
      where: {
        activo: true
      }
    });
    res.status(200).json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Hubo un error al leer el catálogo' });
  }
};

module.exports = {
  crearServicio,
  obtenerServicios
};