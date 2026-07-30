const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializamos Sequelize con la URL de nuestra variable de entorno
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Configuración estricta y necesaria para Neon.tech
    }
  },
  logging: false // Apagamos los logs de SQL para mantener la consola limpia
});

module.exports = sequelize;