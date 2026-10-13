import React from 'react';
import { MEDIDAS_LISTA } from '../constants/medidas';

export default function NuevoClienteView({
  formRef,
  setFormDirty,
  guardarCliente,
  handleKeyDownEnter,
  cambiarVista,
  isSaving
}) {
  return (
    <form
      ref={formRef}
      onChange={() => setFormDirty(true)}
      onSubmit={guardarCliente}
      onKeyDown={handleKeyDownEnter}
      className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">Nuevo Cliente</h2>

      <div className="space-y-3 mb-6">
        <input name="nombre" placeholder="Nombre completo" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-sm" required />
        <input name="telefono" placeholder="Teléfono (solo números)" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-sm" required />
      </div>

      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
          Medidas (en cm)
        </label>
        <div className="flex flex-col gap-2">
          {MEDIDAS_LISTA.map(m => (
            <div key={m} className="flex items-center justify-between gap-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
              <label htmlFor={`medida-${m}`} className="text-xs text-stone-300 font-medium">
                {m}
              </label>
              <input
                id={`medida-${m}`}
                name={m}
                placeholder="—"
                className="w-28 bg-stone-900 p-2 rounded-lg border border-stone-800 outline-none focus:border-stone-500 text-xs text-white text-right"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={() => cambiarVista('clientes')} className="flex-1 bg-stone-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-stone-700 transition-colors">Cancelar</button>
        <button type="submit" disabled={isSaving} className="flex-1 bg-white text-stone-950 py-3 rounded-xl font-bold text-sm hover:bg-stone-200 transition-colors disabled:opacity-50">
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
