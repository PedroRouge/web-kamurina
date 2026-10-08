import React, { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ArreglosView({ esAdmin, arreglos, mostrarToast, formAbierto, setFormAbierto }) {
  const [tab, setTab] = useState('activos');
  const [guardando, setGuardando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [form, setForm] = useState({ cliente: '', descripcion: '', precio: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorLocal) setErrorLocal('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.descripcion.trim()) {
      setErrorLocal('El nombre del cliente y la descripción son obligatorios.');
      return;
    }
    if (guardando) return;
    setGuardando(true);
    setErrorLocal('');
    try {
      await addDoc(collection(db, 'arreglos'), {
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio) || 0,
        estado: 'activo',
        creadoEn: Date.now(),
      });
      mostrarToast('Arreglo registrado con éxito');
      setForm({ cliente: '', descripcion: '', precio: '' });
      setFormAbierto(false);
    } catch (err) {
      console.error('Error al guardar arreglo:', err);
      if (err.code === 'permission-denied') {
        setErrorLocal('Sin permisos para guardar. Verificá tu sesión.');
      } else if (err.code === 'resource-exhausted') {
        setErrorLocal('Límite de Firebase alcanzado. Intentá más tarde.');
      } else {
        setErrorLocal('Error al guardar. Verificá tu conexión e intentá de nuevo.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (arreglo) => {
    const nuevoEstado = arreglo.estado === 'activo' ? 'entregado' : 'activo';
    try {
      await updateDoc(doc(db, 'arreglos', arreglo.id), { estado: nuevoEstado });
      mostrarToast(nuevoEstado === 'entregado' ? 'Marcado como entregado' : 'Marcado como activo');
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      mostrarToast(err.code === 'permission-denied' ? 'Sin permisos para modificar.' : 'Error al cambiar estado.');
    }
  };

  const eliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'arreglos', id));
      mostrarToast('Arreglo eliminado');
    } catch (err) {
      console.error('Error al eliminar arreglo:', err);
      mostrarToast(err.code === 'permission-denied' ? 'Sin permisos para eliminar.' : 'Error al eliminar.');
    }
  };

  const activos = arreglos.filter(a => a.estado === 'activo');
  const entregados = arreglos.filter(a => a.estado === 'entregado');
  const lista = tab === 'activos' ? activos : entregados;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Arreglos</h2>
        {esAdmin && (
          <button
            onClick={() => { setFormAbierto(v => !v); setErrorLocal(''); }}
            className="bg-white text-stone-950 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-stone-200 transition-colors"
          >
            {formAbierto ? 'Cancelar' : '+ Nuevo arreglo'}
          </button>
        )}
      </div>

      {formAbierto && esAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm"
        >
          <h3 className="font-semibold text-stone-200">Registrar arreglo</h3>

          {errorLocal && (
            <div className="bg-red-950/60 border border-red-800/60 text-red-300 text-sm px-4 py-3 rounded-xl">
              ⚠️ {errorLocal}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-stone-400">Nombre del cliente *</label>
            <input
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              placeholder="Ej: María González"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-400">Descripción del arreglo *</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Subir ruedo 3cm, cambiar cierre..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-400">Precio</label>
            <input
              name="precio"
              type="number"
              min="0"
              value={form.precio}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-white text-stone-950 font-semibold py-2.5 rounded-xl text-sm hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar arreglo'}
          </button>
        </form>
      )}

      {/* Pestañas */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('activos')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'activos'
              ? 'bg-white text-stone-950'
              : 'bg-stone-900/60 text-stone-400 border border-stone-700 hover:text-stone-200'
          }`}
        >
          Activos
          {activos.length > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'activos' ? 'bg-stone-200 text-stone-800' : 'bg-stone-700 text-stone-300'}`}>
              {activos.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('entregados')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'entregados'
              ? 'bg-white text-stone-950'
              : 'bg-stone-900/60 text-stone-400 border border-stone-700 hover:text-stone-200'
          }`}
        >
          Entregados
          {entregados.length > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'entregados' ? 'bg-stone-200 text-stone-800' : 'bg-stone-700 text-stone-300'}`}>
              {entregados.length}
            </span>
          )}
        </button>
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm italic">
          {tab === 'activos' ? 'No hay arreglos activos.' : 'No hay arreglos entregados.'}
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map(a => (
            <div
              key={a.id}
              className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-white">{a.cliente}</p>
                <p className="text-sm text-stone-400 line-clamp-2">{a.descripcion}</p>
                {a.precio > 0 && (
                  <p className="text-emerald-400 font-semibold text-sm">
                    ${Number(a.precio).toLocaleString('es-AR')}
                  </p>
                )}
              </div>

              {esAdmin && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => cambiarEstado(a)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors ${
                      a.estado === 'activo'
                        ? 'bg-amber-950/50 text-amber-300 border-amber-900/50 hover:bg-amber-900/50'
                        : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/50'
                    }`}
                  >
                    {a.estado === 'activo' ? 'Marcar entregado' : 'Reactivar'}
                  </button>
                  <button
                    onClick={() => eliminar(a.id)}
                    className="text-xs text-stone-500 hover:text-red-400 transition-colors px-2 py-1.5"
                    title="Eliminar arreglo"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
