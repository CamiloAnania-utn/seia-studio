import React from 'react';
import { Trash2 } from 'lucide-react'; // Importamos el ícono de la papelera

const RecentTransactions = ({ data = [], onAnular }) => { // Agregamos onAnular a las propiedades
  // Filtro estricto (Slice): Garantizamos que la tabla solo imprima 5 filas como máximo
  const recentData = data.slice(0, 5);

  return (
    <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg mt-8 overflow-hidden">
      <h3 className="text-barber-light font-semibold mb-4">Últimos Movimientos</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-barber-gray/20 text-barber-gray text-sm">
              <th className="py-3 px-4 font-medium whitespace-nowrap">Fecha</th>
              <th className="py-3 px-4 font-medium whitespace-nowrap">Concepto</th>
              <th className="py-3 px-4 font-medium whitespace-nowrap">Tipo</th>
              <th className="py-3 px-4 font-medium text-right whitespace-nowrap">Monto</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentData.length > 0 ? (
              recentData.map((t) => {
                // Lógica del Monto: Suma automáticamente el valor de efectivo y transferencia para el pago "Híbrido"
                const total = Number(t.monto_efectivo || 0) + Number(t.monto_transferencia || 0);
                
                // Determinamos si es Ingreso o Egreso basándonos en la columna 'tipo'
                const isIngreso = t.tipo === 'Ingreso';
                
                return (
                  // Agregamos la clase "group" al tr para detectar el hover
                  <tr key={t.id} className="group border-b border-barber-gray/10 hover:bg-barber-dark/50 transition-colors">
                    <td className="py-3 px-4 text-barber-light whitespace-nowrap">
                      {new Date(t.createdAt || t.fecha).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-white font-medium min-w-[150px]">
                      {t.concepto || 'Transacción'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        isIngreso 
                          ? 'bg-barber-green/10 text-barber-green' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {/* Envolvemos el monto y el botón en un flexbox para alinearlos */}
                      <div className="flex items-center justify-end gap-3">
                        <span className={`font-bold ${isIngreso ? 'text-barber-green' : 'text-red-400'}`}>
                          {isIngreso ? '+' : '-'}${total.toLocaleString('es-AR')}
                        </span>
                        
                        {/* Botón de anular oculto hasta hacer hover en la fila */}
                        <button 
                          onClick={() => onAnular(t.id)} 
                          className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                          title="Anular transacción"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-barber-gray">
                  No hay transacciones registradas aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;