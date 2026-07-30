import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TransactionForm = ({ services, onSave }) => {
  const [step, setStep] = useState(1); // 1: Servicio, 2: Pago
  const [formData, setFormData] = useState({
    catalogo_id: '',
    monto_efectivo: 0,
    monto_transferencia: 0,
    metodo: '' // Efectivo, Transferencia, Híbrido
  });
  
  // Estado para la notificación flotante (Toast)
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: '' });

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, catalogo_id: service.id, monto_total: service.precio_actual });
    setStep(2);
  };

  // Integramos la lógica de confirmación y el Toast aquí
  const handlePayment = async (metodo) => {
    let finalData = { ...formData, metodo };
    
    if (metodo === 'Efectivo') finalData.monto_efectivo = formData.monto_total;
    if (metodo === 'Transferencia') finalData.monto_transferencia = formData.monto_total;
    // Nota: Si seleccionan 'Híbrido', según tu código actual no se dividen los montos aquí, 
    // pero mantenemos tu estructura intacta para no romper tu lógica principal.
    
    try {
      // Ejecutamos la función del componente padre y esperamos su respuesta
      await onSave(finalData);
      
      // Si todo sale bien, mostramos el Toast de éxito
      setNotificacion({ show: true, mensaje: '¡Venta registrada con éxito!', tipo: 'exito' });
      
      // Temporizador para ocultarlo automáticamente
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 3000);
      
      // Reiniciamos el formulario al paso 1
      setStep(1); 
    } catch (error) {
      // Si el backend rechaza la transacción, mostramos el Toast de error
      setNotificacion({ show: true, mensaje: 'Hubo un error al registrar la venta.', tipo: 'error' });
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: '' }), 4000);
    }
  };

  return (
    <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg relative">
      {step === 1 ? (
        <div className="grid grid-cols-2 gap-4">
          {services.map(s => (
            <button key={s.id} onClick={() => handleServiceSelect(s)} className="p-4 bg-barber-dark rounded-lg hover:border-barber-green border border-transparent transition">
              <span className="block font-bold">{s.nombre}</span>
              <span className="text-barber-green">${s.precio_actual}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button onClick={() => handlePayment('Efectivo')} className="p-4 bg-barber-green text-barber-dark font-bold rounded-lg">Efectivo</button>
          <button onClick={() => handlePayment('Transferencia')} className="p-4 bg-blue-600 text-white font-bold rounded-lg">Transferencia</button>
          <button onClick={() => handlePayment('Híbrido')} className="p-4 bg-barber-gray text-barber-light font-bold rounded-lg">Híbrido</button>
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

export default TransactionForm;