import React, { useState, useEffect } from 'react';
import { fetchTransacciones, eliminarTransaccion } from '../services/api'; // Asegúrate de exportar eliminarTransaccion en api.js
import { Search, Filter, Trash2 } from 'lucide-react';

const HistoryView = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos'); // 'Todos' | 'Ingreso' | 'Egreso'

  // NUEVOS ESTADOS: Para borrado masivo
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar transacciones
  const loadData = async () => {
    try {
      const data = await fetchTransacciones();
      const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setTransactions(sortedData);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lógica de filtrado doble
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'Todos' || t.tipo === filterType;
    const matchesSearch = (t.concepto || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // --- LÓGICA DE SELECCIÓN Y BORRADO ---

  const toggleSelection = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      // Selecciona solo los que se están viendo en pantalla actualmente
      setSelectedIds(filteredTransactions.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta transacción?')) return;
    
    setIsDeleting(true);
    try {
      await eliminarTransaccion(id);
      await loadData(); // Recarga la tabla
      setSelectedIds(prev => prev.filter(item => item !== id)); // Quita de seleccionados si estaba
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un problema al eliminar la transacción.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteBulk = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar las ${selectedIds.length} transacciones seleccionadas?`)) return;

    setIsDeleting(true);
    try {
      // Borramos en paralelo para que sea rápido
      await Promise.all(selectedIds.map(id => eliminarTransaccion(id)));
      await loadData(); // Recargamos la tabla con los datos nuevos
      setSelectedIds([]); // Limpiamos la selección
    } catch (error) {
      console.error("Error en borrado masivo:", error);
      alert("Hubo un error borrando algunas transacciones.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="text-barber-gray p-8 text-center">Cargando el libro mayor...</div>;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Historial de Movimientos</h2>
        <p className="text-barber-gray">Auditoría completa de ingresos y egresos del negocio.</p>
      </div>

      {/* BARRA DE HERRAMIENTAS (Búsqueda y Filtros) */}
      <div className="bg-barber-card p-4 rounded-xl border border-barber-gray/20 shadow-lg mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Buscador */}
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-barber-gray" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por concepto o descripción..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIds([]); // Limpiar selección si cambia la búsqueda para evitar errores
            }}
            className="w-full bg-barber-dark text-white pl-10 pr-4 py-3 rounded-lg border border-barber-gray/20 focus:border-barber-green outline-none"
          />
        </div>

        {/* Botones de Filtro */}
        <div className="flex bg-barber-dark p-1 rounded-lg border border-barber-gray/20 w-full md:w-auto">
          {['Todos', 'Ingreso', 'Egreso'].map(type => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setSelectedIds([]); // Limpiar selección al cambiar de filtro
              }}
              className={`flex-1 md:px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                filterType === type 
                  ? (type === 'Ingreso' ? 'bg-barber-green text-barber-dark' : type === 'Egreso' ? 'bg-red-500 text-white' : 'bg-barber-light text-barber-dark')
                  : 'text-barber-gray hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* NUEVO: ENCABEZADO DE ACCIONES MASIVAS */}
      <div className="flex justify-between items-center mb-3 h-10">
        <span className="text-sm text-barber-gray">
          Mostrando {filteredTransactions.length} registro(s)
        </span>
        
        {selectedIds.length > 0 && (
          <button
            onClick={handleDeleteBulk}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all animate-fade-in text-sm font-bold"
          >
            <Trash2 size={16} />
            <span>Eliminar {selectedIds.length} seleccionados</span>
          </button>
        )}
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-barber-card rounded-xl border border-barber-gray/20 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-barber-dark border-b border-barber-gray/20 text-barber-gray text-sm">
                {/* Cabecera Checkbox */}
                <th className="py-4 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="accent-barber-green w-4 h-4 cursor-pointer"
                    onChange={toggleSelectAll}
                    checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                  />
                </th>
                <th className="py-4 px-6 font-medium whitespace-nowrap">Fecha y Hora</th>
                <th className="py-4 px-6 font-medium whitespace-nowrap">Concepto</th>
                <th className="py-4 px-6 font-medium whitespace-nowrap">Tipo</th>
                <th className="py-4 px-6 font-medium whitespace-nowrap">Método</th>
                <th className="py-4 px-6 font-medium text-right whitespace-nowrap">Monto</th>
                {/* Cabecera Acciones */}
                <th className="py-4 px-6 font-medium text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => {
                  const total = Number(t.monto_efectivo || 0) + Number(t.monto_transferencia || 0);
                  
                  const isAporte = t.es_aporte;
                  const isIngreso = t.tipo === 'Ingreso' && !isAporte;
                  const isEgreso = t.tipo === 'Egreso';

                  let badgeClass = 'bg-barber-gray/10 text-barber-gray';
                  let badgeText = 'APORTE';

                  if (isIngreso) {
                    badgeClass = 'bg-barber-green/10 text-barber-green';
                    badgeText = 'INGRESO';
                  } else if (isEgreso) {
                    badgeClass = 'bg-red-500/10 text-red-400';
                    badgeText = 'EGRESO';
                  }

                  let amountClass = 'text-barber-gray font-normal';
                  let sign = '+';

                  if (isIngreso) {
                    amountClass = 'text-barber-green font-bold';
                  } else if (isEgreso) {
                    amountClass = 'text-red-400 font-bold';
                    sign = '-';
                  }
                  
                  let metodo = 'Mixto';
                  if (t.monto_efectivo > 0 && t.monto_transferencia == 0) metodo = 'Efectivo';
                  if (t.monto_efectivo == 0 && t.monto_transferencia > 0) metodo = 'Transferencia';

                  return (
                    // Fila iluminada si está seleccionada
                    <tr key={t.id} className={`border-b border-barber-gray/10 hover:bg-barber-dark/50 transition-colors ${selectedIds.includes(t.id) ? 'bg-barber-green/5' : ''}`}>
                      
                      {/* Checkbox individual */}
                      <td className="py-4 px-4 text-center">
                        <input 
                          type="checkbox" 
                          className="accent-barber-green w-4 h-4 cursor-pointer"
                          checked={selectedIds.includes(t.id)}
                          onChange={() => toggleSelection(t.id)}
                        />
                      </td>

                      <td className="py-4 px-6 text-barber-light whitespace-nowrap">
                        {new Date(t.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6 text-white font-medium min-w-[200px]">
                        {t.concepto || 'Transacción sin detalle'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-barber-gray">
                        {metodo}
                      </td>
                      <td className={`py-4 px-6 text-right whitespace-nowrap ${amountClass}`}>
                        {sign}${total.toLocaleString('es-AR')}
                      </td>

                      {/* Tachito de borrado */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteSingle(t.id)}
                          disabled={isDeleting}
                          className="p-2 text-barber-gray hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar transacción"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-barber-gray">
                      <Filter size={48} className="mb-4 opacity-20" />
                      <p>No se encontraron transacciones que coincidan con tu búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default HistoryView;