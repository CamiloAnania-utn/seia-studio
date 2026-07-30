import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';

// Vistas (Páginas)
import DashboardView from './views/DashboardView'; // Crearemos esto en el siguiente paso
import CatalogManager from './components/managment/CatalogManager';
import TransactionView from './views/TransactionView';
import HistoryView from './views/HistoryView';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Si entran a la raíz, los redirigimos al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Aquí definimos qué componente se carga en cada URL */}
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/catalog" element={<CatalogManager />} />    
          <Route path="/transaction" element={<TransactionView />} />
          <Route path="/history" element={<HistoryView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;