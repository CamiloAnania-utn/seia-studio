const express = require('express');
const cors = require('cors');

const sequelize = require('./src/config/database');

require('./src/models/associations');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const categoriaRoutes = require('./src/routes/categoriaRoutes');
app.use('/api/categorias', categoriaRoutes);
const catalogoRoutes = require('./src/routes/catalogoRoutes');
app.use('/api/catalogo', catalogoRoutes);
const transactionRoutes = require('./src/routes/transactionRoutes');
app.use('/api/transacciones', transactionRoutes);

// Función para arrancar el servidor y validar la base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos PostgreSQL establecida con éxito.');
    
    // Sincronizamos los modelos con la base de datos
    await sequelize.sync({ alter: true }); 
    console.log('📦 Modelos sincronizados correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor SEIA Studio corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error crítico al conectar con la base de datos:', error);
  }
};

startServer();