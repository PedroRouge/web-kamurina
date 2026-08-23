import React from 'react';

export default function SolicitudesView({
  solicitudesPendientesAdmin,
  setModalRechazo,
  aceptarSolicitud
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Solicitudes de Pedidos Pendientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {solicitudesPendientesAdmin.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No hay nuevas solicitudes de pedidos pendientes de aprobación.</p>
        ) : (
          solicitudesPendientesAdmin.map(p => (
            <div key={p.id} className="bg-stone-900/40 backdrop-blur-md border border-amber-900/50 p-6 rounded-3xl relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500">{p.id}</span>
                  <span className="text-[10px] uppercase px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-900/50">
                    Pendiente de Aprobación
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{p.cliente}</h3>
                <p className="text-stone-300 text-sm mb-2">Prenda: <strong>{p.prenda}</strong></p>
                
                {p.descripcionDetalle && (
                  <div className="bg-stone-950/60 border border-stone-800 p-3 rounded-xl mb-3 text-xs text-stone-300">
                    <strong className="text-stone-400 block mb-1">Detalles (Color, forma, tela):</strong>
                    {p.descripcionDetalle}
                  </div>
                )}

                {(p.fotos?.[0] || p.foto) && <img src={p.fotos?.[0] || p.foto} alt="Pedido" className="w-full h-24 object-cover rounded-xl mb-4 border border-stone-800" />}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-stone-800">
                <button 
                  onClick={() => {
                    setModalRechazo({ isOpen: true, pedidoId: p.id, motivo: '' });
                  }}
                  className="flex-1 bg-red-950/40 text-red-400 border border-red-900/50 py-2.5 rounded-xl text-xs font-bold hover:bg-red-900/40 transition-colors"
                >
                  Rechazar
                </button>
                <button 
                  onClick={() => aceptarSolicitud(p.id)}
                  className="flex-1 bg-white text-stone-950 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
