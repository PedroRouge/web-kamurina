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
    <form ref={formRef} onChange={() => setFormDirty(true)} onSubmit={guardarCliente} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuevo Cliente</h2>
      <input name="nombre" placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
      <input name="telefono" placeholder="Teléfono (solo números)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
       
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
        {MEDIDAS_LISTA.map(m => (
          <div key={m} className="flex flex-col gap-1">
            <label className="text-stone-500 pl-1">{m}</label>
            <input name={m} className="bg-stone-950 p-2 rounded border border-stone-800 outline-none" />
          </div>
        ))}
      </div>
       
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={() => cambiarVista('clientes')} className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold">Cancelar</button>
        <button type="submit" disabled={isSaving} className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Guardar</button>
      </div>
    </form>
  );
}
