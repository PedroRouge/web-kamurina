import React from 'react';

export default function FloatingMenu({ esAdmin, menuAbierto, setMenuAbierto, cambiarVista }) {
  if (!esAdmin) return null;

  return (
    <>
      {menuAbierto && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 flex flex-col gap-3">
          <button onClick={() => { cambiarVista('nuevo-cliente'); setMenuAbierto(false); }} className="bg-stone-800 p-4 rounded-xl text-sm border border-stone-700 hover:bg-stone-700 shadow-lg">Nuevo Cliente</button>
          <button onClick={() => { cambiarVista('nuevo-pedido'); setMenuAbierto(false); }} className="bg-stone-800 p-4 rounded-xl text-sm border border-stone-700 hover:bg-stone-700 shadow-lg">Nuevo Pedido</button>
          <button onClick={() => { cambiarVista('nueva-tela'); setMenuAbierto(false); }} className="bg-stone-800 p-4 rounded-xl text-sm border border-stone-700 hover:bg-stone-700 shadow-lg">Nueva Tela</button>
          <button onClick={() => { cambiarVista('nuevo-avio'); setMenuAbierto(false); }} className="bg-stone-800 p-4 rounded-xl text-sm border border-stone-700 hover:bg-stone-700 shadow-lg">Nuevo Avío</button>
        </div>
      )}

      <button 
        onClick={() => setMenuAbierto(!menuAbierto)} 
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-white text-stone-950 rounded-full text-2xl z-50 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        +
      </button>
    </>
  );
}
