import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { parseNumero } from '../utils/helpers';

const TIPOS_AVIO = ['Fijo', 'Desmontable', 'Por metro', 'Ballena', 'Botón', 'Bies', 'Elastico', 'Cintas', 'Hilos', 'Agujas', 'Abrojo'];

function AvioCard({ a, onBorrar, onActualizado, subirOEncolarFoto }) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: a.nombre || '',
    tipo: a.tipo || '',
    centimetros: a.centimetros || '',
    cantidad: a.cantidad || '',
    precio: a.precio || '',
  });
  const [preview, setPreview] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      let urlFoto = a.foto || '';
      if (archivoFoto) {
        urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'avios', documentoId: a.id }) || urlFoto;
      }
      const actualizado = {
        ...a,
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        centimetros: form.centimetros,
        cantidad: form.cantidad,
        precio: parseNumero(form.precio, 0),
        foto: urlFoto,
      };
      await setDoc(doc(db, 'avios', String(a.id)), actualizado);
      onActualizado(actualizado);
      setEditando(false);
      setPreview(null);
      setArchivoFoto(null);
    } catch (err) {
      console.error('Error al guardar avío:', err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-3xl overflow-hidden flex flex-col">
      {a.foto && !editando && (
        <img src={a.foto} alt={a.nombre} className="w-full h-36 object-cover" />
      )}

      {!editando ? (
        /* ── VISTA ── */
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white leading-tight">{a.nombre}</h3>
            <button
              onClick={onBorrar}
              className="tap-target flex-shrink-0 text-stone-600 hover:text-red-400 transition-colors text-xs p-1"
              title="Eliminar"
            >✕</button>
          </div>

          {a.tipo && <p className="text-xs text-stone-400 mb-1">Tipo: {a.tipo}{a.centimetros ? ` · ${a.centimetros} cm` : ''}</p>}

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-800/60">
            <div className="space-y-0.5">
              <p className="text-xs text-stone-500">Cant: <span className="text-stone-300 font-medium">{a.cantidad || '—'}</span></p>
              <p className="text-xs text-stone-500">
                Precio: <span className={`font-semibold ${a.precio > 0 ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {a.precio > 0 ? `$${Number(a.precio).toLocaleString('es-AR')}` : '—'}
                </span>
              </p>
            </div>
            <button
              onClick={() => setEditando(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      ) : (
        /* ── EDICIÓN INLINE ── */
        <form onSubmit={handleGuardar} className="p-4 space-y-3">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Editando avío</p>

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-stone-500"
          >
            <option value="">Tipo (opcional)</option>
            {TIPOS_AVIO.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-500 block mb-1">Centímetros</label>
              <input
                name="centimetros"
                type="number"
                min="0"
                value={form.centimetros}
                onChange={handleChange}
                placeholder="—"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-500 block mb-1">Cantidad</label>
              <input
                name="cantidad"
                type="number"
                min="0"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="—"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-stone-500 block mb-1">Precio ($)</label>
            <input
              name="precio"
              type="number"
              min="0"
              value={form.precio}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-stone-500 block mb-1">Foto (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                setArchivoFoto(f || null);
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer"
            />
            {(preview || a.foto) && (
              <img
                src={preview || a.foto}
                alt="preview"
                className="mt-2 w-full h-24 object-cover rounded-xl border border-stone-800"
              />
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-white text-stone-950 font-bold py-2 rounded-xl text-sm hover:bg-stone-200 transition-colors disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => { setEditando(false); setPreview(null); setArchivoFoto(null); }}
              className="px-4 py-2 rounded-xl text-sm text-stone-400 border border-stone-700 hover:text-white hover:border-stone-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CatalogoAviosView({
  aviosFiltrados,
  busquedaAvios,
  setBusquedaAvios,
  setAvioSeleccionado,
  cambiarVista,
  setModalConfirm,
  borrarAvio,
  actualizarCantidadAvio,
  actualizarPrecioAvio,
  subirOEncolarFoto,
  setAvios,
  avios,
}) {
  const handleActualizado = (actualizado) => {
    if (setAvios && avios) {
      setAvios(prev => prev.map(a => a.id === actualizado.id ? actualizado : a));
    }
    setAvioSeleccionado(actualizado);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar avío por nombre, tipo o precio..."
        className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none text-sm text-white backdrop-blur-md"
        value={busquedaAvios}
        onChange={(e) => setBusquedaAvios(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {aviosFiltrados.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No se encontraron avíos con esa búsqueda.</p>
        ) : (
          aviosFiltrados.map(a => (
            <AvioCard
              key={a.id}
              a={a}
              onBorrar={() => setModalConfirm({ isOpen: true, text: `¿Eliminar el avío "${a.nombre}" del catálogo?`, action: () => borrarAvio(a.id) })}
              onActualizado={handleActualizado}
              subirOEncolarFoto={subirOEncolarFoto}
            />
          ))
        )}
      </div>
    </div>
  );
}
