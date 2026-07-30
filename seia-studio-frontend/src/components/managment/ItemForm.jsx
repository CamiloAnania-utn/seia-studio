import React, { useState } from 'react';

const ItemForm = ({ type, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Si es servicio, enviamos nombre y precio. Si es categoría, solo el nombre.
    const data = type === 'servicio' 
      ? { nombre, precio_actual: parseFloat(precio) }
      : { nombre };

    await onSubmit(data);
    setLoading(false);
  };

  return (
    <div className="mt-4 p-4 border border-barber-gray/20 rounded-lg bg-barber-dark">
      <h4 className="text-barber-light mb-4 font-medium">
        Agregar nuevo {type === 'servicio' ? 'servicio' : 'gasto'}
      </h4>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder={`Nombre del ${type === 'servicio' ? 'servicio' : 'gasto'}`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-barber-card text-white p-2 rounded border border-barber-gray/50 outline-none focus:border-barber-green"
          required
        />
        
        {type === 'servicio' && (
          <input 
            type="number" 
            placeholder="Precio actual ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="bg-barber-card text-white p-2 rounded border border-barber-gray/50 outline-none focus:border-barber-green"
            required
            min="0"
          />
        )}
        
        <div className="flex gap-2 mt-2">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 p-2 text-barber-gray hover:text-white transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="flex-1 p-2 bg-barber-green text-barber-dark font-bold rounded hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;