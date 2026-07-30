import React, { useState, useEffect } from 'react';
import { 
  fetchCatalogo, fetchCategorias, 
  createCatalogoItem, createCategoria,
  updateCatalogoItem, deleteCatalogoItem,
  updateCategoria, deleteCategoria
} from '../../services/api';
import ItemForm from './ItemForm';
import { Pencil, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const CatalogManager = () => {
  const [activeTab, setActiveTab] = useState('servicios');
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Estado para la notificación flotante (Toast)
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: '' });

  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => {
      setNotificacion({ show: false, mensaje: '', tipo: '' });
    }, 3000);
  };

  const loadData = () => {
    fetchCatalogo().then(setServicios).catch(console.error);
    fetchCategorias().then(setCategorias).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- LÓGICA DE SERVICIOS ---
  const handleSaveService = async (data) => {
    try {
      if (editingService) {
        await updateCatalogoItem(editingService.id, data);
        mostrarAlerta("¡Servicio actualizado con éxito!");
      } else {
        await createCatalogoItem(data);
        mostrarAlerta("¡Servicio creado con éxito!");
      }
      setShowServiceForm(false);
      setEditingService(null);
      loadData(); 
    } catch (error) {
      mostrarAlerta("Hubo un problema: " + error.message, "error");
    }
  };

  // --- ELIMINAR SERVICIO ---
  const handleDeleteService = async (id) => {
    try {
      await deleteCatalogoItem(id);
      mostrarAlerta("Servicio eliminado correctamente");
      loadData();
    } catch (error) {
      mostrarAlerta("Error al eliminar el servicio", "error");
    }
  };

  const openEditService = (servicio) => {
    setEditingService(servicio);
    setShowServiceForm(true);
  };

  // --- LÓGICA DE CATEGORÍAS ---
  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await updateCategoria(editingCategory.id, data);
        mostrarAlerta("¡Categoría actualizada con éxito!");
      } else {
        await createCategoria(data);
        mostrarAlerta("¡Categoría creada con éxito!");
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      mostrarAlerta("Hubo un problema: " + error.message, "error");
    }
  };

  // --- ELIMINAR CATEGORÍA ---
  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategoria(id);
      mostrarAlerta("Categoría ocultada correctamente");
      loadData();
    } catch (error) {
      mostrarAlerta("Error al eliminar la categoría", "error");
    }
  };

  const openEditCategory = (categoria) => {
    setEditingCategory(categoria);
    setShowCategoryForm(true);
  };

  return (
    <div className="p-4 lg:p-0 relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-bounce ${
          notificacion.tipo === 'error' 
            ? 'bg-red-500/10 border-red-500 text-red-400' 
            : 'bg-barber-green/10 border-barber-green text-barber-green'
        }`}>
          {notificacion.tipo === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="text-sm font-medium">{notificacion.mensaje}</span>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-6 text-barber-light">Gestión de Inventario</h2>
      
      {/* Pestañas */}
      <div className="flex gap-4 mb-6 border-b border-barber-gray/20 pb-2">
        <button 
          onClick={() => { setActiveTab('servicios'); setShowServiceForm(false); setShowCategoryForm(false); }}
          className={`pb-2 font-medium transition-colors ${activeTab === 'servicios' ? 'text-barber-green border-b-2 border-barber-green' : 'text-barber-gray hover:text-barber-light'}`}
        >
          Servicios (Ingresos)
        </button>
        <button 
          onClick={() => { setActiveTab('categorias'); setShowServiceForm(false); setShowCategoryForm(false); }}
          className={`pb-2 font-medium transition-colors ${activeTab === 'categorias' ? 'text-barber-red border-b-2 border-barber-red' : 'text-barber-gray hover:text-barber-light'}`}
        >
          Categorías (Gastos)
        </button>
      </div>

      <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg">
        
        {/* ================= VISTA DE SERVICIOS ================= */}
        {activeTab === 'servicios' && (
          <div>
            <h3 className="text-barber-light font-semibold mb-4">Servicios Actuales</h3>
            <ul className="divide-y divide-barber-gray/20 mb-4">
              {servicios.map(s => (
                <li key={s.id} className="py-3 flex justify-between items-center group">
                  <div className="flex items-center gap-4 text-barber-light">
                    <span>{s.nombre}</span>
                    <span className="text-barber-green font-bold">${parseFloat(s.precio_actual).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditService(s)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded transition-colors" title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
              {servicios.length === 0 && <p className="text-barber-gray text-sm py-2">No hay servicios registrados.</p>}
            </ul>
            
            {!showServiceForm ? (
              <button 
                onClick={() => { setEditingService(null); setShowServiceForm(true); }}
                className="w-full p-3 border border-barber-green text-barber-green rounded-lg hover:bg-barber-green/10 transition"
              >
                + Agregar Nuevo Servicio
              </button>
            ) : (
              <ItemForm 
                type="servicio" 
                initialData={editingService}
                onSubmit={handleSaveService} 
                onCancel={() => { setShowServiceForm(false); setEditingService(null); }} 
              />
            )}
          </div>
        )}

        {/* ================= VISTA DE CATEGORÍAS ================= */}
        {activeTab === 'categorias' && (
          <div>
            <h3 className="text-barber-light font-semibold mb-4">Categorías de Gastos</h3>
            <ul className="divide-y divide-barber-gray/20 mb-4">
              {categorias.map(c => (
                <li key={c.id} className="py-3 flex justify-between items-center group">
                  <span className="text-barber-light">{c.nombre}</span>
                  
                  <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditCategory(c)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded transition-colors" title="Editar">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
              {categorias.length === 0 && <p className="text-barber-gray text-sm py-2">No hay categorías registradas.</p>}
            </ul>
            
            {!showCategoryForm ? (
              <button 
                onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                className="w-full p-3 border border-barber-red text-barber-red rounded-lg hover:bg-barber-red/10 transition"
              >
                + Agregar Nueva Categoría
              </button>
            ) : (
              <ItemForm 
                type="categoria" 
                initialData={editingCategory}
                onSubmit={handleSaveCategory} 
                onCancel={() => { setShowCategoryForm(false); setEditingCategory(null); }} 
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CatalogManager;