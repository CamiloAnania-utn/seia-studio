const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  concepto: {
    type: DataTypes.STRING,
    allowNull: false, // Ej: "Corte Clásico" o "Pago Alquiler"
  },
  tipo: {
    type: DataTypes.ENUM('Ingreso', 'Egreso'),
    allowNull: false, // Vital para saber si suma o resta
  },
  monto_efectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0, // Impacta en la caja física
  },
  monto_transferencia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0, // Impacta en la cuenta bancaria
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Guarda el momento exacto
  }
}, {
  timestamps: true, // Crea columnas createdAt y updatedAt automáticamente
  tableName: 'transacciones'
});

module.exports = Transaction;