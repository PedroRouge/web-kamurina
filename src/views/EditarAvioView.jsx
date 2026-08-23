import React from 'react';

export default function EditarAvioView({
  avioSeleccionado,
  actualizarAvioEditado,
  handleKeyDownEnter,
  isSaving
}) {
  if (!avioSeleccionado) return null;

  return (
    <form onSubmit={actualizarAvioEditado} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Avío</h2>
      <input name="nombre" defaultValue={avioSeleccionado.nombre} placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
       
      <select name="tipo" defaultValue={avioSeleccionado.tipo || ''} className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none text-white">
        <option value="">Seleccionar tipo (Opcional)</option>
        <option value="Fijo">Fijo</option>
        <option value="Desmontable">Desmontable</option>
        <option value="Por metro">Por metro</option>
        <option value="Ballena">Ballena</option>
        <option value="Botón">Botón</option>
        <option value="Bies">Bies</option>
        <option value="Elastico">Elastico</option>
        <option value="Cintas">Cintas</option>
        <option value="Hilos">Hilos</option>
        <option value="Agujas">Agujas</option>
        <option value="Abrojo">Abrojo</option>
      </select>

      <input name="centimetros" defaultValue={avioSeleccionado.centimetros || ''} placeholder="Centímetros (cm, opcional)" type="number" min="0" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="cantidad" defaultValue={avioSeleccionado.cantidad || ''} placeholder="Cantidad (opcional)" type="number" min="0" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="precio" type="number" min="0" defaultValue={avioSeleccionado.precio || ''} placeholder="Precio ($)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
       
      <div className="mb-4">
        <label className="block text-xs text-stone-400 mb-1">Cambiar Foto (Opcional)</label>
        <input name="fotoArchivo" type="file" accept="image/*" className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer" />
      </div>

      <button type="submit" disabled={isSaving} className="w-full mt-6 bg-white text-stone-950 py-3 rounded-xl font-bold">Guardar Cambios</button>
    </form>
  );
}
