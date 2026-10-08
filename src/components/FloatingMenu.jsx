import React from 'react';

const ITEMS = [
  { icon: '👤', label: 'Nuevo Cliente',  action: (nav) => nav('nuevo-cliente') },
  { icon: '📋', label: 'Nuevo Pedido',   action: (nav) => nav('nuevo-pedido') },
  { icon: '🧵', label: 'Nueva Tela',     action: (nav) => nav('nueva-tela') },
  { icon: '🪡', label: 'Nuevo Avío',     action: (nav) => nav('nuevo-avio') },
  { icon: '✂️', label: 'Nuevo Arreglo',  action: (_, onArreglo) => onArreglo() },
];

export default function FloatingMenu({ esAdmin, menuAbierto, setMenuAbierto, cambiarVista, onNuevoArreglo }) {
  if (!esAdmin) return null;

  const handleItem = (item) => {
    item.action(cambiarVista, onNuevoArreglo);
    setMenuAbierto(false);
  };

  return (
    <>
      {/* Backdrop para cerrar */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Items del menú */}
      <div className="fixed bottom-24 right-4 md:right-8 z-50 flex flex-col items-end gap-2.5">
        {ITEMS.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
            style={{
              transition: `opacity 0.18s ease ${i * 0.04}s, transform 0.18s ease ${i * 0.04}s`,
              opacity: menuAbierto ? 1 : 0,
              transform: menuAbierto ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
              pointerEvents: menuAbierto ? 'auto' : 'none',
            }}
          >
            <span className="bg-stone-900/90 border border-stone-700 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap backdrop-blur-sm">
              {item.label}
            </span>
            <button
              onClick={() => handleItem(item)}
              className="w-11 h-11 bg-stone-800 border border-stone-700 rounded-2xl text-lg flex items-center justify-center shadow-lg hover:bg-stone-700 hover:border-stone-500 active:scale-95 transition-all"
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Botón principal */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-white text-stone-950 rounded-full z-50 shadow-2xl flex items-center justify-center hover:bg-stone-100 active:scale-95 transition-all"
        style={{
          transform: menuAbierto ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </>
  );
}
