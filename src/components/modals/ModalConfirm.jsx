import React from 'react';

export default function ModalConfirm({ modalConfirm, setModalConfirm }) {
  if (!modalConfirm.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-white">Atención</h3>
        <p className="text-stone-400 text-sm mb-8">{modalConfirm.text}</p>
         
        {modalConfirm.buttons ? (
          <div className="flex flex-col gap-3">
            {modalConfirm.buttons.map((btn, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  btn.action();
                  setModalConfirm({ isOpen: false, text: '', action: null, buttons: null });
                }}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${btn.style}`}
              >
                {btn.text}
              </button>
            ))}
            <button 
              onClick={() => setModalConfirm({ isOpen: false, text: '', action: null, buttons: null })} 
              className="w-full mt-2 text-stone-500 hover:text-white text-sm transition-colors py-2"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setModalConfirm({ isOpen: false, text: '', action: null, buttons: null })} 
              className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-bold hover:bg-stone-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                if (modalConfirm.action) modalConfirm.action();
                setModalConfirm({ isOpen: false, text: '', action: null, buttons: null });
              }} 
              className="flex-1 bg-red-950/40 text-red-400 py-3 rounded-xl font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
