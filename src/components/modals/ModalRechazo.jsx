import React from 'react';

export default function ModalRechazo({ modalRechazo, setModalRechazo, confirmarRechazoAdmin }) {
  if (!modalRechazo.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        <h3 className="text-xl font-bold mb-2 text-white">Motivo de Rechazo</h3>
        <p className="text-stone-400 text-xs mb-4">Por favor, indica el motivo por el cual se rechaza este pedido:</p>
        <textarea 
          rows="3"
          value={modalRechazo.motivo}
          onChange={(e) => setModalRechazo(prev => ({ ...prev, motivo: e.target.value }))}
          placeholder="Ej: Taller saturado en esa fecha / Tela sin stock..."
          className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 text-sm text-white outline-none mb-6 resize-none"
          required
        />
        <div className="flex gap-3">
          <button 
            onClick={() => setModalRechazo({ isOpen: false, pedidoId: null, motivo: '' })}
            className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-bold text-xs hover:bg-stone-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={confirmarRechazoAdmin}
            className="flex-1 bg-red-950 text-red-300 border border-red-900/50 py-3 rounded-xl font-bold text-xs hover:bg-red-900/40 transition-colors"
          >
            Confirmar Rechazo
          </button>
        </div>
      </div>
    </div>
  );
}
