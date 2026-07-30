import React, { useState, useEffect } from 'react';

const ItemForm = ({ type, onSubmit, onCancel, initialData }) => {
  const [nombre, setNombre] = useState('');
  const [precio_actual, setPrecioActual] = useState('');

  // Efecto que detecta si estamos editando para autocompletar los campos
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      if (type === 'servicio') {
        setPrecioActual(initialData.precio_actual);
      }
    } else {
      setNombre('');
      setPrecioActual('');
    }
  }, [initialData, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'servicio') {
      onSubmit({ nombre, precio_actual: parseFloat(precio_actual) });
    } else {
      onSubmit({ nombre });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-barber-dark p-4 rounded-lg border border-barber-gray/20">
      <h4 className="text-white font-medium mb-4">
        {initialData ? `Editar ${type}` : `Nuevo ${type}`}
      </h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-barber-gray text-sm mb-1">Nombre</label>
          <input 
            type="text" 
            required 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-barber-card text-white p-2 rounded border border-barber-gray/20 outline-none focus:border-barber-green"
            placeholder={type === 'servicio' ? 'Ej: Corte Clásico' : 'Ej: Insumos'}
          />
        </div>
        
        {type === 'servicio' && (
          <div>
            <label className="block text-barber-gray text-sm mb-1">Precio Actual ($)</label>
            <input 
              type="number" 
              required 
              min="0"
              value={precio_actual}
              onChange={(e) => setPrecioActual(e.target.value)}
              className="w-full bg-barber-card text-white p-2 rounded border border-barber-gray/20 outline-none focus:border-barber-green"
              placeholder="15000"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 p-2 text-barber-gray hover:text-white transition"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className={`flex-1 p-2 text-barber-dark font-bold rounded transition ${type === 'servicio' ? 'bg-barber-green hover:bg-barber-green/90' : 'bg-barber-red hover:bg-barber-red/90'}`}
        >
          {initialData ? 'Guardar Cambios' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;