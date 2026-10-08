import React from 'react';
import { MEDIDAS_GRUPOS } from '../constants/medidas';

export default function EditarClienteView({
  clienteSeleccionado,
  formRef,
  setFormDirty,
  actualizarCliente,
  handleKeyDownEnter,
  cambiarVista
}) {
  if (!clienteSeleccionado) return null;

  return (
    <form
      ref={formRef}
      onChange={() => setFormDirty(true)}
      onSubmit={actualizarCliente}
      onKeyDown={handleKeyDownEnter}
      className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto scroll-pb-40"
    >
      <h2 className="text-2xl font-bold mb-6">Editar Cliente y Medidas</h2>

      <div className="space-y-3 mb-6">
        <input name="nombre" defaultValue={clienteSeleccionado.nombre} placeholder="Nombre completo" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-sm" required />
        <input name="telefono" defaultValue={clienteSeleccionado.telefono} placeholder="Teléfono (solo números)" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-sm" required />
      </div>

      <div className="space-y-5 mb-6">
        {MEDIDAS_GRUPOS.map(grupo => (
          <div key={grupo.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">{grupo.label}</p>
            <div className="grid grid-cols-2 gap-2">
              {grupo.medidas.map(m => (
                <div key={m}>
                  <label className="text-[10px] text-stone-500 pl-1 block mb-0.5">{m}</label>
                  <input
                    name={m}
                    defaultValue={clienteSeleccionado.medidas?.[m] || ''}
                    placeholder="—"
                    className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => cambiarVista('clientes')} className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-stone-700 transition-colors">Cancelar</button>
        <button type="submit" className="flex-1 bg-white text-stone-950 py-3 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors">Guardar Cambios</button>
      </div>
    </form>
  );
}
