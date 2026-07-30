const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Catalogo = sequelize.define('Catalogo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: "Corte Clásico", "Perfilado"
    unique: true, // Evita que cree dos servicios con el mismo nombre exacto
  },
  precio_actual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Permite "ocultar" servicios viejos sin borrarlos
  }
}, {
  timestamps: true,
  tableName: 'catalogo_servicios'
});

module.exports = Catalogo;