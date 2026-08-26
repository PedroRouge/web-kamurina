import React, { useState } from 'react';

export default function NuevoPedidoView({
  crearPedido,
  handleKeyDownEnter,
  esAdmin,
  clientes,
  user,
  clienteActual,
  telas,
  cambiarVista,
  isSaving
}) {
  const [preview, setPreview] = useState(null);
  const nombreClienteMostrar = clienteActual?.nombre || user?.displayName || user?.email || 'Cliente';
  const telefonoRegistrado = clienteActual?.telefono || '';

  return (
    <form onSubmit={crearPedido} onKeyDown={handleKeyDownEnter} className="bg-stone-900/40 p-6 md:p-8 rounded-3xl border border-stone-800 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">{esAdmin ? 'Crear Nuevo Pedido' : 'Solicitar Nuevo Pedido'}</h2>
       
      {esAdmin ? (
        <select name="clienteId" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none text-white" required>
          <option value="">Seleccionar Cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      ) : (
        <div className="mb-4 bg-stone-950 p-3 rounded-xl border border-stone-800 text-sm text-stone-400">
          Cliente: <span className="text-white font-bold">{nombreClienteMostrar}</span>
        </div>
      )}

      <input name="prenda" placeholder="¿Qué prenda deseas mandar a hacer?" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
       
      {!esAdmin && (
        telefonoRegistrado && telefonoRegistrado.trim() !== '' ? (
          <input type="hidden" name="telefono" value={telefonoRegistrado} />
        ) : (
          <input name="telefono" placeholder="Teléfono Móvil (Ej: 3434...)" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none" required />
        )
      )}

      {!esAdmin && (
        <div>
          <label className="block text-xs text-stone-400 mb-1">Descripción del pedido (Color, forma, tela...)</label>
          <textarea 
            name="descripcionDetalle" 
            rows="3" 
            placeholder="Detalla aquí color, forma, tipo de tela, etc..." 
            className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none text-sm text-white resize-none" 
            required 
          />
        </div>
      )}
       
      {esAdmin ? (
        <>
          <select name="tela" className="w-full bg-stone-950 p-3 rounded-xl mb-4 border border-stone-800 outline-none text-white">
            <option value="">Seleccionar Tela (Opcional)</option>
            {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
          </select>
          <div className="mb-4">
            <label className="block text-xs text-stone-400 mb-1">Foto del Pedido (Opcional)</label>
            <input
              name="fotoArchivo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setPreview(file ? URL.createObjectURL(file) : null);
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
        </>
      ) : (
        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Subir foto de ejemplo o diseño (Opcional)</label>
          <input
            name="fotoArchivo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setPreview(file ? URL.createObjectURL(file) : null);
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
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => cambiarVista('dashboard')} className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold hover:bg-stone-700">Cancelar</button>
        <button type="submit" disabled={isSaving} className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">
          {isSaving ? 'Guardando...' : (esAdmin ? 'Crear Pedido' : 'Enviar Solicitud')}
        </button>
      </div>
    </form>
  );
}
