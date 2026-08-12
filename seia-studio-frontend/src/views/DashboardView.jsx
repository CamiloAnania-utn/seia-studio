import React, { useState, useEffect } from 'react';
import KPICard from '../components/dashboard/KPICard';
import FinancialChart from '../components/dashboard/FinancialChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { fetchDashboardData, deleteTransaccion } from '../services/api';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

const DashboardView = () => {
  const [dashboardData, setDashboardData] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
    balanceTotal: 0,
    historial: [],
    tendencias: {
      ingresos: { text: "Calculando...", color: "text-barber-gray" },
      egresos: { text: "Calculando...", color: "text-barber-gray" },
      balance: { text: "Calculando...", color: "text-barber-gray" }
    }
  });
  const [loading, setLoading] = useState(true);

  // MODAL Y TOAST
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: '' });
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 3000);
  };

  const cargarDashboard = () => {
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

        let ingresosActual = 0; let egresosActual = 0;
        let ingresosPasado = 0; let egresosPasado = 0;
        let totalIngresosHistorico = 0; let totalEgresosHistorico = 0;

        transacciones.forEach(t => {

          if (t.es_aporte) return; // Ignorar aportes en el cálculo de ingresos/egresos

          const fechaT = new Date(t.createdAt || t.fecha);
          const mesT = fechaT.getMonth();
          const anioT = fechaT.getFullYear();
          const montoTotal = Number(t.monto_efectivo || 0) + Number(t.monto_transferencia || 0);

          if (t.tipo === 'Ingreso') totalIngresosHistorico += montoTotal;
          if (t.tipo === 'Egreso') totalEgresosHistorico += montoTotal;

          if (anioT === anioActual && mesT === mesActual) {
            if (t.tipo === 'Ingreso') ingresosActual += montoTotal;
            if (t.tipo === 'Egreso') egresosActual += montoTotal;
          } 
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

        setDashboardData({
          ingresos: ingresosActual,
          egresos: egresosActual,
          balance: ingresosActual - egresosActual,
          balanceTotal: totalIngresosHistorico - totalEgresosHistorico,
          historial: transacciones,
          tendencias: {
            ingresos: calcularTendencia(ingresosActual, ingresosPasado),
            egresos: calcularTendencia(egresosActual, egresosPasado, true),
            balance: calcularTendencia(ingresosActual - egresosActual, ingresosPasado - egresosPasado)
          }
        });
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar los datos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  // --- LÓGICA DE BORRADO ACTUALIZADA ---
  // 1. Abre el modal visual en lugar del window.confirm
  const handleAnularTransaccion = (id) => {
    setTransactionToDelete(id);
  };

  // 2. Ejecuta la anulación al confirmar en el modal
  const confirmarAnulacion = async () => {
    if (!transactionToDelete) return;
    
    try {
      await deleteTransaccion(transactionToDelete);
      mostrarAlerta("Transacción anulada con éxito");
      cargarDashboard(); 
    } catch (error) {
      mostrarAlerta("Error al anular: " + error.message, "error");
    } finally {
      setTransactionToDelete(null); // Cierra el modal sea éxito o error
    }
  };

  return (
    <div className="relative">
      
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

      {/* MODAL DE CONFIRMACIÓN ELEGANTE */}
      {transactionToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-barber-card border border-barber-gray/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Anular transacción?</h3>
              <p className="text-barber-gray text-sm mb-6">
                Esta acción no se puede deshacer. La ganancia y los gráficos se recalcularán automáticamente.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setTransactionToDelete(null)}
                  className="flex-1 py-3 px-4 bg-transparent border border-barber-gray/30 rounded-xl text-barber-light font-medium hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarAnulacion}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition"
                >
                  Sí, anular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-6 text-barber-light">Dashboard Principal</h2>
      
      {loading ? (
        <div className="text-barber-gray">Cargando datos financieros...</div>
      ) : (
        <>
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
            <KPICard 
              title="Caja Total Acumulada" 
              amount={`$${dashboardData.balanceTotal.toLocaleString('es-AR')}`} 
              trend="Histórico completo" 
              trendColor="text-barber-gray" 
            />
          </div>
          <FinancialChart data={dashboardData.historial.filter(t => !t.es_aporte) || []} />
          
          <RecentTransactions data={dashboardData.historial || []} onAnular={handleAnular} onEdit={handleEditTransaction} />
        </>
      )}
    </div>
  );
};

export default DashboardView;