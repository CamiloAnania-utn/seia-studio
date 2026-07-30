import React, { useState, useEffect } from 'react';
import { fetchCatalogo, fetchCategorias, crearTransaccion } from '../services/api';
import { CheckCircle, AlertCircle } from 'lucide-react'; // <- Importamos los íconos

const TransactionView = () => {
  // --- ESTADOS GENERALES ---
  const [activeTab, setActiveTab] = useState('ingreso'); 
  const [loading, setLoading] = useState(true);

  // --- ESTADO PARA LA NOTIFICACIÓN FLOTANTE (TOAST) ---
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: '' });

  // --- ESTADOS PARA INGRESOS (Cobros Catálogo) ---
  const [step, setStep] = useState(1);
  const [servicios, setServicios] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  
  // --- NUEVOS ESTADOS: COBRO PERSONALIZADO ---
  const [isCustomCharge, setIsCustomCharge] = useState(false);
  const [conceptoCustom, setConceptoCustom] = useState('');
  const [montoCustom, setMontoCustom] = useState('');

  // --- ESTADOS PARA EGRESOS (Gastos) ---
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [conceptoEgreso, setConceptoEgreso] = useState('');
  const [montoTotalEgreso, setMontoTotalEgreso] = useState('');

  // --- ESTADOS COMPARTIDOS (Pagos) ---
  const [metodoPago, setMetodoPago] = useState('');
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [montoTransferencia, setMontoTransferencia] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    Promise.all([fetchCatalogo(), fetchCategorias()])
      .then(([catalogoData, categoriasData]) => {
        setServicios(catalogoData);
        setCategorias(categoriasData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar datos del POS:", err);
        setLoading(false);
      });
  }, []);

  // --- FUNCIONES PARA INGRESOS ---
  const handleServiceSelect = (servicio) => {
    setIsCustomCharge(false);
    setSelectedService(servicio);
    setMontoEfectivo(parseFloat(servicio.precio_actual));
    setMontoTransferencia(0);
    setStep(2);
  };

  const handleCustomChargeInit = () => {
    setIsCustomCharge(true);
    setSelectedService(null);
    setConceptoCustom('');
    setMontoCustom('');
    setMetodoPago('');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
    setStep(2);
  };

  const handleCustomMontoChange = (val) => {
    setMontoCustom(val);
    setMetodoPago('');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
  };

  const handleMetodoSelect = (metodo) => {
    const total = isCustomCharge ? parseFloat(montoCustom || 0) : parseFloat(selectedService.precio_actual);
    
    if (total <= 0) {
      setNotificacion({ show: true, mensaje: "Por favor ingrese un monto válido primero.", tipo: 'error' });
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
      return;
    }

    setMetodoPago(metodo);
    if (metodo === 'Efectivo') {
      setMontoEfectivo(total);
      setMontoTransferencia(0);
    } else if (metodo === 'Transferencia') {
      setMontoEfectivo(0);
      setMontoTransferencia(total);
    } else {
      setMontoEfectivo(total / 2);
      setMontoTransferencia(total / 2);
    }
  };

  // --- FUNCIÓN CENTRAL DE GUARDADO ---
  const handleConfirmar = async () => {
    let payload = {};

    if (activeTab === 'ingreso') {
      // Validaciones previas para cobros
      if (isCustomCharge && (!conceptoCustom || !montoCustom)) {
        setNotificacion({ show: true, mensaje: "Completa la descripción y el monto del cobro.", tipo: 'error' });
        setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
        return;
      }

      const total = isCustomCharge ? parseFloat(montoCustom) : parseFloat(selectedService.precio_actual);
      const sumaMontos = parseFloat(montoEfectivo || 0) + parseFloat(montoTransferencia || 0);
      
      if (sumaMontos !== total) {
        setNotificacion({ show: true, mensaje: `La suma de pagos ($${sumaMontos}) debe ser igual al total ($${total})`, tipo: 'error' });
        setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
        return;
      }

      payload = {
        catalogo_id: isCustomCharge ? null : selectedService.id,
        concepto: isCustomCharge ? conceptoCustom : selectedService.nombre,
        tipo: 'Ingreso',
        monto_efectivo: parseFloat(montoEfectivo || 0),
        monto_transferencia: parseFloat(montoTransferencia || 0),
      };
    } else {
      // Validaciones para egresos
      if (!selectedCategoria || !conceptoEgreso || !montoTotalEgreso || !metodoPago) {
        setNotificacion({ show: true, mensaje: "Por favor completa todos los campos del gasto.", tipo: 'error' });
        setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
        return;
      }

      payload = {
        categoria_id: selectedCategoria,
        concepto: conceptoEgreso,
        tipo: 'Egreso',
        monto_efectivo: metodoPago === 'Efectivo' ? parseFloat(montoTotalEgreso) : 0,
        monto_transferencia: metodoPago === 'Transferencia' ? parseFloat(montoTotalEgreso) : 0,
      };
    }

    try {
      await crearTransaccion(payload);
      
      // ELIMINAMOS EL ALERT() y activamos el Toast elegante
      setNotificacion({ 
        show: true, 
        mensaje: activeTab === 'ingreso' ? "¡Venta registrada con éxito!" : "Gasto registrado correctamente.", 
        tipo: 'exito' 
      });
      
      // Ocultar notificación automáticamente después de 3 segundos
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 3000);
      
      // Resetear todo el POS
      setStep(1);
      setSelectedService(null);
      setIsCustomCharge(false);
      setMetodoPago('');
      setSelectedCategoria('');
      setConceptoEgreso('');
      setMontoTotalEgreso('');
      setConceptoCustom('');
      setMontoCustom('');
      setMontoEfectivo(0);
      setMontoTransferencia(0);
    } catch (error) {
      // ELIMINAMOS EL ALERT() y activamos el Toast de error
      setNotificacion({ show: true, mensaje: "Hubo un problema: " + error.message, tipo: 'error' });
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
    }
  };

  if (loading) return <div className="text-barber-gray p-4">Iniciando sistema POS...</div>;

  return (
    <div className="p-4 lg:p-0 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-barber-light">Caja Registradora</h2>

      {/* INTERRUPTOR DE PESTAÑAS */}
      <div className="flex bg-barber-card p-1 rounded-lg mb-8 border border-barber-gray/20">
        <button
          onClick={() => { setActiveTab('ingreso'); setMetodoPago(''); setStep(1); }}
          className={`flex-1 py-2 rounded-md font-medium transition-all ${
            activeTab === 'ingreso' 
              ? 'bg-barber-green text-barber-dark shadow-sm' 
              : 'text-barber-gray hover:text-white'
          }`}
        >
          Cobrar Ingreso
        </button>
        <button
          onClick={() => { setActiveTab('egreso'); setMetodoPago(''); }}
          className={`flex-1 py-2 rounded-md font-medium transition-all ${
            activeTab === 'egreso' 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'text-barber-gray hover:text-white'
          }`}
        >
          Registrar Gasto
        </button>
      </div>

      {/* ================= VISTA DE INGRESOS ================= */}
      {activeTab === 'ingreso' && (
        <div className="animate-fade-in">
          {step === 1 && (
            <div>
              <p className="text-barber-gray text-sm mb-4">Toque 1: Seleccione el servicio realizado</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {servicios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleServiceSelect(s)}
                    className="p-6 bg-barber-card border border-barber-gray/10 rounded-xl hover:border-barber-green text-center transition group active:scale-95"
                  >
                    <span className="block text-barber-light font-medium group-hover:text-white">{s.nombre}</span>
                    <span className="block text-barber-green font-bold mt-2">${parseFloat(s.precio_actual).toLocaleString()}</span>
                  </button>
                ))}
                
                {/* BOTÓN DE COBRO PERSONALIZADO */}
                <button
                  onClick={handleCustomChargeInit}
                  className="p-6 bg-barber-dark border border-dashed border-barber-green/50 rounded-xl hover:border-barber-green text-center transition group active:scale-95 flex flex-col items-center justify-center"
                >
                  <span className="block text-barber-green font-medium">✨ Monto Libre</span>
                  <span className="block text-barber-gray text-xs mt-2">Venta manual</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (selectedService || isCustomCharge) && (
            <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg animate-fade-in">
              
              {/* CABECERA (Dinámica según si es de catálogo o manual) */}
              {!isCustomCharge ? (
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-barber-gray/10">
                  <h3 className="text-lg font-semibold text-barber-light">{selectedService.nombre}</h3>
                  <p className="text-xl font-bold text-barber-green">${parseFloat(selectedService.precio_actual).toLocaleString()}</p>
                </div>
              ) : (
                <div className="mb-6 pb-4 border-b border-barber-gray/10 flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-barber-light">Cobro Personalizado</h3>
                  
                  <div>
                    <label className="block text-xs text-barber-gray mb-1">Descripción del cobro</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Venta de cera capilar"
                      value={conceptoCustom} 
                      onChange={(e) => setConceptoCustom(e.target.value)} 
                      className="w-full bg-barber-dark text-white p-3 rounded-lg border border-barber-gray/20 focus:border-barber-green outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-barber-gray mb-1">Monto Total ($)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={montoCustom} 
                      onChange={(e) => handleCustomMontoChange(e.target.value)} 
                      className="w-full bg-barber-dark text-white p-3 rounded-lg border border-barber-gray/20 focus:border-barber-green outline-none font-bold" 
                    />
                  </div>
                </div>
              )}

              {/* SELECCIÓN DE MÉTODO DE PAGO */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {['Efectivo', 'Transferencia', 'Híbrido'].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMetodoSelect(m)}
                    className={`p-3 rounded-lg font-medium border transition ${
                      metodoPago === m ? 'bg-barber-green text-barber-dark border-barber-green' : 'bg-barber-dark text-barber-gray border-transparent hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* INPUTS PARA HÍBRIDO */}
              {metodoPago === 'Híbrido' && (
                <div className="bg-barber-dark p-4 rounded-lg flex flex-col gap-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-barber-gray mb-1">Efectivo ($)</label>
                      <input type="number" value={montoEfectivo} onChange={(e) => setMontoEfectivo(e.target.value)} className="w-full bg-barber-card text-white p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs text-barber-gray mb-1">Transferencia ($)</label>
                      <input type="number" value={montoTransferencia} onChange={(e) => setMontoTransferencia(e.target.value)} className="w-full bg-barber-card text-white p-2 rounded" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setStep(1); setIsCustomCharge(false); setMetodoPago(''); }} className="flex-1 p-3 text-barber-gray hover:text-white transition">Volver</button>
                <button onClick={handleConfirmar} disabled={!metodoPago} className="flex-1 p-3 rounded-lg font-bold bg-barber-green text-barber-dark disabled:opacity-50 transition hover:opacity-90">Confirmar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= VISTA DE EGRESOS ================= */}
      {activeTab === 'egreso' && (
        <div className="bg-barber-card p-6 rounded-xl border border-red-500/20 shadow-lg animate-fade-in">
          <div className="flex flex-col gap-5 mb-6">
            
            <div>
              <label className="block text-sm text-barber-gray mb-2">Categoría del Gasto</label>
              <select 
                value={selectedCategoria} 
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="w-full bg-barber-dark text-white p-3 rounded-lg border border-barber-gray/20 outline-none focus:border-red-500"
              >
                <option value="">Seleccione una categoría...</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-barber-gray mb-2">Concepto / Detalle</label>
              <input 
                type="text" 
                placeholder="Ej. Compra de navajas y gel"
                value={conceptoEgreso}
                onChange={(e) => setConceptoEgreso(e.target.value)}
                className="w-full bg-barber-dark text-white p-3 rounded-lg border border-barber-gray/20 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm text-barber-gray mb-2">Monto Total ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={montoTotalEgreso}
                onChange={(e) => setMontoTotalEgreso(e.target.value)}
                className="w-full bg-barber-dark text-white p-3 rounded-lg border border-barber-gray/20 outline-none focus:border-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-sm text-barber-gray mb-2">Método de Pago</label>
              <div className="grid grid-cols-2 gap-3">
                {['Efectivo', 'Transferencia'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetodoPago(m)}
                    className={`p-3 rounded-lg font-medium border transition ${
                      metodoPago === m ? 'bg-red-500 text-white border-red-500' : 'bg-barber-dark text-barber-gray border-transparent hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <button 
            onClick={handleConfirmar} 
            disabled={!metodoPago || !montoTotalEgreso || !conceptoEgreso || !selectedCategoria} 
            className="w-full p-4 rounded-lg font-bold bg-red-500 text-white disabled:opacity-50 hover:bg-red-600 transition"
          >
            Registrar Salida de Dinero
          </button>
        </div>
      )}

      {/* --- NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {notificacion.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl animate-fade-in font-medium transition-all ${
          notificacion.tipo === 'exito' 
            ? 'bg-barber-green text-barber-dark' 
            : 'bg-red-500 text-white'
        }`}>
          {notificacion.tipo === 'exito' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <span>{notificacion.mensaje}</span>
        </div>
      )}

    </div>
  );
};

export default TransactionView;