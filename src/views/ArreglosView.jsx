import React, { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const FORM_VACIO = { cliente: '', descripcion: '', precio: '' };

function FormArreglo({ inicial, onGuardar, onCancelar, guardando, errorLocal, titulo, labelBoton }) {
  const [form, setForm] = useState(inicial);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm"
    >
      <h3 className="font-semibold text-stone-200">{titulo}</h3>

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
        <label className="text-xs text-stone-400">Precio *</label>
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

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-white text-stone-950 font-semibold py-2.5 rounded-xl text-sm hover:bg-stone-200 transition-colors disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : labelBoton}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2.5 rounded-xl text-sm text-stone-400 border border-stone-700 hover:text-stone-200 hover:border-stone-500 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function ArreglosView({ esAdmin, arreglos, mostrarToast, formAbierto, setFormAbierto }) {
  const [tab, setTab] = useState('activos');
  const [guardando, setGuardando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [errorEdicion, setErrorEdicion] = useState('');
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null);

  const validar = (form) => {
    if (!form.cliente.trim()) return 'El nombre del cliente es obligatorio.';
    if (!form.descripcion.trim()) return 'La descripción es obligatoria.';
    if (form.precio === '' || form.precio === null || form.precio === undefined)
      return 'El precio es obligatorio (podés ingresar 0).';
    return null;
  };

  const handleCrear = async (form) => {
    const err = validar(form);
    if (err) { setErrorLocal(err); return; }
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
      setFormAbierto(false);
    } catch (err) {
      console.error('Error al guardar arreglo:', err);
      setErrorLocal(
        err.code === 'permission-denied' ? 'Sin permisos para guardar. Verificá tu sesión.' :
        err.code === 'resource-exhausted' ? 'Límite de Firebase alcanzado. Intentá más tarde.' :
        'Error al guardar. Verificá tu conexión e intentá de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = async (form) => {
    const err = validar(form);
    if (err) { setErrorEdicion(err); return; }
    setGuardando(true);
    setErrorEdicion('');
    try {
      await updateDoc(doc(db, 'arreglos', editandoId), {
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        precio: parseFloat(form.precio) || 0,
      });
      mostrarToast('Arreglo actualizado');
      setEditandoId(null);
    } catch (err) {
      console.error('Error al editar arreglo:', err);
      setErrorEdicion(
        err.code === 'permission-denied' ? 'Sin permisos para modificar.' :
        err.code === 'resource-exhausted' ? 'Límite de Firebase alcanzado. Intentá más tarde.' :
        'Error al guardar. Verificá tu conexión e intentá de nuevo.'
      );
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
    } finally {
      setConfirmandoEliminar(null);
    }
  };

  const activos = arreglos.filter(a => a.estado === 'activo');
  const entregados = arreglos.filter(a => a.estado === 'entregado');
  const lista = tab === 'activos' ? activos : entregados;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Arreglos</h2>
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
        <FormArreglo
          inicial={FORM_VACIO}
          onGuardar={handleCrear}
          onCancelar={() => { setFormAbierto(false); setErrorLocal(''); }}
          guardando={guardando}
          errorLocal={errorLocal}
          titulo="Registrar arreglo"
          labelBoton="Guardar arreglo"
        />
      )}

      {/* Pestañas */}
      <div className="flex gap-2">
        {[['activos', activos], ['entregados', entregados]].map(([key, lista]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              tab === key
                ? 'bg-white text-stone-950'
                : 'bg-stone-900/60 text-stone-400 border border-stone-700 hover:text-stone-200'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            {lista.length > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === key ? 'bg-stone-200 text-stone-800' : 'bg-stone-700 text-stone-300'}`}>
                {lista.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="text-center py-16 text-stone-500 text-sm italic">
          {tab === 'activos' ? 'No hay arreglos activos.' : 'No hay arreglos entregados.'}
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map(a => (
            <div key={a.id} className="bg-stone-900/70 border border-stone-800 rounded-2xl overflow-hidden">
              {editandoId === a.id ? (
                <div className="p-4">
                  <FormArreglo
                    inicial={{ cliente: a.cliente, descripcion: a.descripcion, precio: String(a.precio) }}
                    onGuardar={handleEditar}
                    onCancelar={() => { setEditandoId(null); setErrorEdicion(''); }}
                    guardando={guardando}
                    errorLocal={errorEdicion}
                    titulo="Editar arreglo"
                    labelBoton="Guardar cambios"
                  />
                </div>
              ) : (
                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-white">{a.cliente}</p>
                    <p className="text-sm text-stone-400 line-clamp-2">{a.descripcion}</p>
                    <p className={`font-semibold text-sm ${a.precio > 0 ? 'text-emerald-400' : 'text-stone-500'}`}>
                      ${Number(a.precio).toLocaleString('es-AR')}
                    </p>
                  </div>

                  {esAdmin && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditandoId(a.id); setErrorEdicion(''); setFormAbierto(false); }}
                        className="tap-target text-xs font-medium px-3 py-1.5 rounded-xl border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => cambiarEstado(a)}
                        className={`tap-target text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors ${
                          a.estado === 'activo'
                            ? 'bg-amber-950/50 text-amber-300 border-amber-900/50 hover:bg-amber-900/50'
                            : 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/50'
                        }`}
                      >
                        {a.estado === 'activo' ? 'Marcar entregado' : 'Reactivar'}
                      </button>
                      <button
                        onClick={() => setConfirmandoEliminar(a)}
                        className="tap-target text-xs text-stone-500 hover:text-red-400 transition-colors px-2 py-1.5"
                        title="Eliminar arreglo"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    {confirmandoEliminar && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
          <h3 className="font-semibold text-white">¿Eliminar arreglo?</h3>
          <p className="text-sm text-stone-400">
            Se eliminará el arreglo de <span className="text-white font-medium">{confirmandoEliminar.cliente}</span>. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => eliminar(confirmandoEliminar.id)}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmandoEliminar(null)}
              className="flex-1 border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
