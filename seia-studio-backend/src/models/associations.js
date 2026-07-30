const Transaction = require('./Transaction');
const Catalogo = require('./Catalogo');
const Categoria = require('./Categoria');

// 1. Relación: Transacción y Catálogo (Ingresos)
// Un servicio del catálogo (ej. Corte Clásico) puede tener MUCHAS transacciones en el historial.
Catalogo.hasMany(Transaction, { foreignKey: 'catalogo_id' });
// Pero una transacción específica pertenece a UN SOLO servicio del catálogo.
Transaction.belongsTo(Catalogo, { foreignKey: 'catalogo_id' });

// 2. Relación: Transacción y Categoría (Egresos)
// Una categoría (ej. Insumos) puede agrupar MUCHAS transacciones.
Categoria.hasMany(Transaction, { foreignKey: 'categoria_id' });
// Pero un gasto específico pertenece a UNA SOLA categoría.
Transaction.belongsTo(Categoria, { foreignKey: 'categoria_id' });

// Exportamos los modelos ya vinculados
module.exports = { Transaction, Catalogo, Categoria };