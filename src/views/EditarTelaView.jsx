import React from 'react';

export default function EditarTelaView({
  telaSeleccionada,
  actualizarTelaEditada,
  handleKeyDownEnter,
  isSaving
}) {
  if (!telaSeleccionada) return null;

  return (
    <form onSubmit={actualizarTelaEditada} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Tela</h2>
      <input name="nombre" defaultValue={telaSeleccionada.nombre} placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
      <input name="desc" defaultValue={telaSeleccionada.descripcion} placeholder="Descripción" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="uso" defaultValue={telaSeleccionada.uso} placeholder="Uso" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="stock" defaultValue={telaSeleccionada.stock} placeholder="Stock" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="precio" type="number" min="0" defaultValue={telaSeleccionada.precio || ''} placeholder="Precio por metro ($)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
       
      <div className="mb-4">
        <label className="block text-xs text-stone-400 mb-1">Cambiar Foto (Opcional)</label>
        <input name="fotoArchivo" type="file" accept="image/*" className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer" />
      </div>

      <button type="submit" disabled={isSaving} className="w-full mt-6 bg-white text-stone-950 py-3 rounded-xl font-bold">Guardar Cambios</button>
    </form>
  );
}
