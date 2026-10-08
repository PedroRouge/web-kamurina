import React, { useState } from 'react';

function StockInput({ id, initialValue, onSave }) {
  const [value, setValue] = useState(initialValue ?? '');
  const [guardando, setGuardando] = useState(false);

  const handleBlur = async () => {
    if (String(value) === String(initialValue)) return;
    setGuardando(true);
    await onSave(id, value);
    setGuardando(false);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-stone-400">Stock:</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className={`bg-stone-950 p-1 rounded border w-20 text-xs text-center outline-none transition-colors ${
          guardando ? 'border-emerald-700 text-emerald-400' : 'border-stone-800 focus:border-stone-500'
        }`}
      />
    </div>
  );
}

export default function CatalogoTelasView({
  telasFiltradas,
  busquedaTelas,
  setBusquedaTelas,
  setTelaSeleccionada,
  cambiarVista,
  setModalConfirm,
  borrarTela,
  actualizarStock
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar tela por nombre, descripción, uso o precio..."
        className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none text-sm text-white backdrop-blur-md"
        value={busquedaTelas}
        onChange={(e) => setBusquedaTelas(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {telasFiltradas.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No se encontraron telas con esa búsqueda.</p>
        ) : (
          telasFiltradas.map(t => (
            <div key={t.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-3xl overflow-hidden relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalConfirm({ isOpen: true, text: '¿Estás segura de que quieres eliminar esta tela del catálogo?', action: () => borrarTela(t.id) });
                }}
                className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-red-900 z-10 text-xs"
              >
                ✕
              </button>
              {t.foto && (
                <img
                  src={t.foto}
                  alt={t.nombre}
                  className="w-full h-32 object-cover cursor-pointer"
                  onClick={() => { setTelaSeleccionada(t); cambiarVista('detalle-tela'); }}
                />
              )}
              <div className="p-4">
                <h3
                  className="font-bold cursor-pointer hover:underline"
                  onClick={() => { setTelaSeleccionada(t); cambiarVista('detalle-tela'); }}
                >
                  {t.nombre}
                </h3>
                <p className="text-xs text-stone-400">{t.descripcion} - {t.uso}</p>
                {t.precio > 0 && <p className="text-xs text-emerald-400 font-semibold mt-1">${t.precio.toLocaleString()} / m</p>}
                <StockInput id={t.id} initialValue={t.stock} onSave={actualizarStock} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
