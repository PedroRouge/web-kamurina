import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const ESTADOS = ['Pendiente', 'En proceso', 'Listo para retirar', 'Entregado'];

export default function ArreglosView({ esAdmin, arreglos, clientes, mostrarToast, cambiarVista }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [form, setForm] = useState({
    cliente: '',
    descripcion: '',
    precio: '',
    estado: 'Pendiente',
    entrega: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorLocal) setErrorLocal('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente.trim() || !form.descripcion.trim()) {
      setErrorLocal('El cliente y la descripción son obligatorios.');
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
        estado: form.estado,
        entrega: form.entrega,
        creadoEn: serverTimestamp(),
      });
      mostrarToast('Arreglo registrado con éxito');
      setForm({ cliente: '', descripcion: '', precio: '', estado: 'Pendiente', entrega: '' });
      setMostrarForm(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Arreglos</h2>
        {esAdmin && (
          <button
            onClick={() => { setMostrarForm(v => !v); setErrorLocal(''); }}
            className="bg-white text-stone-950 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-stone-200 transition-colors"
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo arreglo'}
          </button>
        )}
      </div>

      {mostrarForm && esAdmin && (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-stone-400">Cliente *</label>
              {clientes.length > 0 ? (
                <select
                  name="cliente"
                  value={form.cliente}
                  onChange={handleChange}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stone-500"
                >
                  <option value="">Seleccioná un cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.nombre}>{c.nombre}</option>
                  ))}
                </select>
              ) : (
                <input
                  name="cliente"
                  value={form.cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-400">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stone-500"
              >
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
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

            <div className="space-y-1">
              <label className="text-xs text-stone-400">Fecha de entrega</label>
              <input
                name="entrega"
                type="date"
                value={form.entrega}
                onChange={handleChange}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-stone-500"
              />
            </div>
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

      {arreglos.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm italic">
          No hay arreglos registrados todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {arreglos.map(a => (
            <div
              key={a.id}
              className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="font-semibold text-white">{a.cliente}</p>
                <p className="text-sm text-stone-400">{a.descripcion}</p>
                {a.entrega && (
                  <p className="text-xs text-stone-500">Entrega: {a.entrega}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {a.precio > 0 && (
                  <span className="text-emerald-400 font-semibold text-sm">
                    ${Number(a.precio).toLocaleString('es-AR')}
                  </span>
                )}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  a.estado === 'Entregado'
                    ? 'bg-stone-800 text-stone-400 border-stone-700'
                    : a.estado === 'Listo para retirar'
                    ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50'
                    : a.estado === 'En proceso'
                    ? 'bg-amber-950/50 text-amber-400 border-amber-900/50'
                    : 'bg-stone-800/50 text-stone-300 border-stone-700'
                }`}>
                  {a.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
