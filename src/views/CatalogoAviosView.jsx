import React from 'react';

export default function CatalogoAviosView({
  aviosFiltrados,
  busquedaAvios,
  setBusquedaAvios,
  setAvioSeleccionado,
  cambiarVista,
  setModalConfirm,
  borrarAvio,
  actualizarCantidadAvio,
  actualizarPrecioAvio
}) {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Buscar avío por nombre, tipo o precio..." 
        className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none text-sm text-white backdrop-blur-md" 
        value={busquedaAvios}
        onChange={(e) => setBusquedaAvios(e.target.value)} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {aviosFiltrados.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No se encontraron avíos con esa búsqueda.</p>
        ) : (
          aviosFiltrados.map(a => (
            <div key={a.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-3xl overflow-hidden relative">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setModalConfirm({ isOpen: true, text: "¿Estás segura de que quieres eliminar este avío del catálogo?", action: () => borrarAvio(a.id) }); 
                }} 
                className="absolute top-2 right-2 text-white bg-black/50 p-2 rounded-full hover:bg-red-900 z-10 text-xs"
              >
                ✕
              </button>
              {a.foto && <img src={a.foto} alt={a.nombre} className="w-full h-32 object-cover cursor-pointer" onClick={() => { setAvioSeleccionado(a); cambiarVista('detalle-avio'); }} />}
              <div className="p-4">
                <h3 className="font-bold cursor-pointer hover:underline" onClick={() => { setAvioSeleccionado(a); cambiarVista('detalle-avio'); }}>{a.nombre}</h3>
                <p className="text-xs text-stone-400 mb-1">Tipo: {a.tipo || 'N/A'} {a.centimetros ? `- ${a.centimetros} cm` : ''}</p>
                {a.precio > 0 && <p className="text-xs text-emerald-400 font-semibold mb-2">${a.precio.toLocaleString()}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-stone-400">Cant:</span>
                  <input
                    type="text"
                    value={a.cantidad || ''}
                    onChange={(e) => actualizarCantidadAvio(a.id, e.target.value)}
                    className="bg-stone-950 p-1 rounded border border-stone-800 w-16 text-xs text-center focus:border-white outline-none"
                  />
                  <span className="text-xs text-stone-400 ml-1">Precio:</span>
                  <input
                    type="number"
                    min="0"
                    value={a.precio !== undefined ? a.precio : ''}
                    onChange={(e) => actualizarPrecioAvio(a.id, e.target.value)}
                    className="bg-stone-950 p-1 rounded border border-stone-800 w-20 text-xs text-center focus:border-white outline-none text-emerald-400"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
