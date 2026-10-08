import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { parseNumero } from '../utils/helpers';

function TelaCard({ t, onBorrar, onActualizado, setTelaSeleccionada, cambiarVista, subirOEncolarFoto }) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: t.nombre || '',
    descripcion: t.descripcion || '',
    uso: t.uso || '',
    stock: t.stock || '',
    precio: t.precio || '',
  });
  const [preview, setPreview] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      let urlFoto = t.foto || '';
      if (archivoFoto) {
        urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'telas', documentoId: t.id }) || urlFoto;
      }
      const actualizada = {
        ...t,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        uso: form.uso.trim(),
        stock: form.stock,
        precio: parseNumero(form.precio, 0),
        foto: urlFoto,
      };
      await setDoc(doc(db, 'telas', String(t.id)), actualizada);
      onActualizado(actualizada);
      setEditando(false);
      setPreview(null);
      setArchivoFoto(null);
    } catch (err) {
      console.error('Error al guardar tela:', err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 rounded-3xl overflow-hidden flex flex-col">
      {/* Foto */}
      {t.foto && !editando && (
        <img src={t.foto} alt={t.nombre} className="w-full h-36 object-cover" />
      )}

      {!editando ? (
        /* ── VISTA ── */
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white leading-tight">{t.nombre}</h3>
            <button
              onClick={onBorrar}
              className="tap-target flex-shrink-0 text-stone-600 hover:text-red-400 transition-colors text-xs p-1"
              title="Eliminar"
            >✕</button>
          </div>

          {t.descripcion && <p className="text-xs text-stone-400 mb-1 line-clamp-2">{t.descripcion}</p>}
          {t.uso && <p className="text-xs text-stone-500 mb-3">Uso: {t.uso}</p>}

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-stone-800/60">
            <div className="space-y-0.5">
              <p className="text-xs text-stone-500">Stock: <span className="text-stone-300 font-medium">{t.stock || '—'}</span></p>
              <p className="text-xs text-stone-500">
                Precio: <span className={`font-semibold ${t.precio > 0 ? 'text-emerald-400' : 'text-stone-500'}`}>
                  {t.precio > 0 ? `$${Number(t.precio).toLocaleString('es-AR')}/m` : '—'}
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
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Editando tela</p>

          {[
            { name: 'nombre', placeholder: 'Nombre', required: true },
            { name: 'descripcion', placeholder: 'Descripción' },
            { name: 'uso', placeholder: 'Uso' },
          ].map(({ name, placeholder, required }) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
            />
          ))}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-stone-500 block mb-1">Stock</label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej: 5m"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-600 outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-500 block mb-1">Precio / metro ($)</label>
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
            {(preview || t.foto) && (
              <img
                src={preview || t.foto}
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

export default function CatalogoTelasView({
  telasFiltradas,
  busquedaTelas,
  setBusquedaTelas,
  setTelaSeleccionada,
  cambiarVista,
  setModalConfirm,
  borrarTela,
  actualizarStock,
  subirOEncolarFoto,
  setTelas,
  telas,
}) {
  const handleActualizado = (actualizada) => {
    if (setTelas && telas) {
      setTelas(prev => prev.map(t => t.id === actualizada.id ? actualizada : t));
    }
    setTelaSeleccionada(actualizada);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar tela por nombre, descripción, uso o precio..."
        className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl mb-6 outline-none text-sm text-white backdrop-blur-md"
        value={busquedaTelas}
        onChange={(e) => setBusquedaTelas(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {telasFiltradas.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">No se encontraron telas con esa búsqueda.</p>
        ) : (
          telasFiltradas.map(t => (
            <TelaCard
              key={t.id}
              t={t}
              onBorrar={() => setModalConfirm({ isOpen: true, text: `¿Eliminar la tela "${t.nombre}" del catálogo?`, action: () => borrarTela(t) })}
              onActualizado={handleActualizado}
              setTelaSeleccionada={setTelaSeleccionada}
              cambiarVista={cambiarVista}
              subirOEncolarFoto={subirOEncolarFoto}
            />
          ))
        )}
      </div>
    </div>
  );
}
