import React, { useState, useEffect } from 'react';
import { fetchCatalogo, fetchCategorias, createCatalogoItem, createCategoria } from '../../services/api';
import ItemForm from './ItemForm';

const CatalogManager = () => {
  const [activeTab, setActiveTab] = useState('servicios');
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados para controlar si se muestra el formulario
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Función para recargar las listas desde el backend
  const loadData = () => {
    fetchCatalogo().then(setServicios).catch(console.error);
    fetchCategorias().then(setCategorias).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveService = async (data) => {
    try {
      await createCatalogoItem(data);
      setShowServiceForm(false);
      loadData(); // Recargamos la lista para ver el nuevo item
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      await createCategoria(data);
      setShowCategoryForm(false);
      loadData();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="p-4 lg:p-0">
      <h2 className="text-xl font-semibold mb-6 text-barber-light">Gestión de Inventario</h2>
      
      {/* Pestañas (Sin cambios) */}
      <div className="flex gap-4 mb-6 border-b border-barber-gray/20 pb-2">
        <button 
          onClick={() => setActiveTab('servicios')}
          className={`pb-2 font-medium ${activeTab === 'servicios' ? 'text-barber-green border-b-2 border-barber-green' : 'text-barber-gray hover:text-barber-light'}`}
        >
          Servicios (Ingresos)
        </button>
        <button 
          onClick={() => setActiveTab('categorias')}
          className={`pb-2 font-medium ${activeTab === 'categorias' ? 'text-barber-red border-b-2 border-barber-red' : 'text-barber-gray hover:text-barber-light'}`}
        >
          Categorías (Gastos)
        </button>
      </div>

      <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg">
        
        {/* Vista de Servicios */}
        {activeTab === 'servicios' && (
          <div>
            <h3 className="text-barber-light font-semibold mb-4">Servicios Actuales</h3>
            <ul className="divide-y divide-barber-gray/20 mb-4">
              {servicios.map(s => (
                <li key={s.id} className="py-3 flex justify-between items-center text-barber-light">
                  <span>{s.nombre}</span>
                  <span className="text-barber-green font-bold">${parseFloat(s.precio_actual).toLocaleString()}</span>
                </li>
              ))}
              {servicios.length === 0 && <p className="text-barber-gray text-sm py-2">No hay servicios registrados.</p>}
            </ul>
            
            {!showServiceForm ? (
              <button 
                onClick={() => setShowServiceForm(true)}
                className="w-full p-3 border border-barber-green text-barber-green rounded-lg hover:bg-barber-green/10 transition"
              >
                + Agregar Nuevo Servicio
              </button>
            ) : (
              <ItemForm 
                type="servicio" 
                onSubmit={handleSaveService} 
                onCancel={() => setShowServiceForm(false)} 
              />
            )}
          </div>
        )}

        {/* Vista de Categorías */}
        {activeTab === 'categorias' && (
          <div>
            <h3 className="text-barber-light font-semibold mb-4">Categorías de Gastos</h3>
            <ul className="divide-y divide-barber-gray/20 mb-4">
              {categorias.map(c => (
                <li key={c.id} className="py-3 text-barber-light">
                  {c.nombre}
                </li>
              ))}
              {categorias.length === 0 && <p className="text-barber-gray text-sm py-2">No hay categorías registradas.</p>}
            </ul>
            
            {!showCategoryForm ? (
              <button 
                onClick={() => setShowCategoryForm(true)}
                className="w-full p-3 border border-barber-red text-barber-red rounded-lg hover:bg-barber-red/10 transition"
              >
                + Agregar Nueva Categoría
              </button>
            ) : (
              <ItemForm 
                type="categoria" 
                onSubmit={handleSaveCategory} 
                onCancel={() => setShowCategoryForm(false)} 
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CatalogManager;