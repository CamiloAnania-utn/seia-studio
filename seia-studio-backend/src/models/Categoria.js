const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: "Insumos", "Servicios", "Alquiler"
    unique: true,
  },
  tipo_movimiento: {
    type: DataTypes.ENUM('Ingreso', 'Egreso'),
    allowNull: false,
    defaultValue: 'Egreso' // La inmensa mayoría de las categorías serán para clasificar gastos
  }
}, {
  timestamps: false, // Las categorías son fijas, no necesitamos rastrear cuándo se crearon
  tableName: 'categorias'
});

module.exports = Categoria;