import React, { useState } from 'react';

export default function NuevoAvioView({
  guardarAvio,
  handleKeyDownEnter,
  isSaving
}) {
  const [preview, setPreview] = useState(null);

  return (
    <form onSubmit={guardarAvio} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuevo Avío</h2>
      <input name="nombre" placeholder="Nombre" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
       
      <select name="tipo" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none text-white">
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

      <input name="centimetros" placeholder="Centímetros (cm, opcional)" type="number" min="0" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="cantidad" placeholder="Cantidad (opcional)" type="number" min="0" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
      <input name="precio" type="number" min="0" placeholder="Precio ($)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" />
       
      <div className="mb-4">
        <label className="block text-xs text-stone-400 mb-1">Foto del Avío (Opcional)</label>
        <input
          name="fotoArchivo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setPreview(URL.createObjectURL(file));
            else setPreview(null);
          }}
          className="w-full bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
        />
        {preview && (
          <div className="mt-3 flex items-center gap-3">
            <img src={preview} alt="Vista previa" className="w-20 h-20 object-contain rounded-xl border border-stone-700 bg-stone-950/60" />
            <span className="text-xs text-stone-400">Vista previa</span>
          </div>
        )}
      </div>

      <button type="submit" disabled={isSaving} className="w-full mt-6 bg-white text-stone-950 py-3 rounded-xl font-bold">
        {isSaving ? 'Guardando...' : 'Guardar Avío'}
      </button>
    </form>
  );
}
