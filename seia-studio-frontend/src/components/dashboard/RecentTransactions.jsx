import React from 'react';
import { Trash2 } from 'lucide-react'; // Importamos el ícono de la papelera

const RecentTransactions = ({ data = [], onAnular }) => { // Agregamos onAnular a las propiedades
  // Filtro estricto (Slice): Garantizamos que la tabla solo imprima 10 filas como máximo
  const recentData = data.slice(0, 10);

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
                
                // NUEVO: Lógica de Aportes vs Ingresos/Egresos Operativos
                const isAporte = t.es_aporte;
                const isIngreso = t.tipo === 'Ingreso' && !isAporte;
                const isEgreso = t.tipo === 'Egreso';

                // Clases dinámicas para la etiqueta (badge)
                let badgeClass = 'bg-barber-gray/10 text-barber-gray';
                let badgeText = 'APORTE';

                if (isIngreso) {
                  badgeClass = 'bg-barber-green/10 text-barber-green';
                  badgeText = 'INGRESO';
                } else if (isEgreso) {
                  badgeClass = 'bg-red-500/10 text-red-400';
                  badgeText = 'EGRESO';
                }

                // Clases dinámicas para el monto numérico
                let amountClass = 'text-barber-gray font-normal';
                let sign = '+';

                if (isIngreso) {
                  amountClass = 'text-barber-green font-bold';
                } else if (isEgreso) {
                  amountClass = 'text-red-400 font-bold';
                  sign = '-';
                }
                
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
                      {/* Etiqueta visual ajustada */}
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {/* Envolvemos el monto y el botón en un flexbox para alinearlos */}
                      <div className="flex items-center justify-end gap-3">
                        {/* Monto ajustado dinámicamente */}
                        <span className={amountClass}>
                          {sign}${total.toLocaleString('es-AR')}
                        </span>
                        
                        {/* Botón de anular siempre visible y listo para la pantalla táctil */}
                        <button 
                          onClick={() => onAnular(t.id)} 
                          className="text-red-500 p-1 hover:bg-red-500/10 rounded transition-colors"
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