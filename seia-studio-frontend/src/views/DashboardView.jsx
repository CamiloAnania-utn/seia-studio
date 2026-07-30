import React, { useState, useEffect } from 'react';
import KPICard from '../components/dashboard/KPICard';
import FinancialChart from '../components/dashboard/FinancialChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { fetchDashboardData } from '../services/api';

const DashboardView = () => {
  const [dashboardData, setDashboardData] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
    balanceTotal: 0, // <- Nuevo estado para el acumulado histórico
    historial: [],
    tendencias: {
      ingresos: { text: "Calculando...", color: "text-barber-gray" },
      egresos: { text: "Calculando...", color: "text-barber-gray" },
      balance: { text: "Calculando...", color: "text-barber-gray" }
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then((transacciones) => {
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        let mesPasado = mesActual - 1;
        let anioPasado = anioActual;
        if (mesPasado < 0) {
          mesPasado = 11;
          anioPasado -= 1;
        }

        // Contadores del mes actual y pasado
        let ingresosActual = 0; let egresosActual = 0;
        let ingresosPasado = 0; let egresosPasado = 0;
        
        // Contadores Históricos (Todo el tiempo)
        let totalIngresosHistorico = 0;
        let totalEgresosHistorico = 0;

        transacciones.forEach(t => {
          const fechaT = new Date(t.fecha);
          const mesT = fechaT.getMonth();
          const anioT = fechaT.getFullYear();
          const montoTotal = Number(t.monto_efectivo || 0) + Number(t.monto_transferencia || 0);

          // 1. Suma Histórica Total
          if (t.tipo === 'Ingreso') totalIngresosHistorico += montoTotal;
          if (t.tipo === 'Egreso') totalEgresosHistorico += montoTotal;

          // 2. Suma Mensual (Este mes)
          if (anioT === anioActual && mesT === mesActual) {
            if (t.tipo === 'Ingreso') ingresosActual += montoTotal;
            if (t.tipo === 'Egreso') egresosActual += montoTotal;
          } 
          // 3. Suma Mensual (Mes pasado)
          else if (anioT === anioPasado && mesT === mesPasado) {
            if (t.tipo === 'Ingreso') ingresosPasado += montoTotal;
            if (t.tipo === 'Egreso') egresosPasado += montoTotal;
          }
        });

        const calcularTendencia = (actual, previo, esGasto = false) => {
          if (previo === 0) {
            if (actual === 0) return { text: "0% vs. mes anterior", color: "text-barber-gray" };
            return { text: "+100% vs. mes anterior", color: esGasto ? "text-red-500" : "text-barber-green" };
          }
          
          const diferencia = ((actual - previo) / previo) * 100;
          const esPositivo = diferencia > 0;
          const signo = esPositivo ? "+" : "";
          
          let color = "text-barber-gray";
          if (esPositivo) color = esGasto ? "text-red-500" : "text-barber-green";
          if (!esPositivo && diferencia !== 0) color = esGasto ? "text-barber-green" : "text-red-500";

          return { text: `${signo}${diferencia.toFixed(1)}% vs. mes anterior`, color };
        };

        const balanceActual = ingresosActual - egresosActual;
        const balancePasado = ingresosPasado - egresosPasado;
        const balanceAcumuladoFinal = totalIngresosHistorico - totalEgresosHistorico; // <- La matemática del nuevo KPI

        setDashboardData({
          ingresos: ingresosActual,
          egresos: egresosActual,
          balance: balanceActual,
          balanceTotal: balanceAcumuladoFinal, // <- Lo guardamos para mostrarlo
          historial: transacciones,
          tendencias: {
            ingresos: calcularTendencia(ingresosActual, ingresosPasado),
            egresos: calcularTendencia(egresosActual, egresosPasado, true),
            balance: calcularTendencia(balanceActual, balancePasado)
          }
        });
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar los datos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-barber-light">Dashboard Principal</h2>
      
      {loading ? (
        <div className="text-barber-gray">Cargando datos financieros...</div>
      ) : (
        <>
          {/* Cambiamos la grilla para que soporte 4 tarjetas (lg:grid-cols-4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              title="Ingresos del mes" 
              amount={`$${dashboardData.ingresos.toLocaleString('es-AR')}`} 
              trend={dashboardData.tendencias.ingresos.text} 
              trendColor={dashboardData.tendencias.ingresos.color} 
            />
            <KPICard 
              title="Gastos del mes" 
              amount={`$${dashboardData.egresos.toLocaleString('es-AR')}`} 
              trend={dashboardData.tendencias.egresos.text} 
              trendColor={dashboardData.tendencias.egresos.color} 
            />
            <KPICard 
              title="Ganancia Neta (Mes)" 
              amount={`$${dashboardData.balance.toLocaleString('es-AR')}`} 
              trend={dashboardData.tendencias.balance.text} 
              trendColor={dashboardData.tendencias.balance.color} 
            />
            {/* NUEVA TARJETA: Caja Histórica Total */}
            <KPICard 
              title="Caja Total Acumulada" 
              amount={`$${dashboardData.balanceTotal.toLocaleString('es-AR')}`} 
              trend="Histórico completo" 
              trendColor="text-barber-gray" 
            />
          </div>
          <FinancialChart data={dashboardData.historial || []} />
          <RecentTransactions data={dashboardData.historial || []} />
        </>
      )}
    </div>
  );
};

export default DashboardView;