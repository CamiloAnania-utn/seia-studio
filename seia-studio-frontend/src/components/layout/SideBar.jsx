import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <- Importación clave
import { LayoutDashboard, PlusCircle, Clock, MoreHorizontal, Scissors } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); // Leemos la URL actual de la aplicación

  // Función que devuelve true si la ruta coincide con la URL actual
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-barber-card min-h-screen border-r border-barber-gray/30 p-6 fixed left-0 top-0">
      
      {/* Logo o Nombre de la Barbería */}
      <div className="flex items-center gap-3 mb-10 pb-4 border-b border-barber-gray/10">
        <Scissors className="text-barber-green" size={28} />
        <h1 className="text-xl font-bold text-white tracking-wider">SEIA STUDIO</h1>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex flex-col gap-2 flex-1">
        
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-4 p-3 rounded-lg font-medium transition-colors ${
            isActive('/dashboard') 
              ? 'bg-barber-green/10 text-barber-green font-semibold' 
              : 'text-barber-gray hover:bg-barber-dark hover:text-white'
          }`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/transaction" 
          className={`flex items-center gap-4 p-3 rounded-lg font-medium transition-colors ${
            isActive('/transaction') 
              ? 'bg-barber-green/10 text-barber-green font-semibold' 
              : 'text-barber-gray hover:bg-barber-dark hover:text-white'
          }`}
        >
          <PlusCircle size={20} />
          <span>Nueva Transacción</span>
        </Link>
        
        <Link 
          to="/history" 
          className={`flex items-center gap-4 p-3 rounded-lg font-medium transition-colors ${
            isActive('/history') 
              ? 'bg-barber-green/10 text-barber-green font-semibold' 
              : 'text-barber-gray hover:bg-barber-dark hover:text-white'
          }`}
        >
          <Clock size={20} />
          <span>Historial</span>
        </Link>
        
        <Link 
          to="/catalog" 
          className={`flex items-center gap-4 p-3 rounded-lg font-medium transition-colors ${
            isActive('/catalog') 
              ? 'bg-barber-green/10 text-barber-green font-semibold' 
              : 'text-barber-gray hover:bg-barber-dark hover:text-white'
          }`}
        >
          <MoreHorizontal size={20} />
          <span>Gestión Catálogo</span>
        </Link>
        
      </nav>

      {/* Pie de la barra lateral (Opcional) */}
      <div className="text-xs text-barber-gray text-center pt-4 border-t border-barber-gray/10">
        v1.0.0 Pro - Full Stack - por Camilo Ananía
      </div>

    </aside>
  );
};

export default Sidebar;