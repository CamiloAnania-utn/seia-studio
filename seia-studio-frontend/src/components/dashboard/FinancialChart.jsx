import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FinancialChart = ({ data = [] }) => {
  // 1. Ordenamos los datos cronológicamente (del más antiguo al más reciente)
  // Esto soluciona el bug del cursor trabado en Recharts
  const chronologicalData = [...data].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // 2. Agrupamos las transacciones por día para no repetir fechas en el eje X
  const groupedData = chronologicalData.reduce((acc, t) => {
    // Convertimos la fecha al formato corto (Ej: "29 jul")
    const dateStr = new Date(t.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
    
    // Calculamos el monto real de la transacción sumando efectivo y transferencia
    const total = Number(t.monto_efectivo || 0) + Number(t.monto_transferencia || 0);

    // Buscamos si ya creamos un punto para este día en particular
    const existingDay = acc.find(item => item.fecha === dateStr);

    if (existingDay) {
      // Si el día ya existe, le sumamos el dinero a la bolsa correspondiente
      if (t.tipo === 'Ingreso') existingDay.ingresos += total;
      if (t.tipo === 'Egreso') existingDay.gastos += total;
    } else {
      // Si es la primera transacción de ese día, creamos el punto inicial
      acc.push({
        fecha: dateStr,
        ingresos: t.tipo === 'Ingreso' ? total : 0,
        gastos: t.tipo === 'Egreso' ? total : 0
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg mt-8">
      <h3 className="text-barber-light font-semibold mb-6">Tendencia Financiera</h3>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="fecha" stroke="#888" fontSize={12} tickMargin={10} />
            
            {/* Agregamos el formato de moneda al eje Y */}
            <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => `$${value.toLocaleString('es-AR')}`} />
            
            {/* Arreglamos el Tooltip para que muestre los montos con puntuación */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
              itemStyle={{ color: '#F5F5F5' }}
              formatter={(value) => `$${value.toLocaleString('es-AR')}`}
            />
            
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Line type="monotone" dataKey="ingresos" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Ingresos" />
            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Gastos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default FinancialChart;