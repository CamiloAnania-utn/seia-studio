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

// EDITAR CATEGORÍA
const editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    await categoria.update({ nombre });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR CATEGORÍA (Baja lógica)
const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });

    // Asumimos que tu modelo Categoria tiene el campo 'activo'. 
    await categoria.update({ activo: false });
    res.status(200).json({ message: 'Categoría ocultada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  editarCategoria,
  eliminarCategoria
};