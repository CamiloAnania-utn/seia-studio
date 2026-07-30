import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // <- Agregamos useLocation
import { LayoutDashboard, PlusCircle, Clock, MoreHorizontal } from 'lucide-react';

const BottomBar = () => {
  const location = useLocation(); // Leemos la URL actual de la app

  // Función que devuelve true si la ruta coincide con la URL actual
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden bg-barber-card border-t border-barber-gray/30 p-4 flex justify-around fixed bottom-0 w-full z-50">
      
      <Link to="/dashboard" className="p-2">
        <LayoutDashboard 
          size={24} 
          className={`transition-colors ${isActive('/dashboard') ? 'text-barber-green' : 'text-barber-gray hover:text-white'}`} 
        />
      </Link>
      
      <Link to="/transaction" className="p-2">
        <PlusCircle 
          size={24} 
          className={`transition-colors ${isActive('/transaction') ? 'text-barber-green' : 'text-barber-gray hover:text-white'}`} 
        />
      </Link>
      
      <Link to="/history" className="p-2">
        <Clock 
          size={24} 
          className={`transition-colors ${isActive('/history') ? 'text-barber-green' : 'text-barber-gray hover:text-white'}`} 
        />
      </Link>
      
      <Link to="/catalog" className="p-2">
        <MoreHorizontal 
          size={24} 
          className={`transition-colors ${isActive('/catalog') ? 'text-barber-green' : 'text-barber-gray hover:text-white'}`} 
        />
      </Link>
      
    </nav>
  );
};

export default BottomBar;