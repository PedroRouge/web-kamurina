import React from 'react';

export default function ModalPago({
  modalPago,
  setModalPago,
  montoPagoInput,
  setMontoPagoInput,
  metodoPagoInput,
  setMetodoPagoInput,
  registrarPagoParcial
}) {
  if (!modalPago.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-2 text-white">Registrar Pago / Adelanto</h3>
        <p className="text-stone-400 text-xs mb-4">Ingresa el monto recibido por parte del cliente:</p>
         
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs text-stone-500 pl-1">Monto ($)</label>
            <input 
              type="number"
              min="1"
              value={montoPagoInput}
              onChange={(e) => setMontoPagoInput(e.target.value)}
              placeholder="Ej: 15000"
              className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 text-sm text-white outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 pl-1">Método de pago / Nota</label>
            <select 
              value={metodoPagoInput}
              onChange={(e) => setMetodoPagoInput(e.target.value)}
              className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 text-sm text-white outline-none"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Mercado Pago">Mercado Pago</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setModalPago({ isOpen: false, pedidoId: null })}
            className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-bold text-xs hover:bg-stone-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={registrarPagoParcial}
            className="flex-1 bg-white text-stone-950 py-3 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
          >
            Aceptar y Sumar
          </button>
        </div>
      </div>
    </div>
  );
}
