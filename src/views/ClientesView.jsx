import React from 'react';
import { MEDIDAS_COL_IZQ, MEDIDAS_COL_DER, obtenerMedida } from '../constants/medidas';

export default function ClientesView({

  clientesFiltrados,
  setBusqueda,
  setClienteSeleccionado,
  cambiarVista,
  setModalConfirm,
  borrarCliente
}) {
  return (
    <div>
      <input 
        type="text" 
        placeholder="Buscar cliente..." 
        className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none" 
        onChange={(e) => setBusqueda(e.target.value)} 
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clientesFiltrados.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No existen clientes.</p>
        ) : (
          clientesFiltrados.map(c => (
            <div key={c.id} className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl relative">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  borrarCliente(c); 
                }} 
                className="tap-target absolute top-4 right-4 text-stone-600 hover:text-red-400 p-1"
              >
                ✕
              </button>
              <h3
                className="text-lg font-semibold cursor-pointer hover:underline interactive"
                onClick={() => { setClienteSeleccionado(c); cambiarVista('detalle-cliente'); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (setClienteSeleccionado(c), cambiarVista('detalle-cliente'))}
              >{c.nombre}</h3>
              <p className="text-stone-400 text-xs mb-4">{c.telefono}</p>
              
              <div className="mt-3 bg-stone-950/40 p-3 rounded-2xl border border-stone-800/80 grid grid-cols-2 gap-x-4 text-[11px]">
                <div className="flex flex-col gap-y-1">
                  {MEDIDAS_COL_IZQ.map(m => {
                    const val = obtenerMedida(c.medidas, m);
                    return (
                      <div key={m} className="flex items-center justify-between border-b border-stone-800/50 pb-1">
                        <span className="text-stone-400 truncate pr-1">{m}</span>
                        <span className="font-medium text-stone-200 shrink-0">{val || '—'}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-y-1">
                  {MEDIDAS_COL_DER.map(m => {
                    const val = obtenerMedida(c.medidas, m);
                    return (
                      <div key={m} className="flex items-center justify-between border-b border-stone-800/50 pb-1">
                        <span className="text-stone-400 truncate pr-1">{m}</span>
                        <span className="font-medium text-stone-200 shrink-0">{val || '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
