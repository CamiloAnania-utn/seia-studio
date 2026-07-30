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

// EDITAR (Lápiz Naranja): Actualiza nombre y/o precio
const editarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio_actual } = req.body;
    
    const servicio = await Catalogo.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    await servicio.update({ nombre, precio_actual });
    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR (Papelera Roja): Baja lógica
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Catalogo.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    await servicio.update({ activo: false });
    res.status(200).json({ message: 'Servicio eliminado correctamente de la vista' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearServicio,
  obtenerServicios,
  editarServicio,
  eliminarServicio
};