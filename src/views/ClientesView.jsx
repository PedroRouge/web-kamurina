import React from 'react';
import { MEDIDAS_LISTA } from '../constants/medidas';

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
                className="absolute top-4 right-4 text-stone-600 hover:text-red-400"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => { setClienteSeleccionado(c); cambiarVista('detalle-cliente'); }}>{c.nombre}</h3>
                            <p className="text-stone-400 text-xs mb-4">{c.telefono}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-stone-500">
                {MEDIDAS_LISTA.map(m => (
                  <div key={m}>{m}: {c.medidas?.[m] || '—'}</div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
