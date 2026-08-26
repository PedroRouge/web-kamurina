import React from 'react';
import { MEDIDAS_LISTA } from '../constants/medidas';

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
    <form ref={formRef} onChange={() => setFormDirty(true)} onSubmit={actualizarCliente} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Cliente y Medidas</h2>
      <input name="nombre" defaultValue={clienteSeleccionado.nombre} placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
      <input name="telefono" defaultValue={clienteSeleccionado.telefono} placeholder="Teléfono (solo números)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
       
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
        {MEDIDAS_LISTA.map(m => (
          <div key={m} className="flex flex-col gap-1">
            <label className="text-stone-500 pl-1">{m}</label>
            <input name={m} defaultValue={clienteSeleccionado.medidas?.[m] || ''} className="bg-stone-950 p-2 rounded border border-stone-800 outline-none" />
          </div>
        ))}
      </div>
       
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={() => cambiarVista('clientes')} className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold">Cancelar</button>
        <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Guardar Cambios</button>
      </div>
    </form>
  );
}
