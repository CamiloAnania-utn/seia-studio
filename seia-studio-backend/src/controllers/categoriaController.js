const { Categoria } = require('../models/associations');

// Crear una nueva categoría
const crearCategoria = async (req, res) => {
  try {
    const { nombre, tipo_movimiento } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
    }

    const nuevaCategoria = await Categoria.create({
      nombre,
      tipo_movimiento: tipo_movimiento || 'Egreso' // Por defecto será Egreso
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Hubo un error en el servidor al crear la categoría' });
  }
};

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Hubo un error al leer las categorías' });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias
};