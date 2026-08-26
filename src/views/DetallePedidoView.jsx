import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../services/firebase';
import { parseNumero, formatearMoneda } from '../utils/helpers';

export default function DetallePedidoView({
  pedidoSeleccionado,
  setPedidoSeleccionado,
  esAdmin,
  telas,
  clientes,
  cambiarVista,
  mostrarToast,
  setModalPago,
  setModalAlias,
  setModalConfirm,
  setFotoAmpliada,
  eliminarPagoParcial,
  handleKeyDownEnter,
  setIsSaving,
  subirOEncolarFoto
}) {
  if (!pedidoSeleccionado) return null;

  const arrayFotos = pedidoSeleccionado.fotos || (pedidoSeleccionado.foto ? [pedidoSeleccionado.foto] : []);
  const esRechazado = pedidoSeleccionado.estado === 'Rechazado';
      
  const pagosRealizados = pedidoSeleccionado.pagos || [];
  const totalAbonado = pagosRealizados.reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
  const precioTotal = parseNumero(pedidoSeleccionado.precio, 0);
  const saldoPendiente = Math.max(0, precioTotal - totalAbonado);
  const porcentajePagado = precioTotal > 0 ? Math.min(100, Math.round((totalAbonado / precioTotal) * 100)) : 0;

  return (
    <div className={`bg-stone-900/40 backdrop-blur-md border p-6 md:p-10 rounded-3xl max-w-3xl mx-auto relative ${esRechazado ? 'border-red-900/60' : 'border-stone-800'}`}>
      <button onClick={() => cambiarVista('dashboard')} className="absolute top-6 right-6 text-stone-400 hover:text-white bg-stone-800/50 px-3 py-1.5 rounded-xl text-xs hover:bg-stone-700">Volver</button>
      
      <h2 className="text-2xl font-bold mb-1">Detalle del Pedido</h2>
      <p className="text-stone-400 text-sm mb-6">Cliente: <strong className="text-white">{pedidoSeleccionado.cliente}</strong> (ID: {pedidoSeleccionado.id})</p>

      {esRechazado && pedidoSeleccionado.motivoRechazo && (
        <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-2xl mb-6 text-sm text-red-300">
          <strong>Solicitud Rechazada.</strong> Motivo: {pedidoSeleccionado.motivoRechazo}
        </div>
      )}
      
      {esAdmin ? (
        <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const precioNuevo = parseNumero(fd.get('precio'), 0);
            const gastosNuevos = parseNumero(fd.get('gastos'), 0);
            
            try {
              const nuevoEstado = fd.get('estado');
              const nuevaEntrega = fd.get('entrega');
              const actualizado = {
                  ...pedidoSeleccionado,
                  prenda: fd.get('prenda'),
                  tela: fd.get('tela'),
                  precio: precioNuevo,
                  gastos: gastosNuevos,
                  estado: nuevoEstado,
                  entrega: nuevaEntrega,
                  motivoRechazo: nuevoEstado === 'Rechazado' ? (pedidoSeleccionado.motivoRechazo || 'Rechazado por el taller') : '',
                  ocultoDashboard: pedidoSeleccionado.ocultoDashboard || false
              };
              await setDoc(doc(db, "pedidos", String(pedidoSeleccionado.id)), actualizado, { merge: true });
              setPedidoSeleccionado(actualizado);
              mostrarToast("Pedido actualizado con éxito");
              cambiarVista('dashboard');
            } catch (err) {
              console.error("Error al actualizar pedido:", err);
              mostrarToast("Error de conexión al actualizar pedido");
            }
        }} onKeyDown={handleKeyDownEnter}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Prenda</label>
                    <input name="prenda" defaultValue={pedidoSeleccionado.prenda} className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" required />
                </div>
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Tela</label>
                    <select name="tela" defaultValue={pedidoSeleccionado.tela} className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500 text-white">
                        <option value="">Ninguna</option>
                        {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Precio Total ($)</label>
                    <input name="precio" type="number" min="0" defaultValue={pedidoSeleccionado.precio || ''} placeholder="0" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" />
                </div>
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Gastos de Materiales ($)</label>
                    <input name="gastos" type="number" min="0" defaultValue={pedidoSeleccionado.gastos !== undefined ? pedidoSeleccionado.gastos : ''} placeholder="0" className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" />
                </div>
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Fecha de Entrega Estimada</label>
                    <input name="entrega" type="date" defaultValue={pedidoSeleccionado.entrega || ''} className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none text-white focus:border-stone-500" />
                </div>
                <div>
                    <label className="text-stone-500 pl-1 text-xs block mb-1">Estado Confección / Logística</label>
                    <select name="estado" defaultValue={pedidoSeleccionado.estado} className="w-full bg-stone-950 p-3 rounded-xl border border-stone-800 outline-none font-bold text-white focus:border-stone-500" required>
                        <option value="Eligiendo telas">Eligiendo telas</option>
                        <option value="En confección / Pruebas">En confección / Pruebas</option>
                        <option value="Listo para retirar en el taller">Listo para retirar en el taller</option>
                        <option value="En camino (Envío a domicilio)">En camino (Envío a domicilio)</option>
                        <option value="Entregado con éxito">Entregado con éxito</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full bg-stone-800 text-white py-3 rounded-xl font-bold mb-6 hover:bg-stone-700 transition-colors">Guardar Información</button>
        </form>
      ) : (
        <div className="space-y-4 mb-6 text-sm bg-stone-950/50 p-4 rounded-2xl border border-stone-800">
          <p><strong>Prenda:</strong> {pedidoSeleccionado.prenda}</p>
          {pedidoSeleccionado.descripcionDetalle && (
            <p><strong>Detalles (Color, forma, tela):</strong> {pedidoSeleccionado.descripcionDetalle}</p>
          )}
          <p><strong>Estado Actual:</strong> <span className={esRechazado ? "text-red-400 font-bold" : "text-white font-bold"}>{pedidoSeleccionado.estado}</span></p>
          <p><strong>Precio Total:</strong> {pedidoSeleccionado.precio > 0 ? formatearMoneda(pedidoSeleccionado.precio) : 'A presupuestar'}</p>
           
          {!esAdmin && pedidoSeleccionado.precio > 0 && !pedidoSeleccionado.pagado && (
            <button
              onClick={() => setModalAlias({ isOpen: true, pedido: pedidoSeleccionado })}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg mt-4"
            >
              💳 Pagar por Transferencia (Ver Alias)
            </button>
          )}
        </div>
      )}

      <div className="bg-stone-950/80 border border-stone-800 p-6 rounded-2xl mb-6 shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-base font-bold text-white">Control de Pagos y Adelantos</h3>
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${pedidoSeleccionado.pagado ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50' : 'bg-amber-950 text-amber-300 border border-amber-900/50'}`}>
            {pedidoSeleccionado.pagado ? 'Pagado Total' : `Saldo Pendiente: ${formatearMoneda(saldoPendiente)}`}
          </span>
        </div>

        <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden mb-4 border border-stone-800">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${porcentajePagado}%` }}></div>
        </div>

        <div className="flex justify-between text-xs text-stone-400 mb-5">
          <span>Abonado: <strong className="text-white">{formatearMoneda(totalAbonado)}</strong></span>
          <span>Total prenda: <strong className="text-white">{formatearMoneda(precioTotal)}</strong> ({porcentajePagado}%)</span>
        </div>

        {pagosRealizados.length > 0 && (
          <div className="space-y-2.5 mb-5">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Historial de entregas de dinero:</p>
            {pagosRealizados.map((pago) => (
              <div key={pago.id} className="flex justify-between items-center bg-stone-900/90 p-3 rounded-xl border border-stone-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 text-sm">{formatearMoneda(pago.monto)}</span>
                  <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[11px]">{pago.metodo}</span>
                  <span className="text-stone-500 text-[11px]">{pago.fecha}</span>
                </div>
                {esAdmin && (
                  <button 
                    onClick={() => {
                      setModalConfirm({
                        isOpen: true,
                        text: `¿Estás segura de que deseas eliminar este pago de ${formatearMoneda(pago.monto)}?`,
                        action: () => eliminarPagoParcial(pago.id)
                      });
                    }}
                    className="text-stone-400 hover:text-red-400 p-1 font-bold text-sm"
                    title="Eliminar pago"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {esAdmin && pedidoSeleccionado.precio > 0 && (
          <button
            onClick={() => setModalPago({ isOpen: true, pedidoId: pedidoSeleccionado.id })}
            className="w-full bg-white text-stone-950 py-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors shadow-lg active:scale-98"
          >
            + Registrar Nuevo Pago / Seña
          </button>
        )}
      </div>

      {(() => {
        const telefonoContacto = esAdmin
          ? pedidoSeleccionado.telefono || (clientes.find(c => (pedidoSeleccionado.clienteId && c.id === pedidoSeleccionado.clienteId) || (c.nombre && pedidoSeleccionado.cliente && c.nombre.toLowerCase() === pedidoSeleccionado.cliente.toLowerCase()))?.telefono)
          : '3435302448';
        if (!telefonoContacto) return null;
        const mensaje = esAdmin 
          ? `Hola ${pedidoSeleccionado.cliente}, te escribo desde Atelier Kamurina por tu pedido de ${pedidoSeleccionado.prenda}.` 
          : `Hola, le escribo por los detalles de mi pedido de ${pedidoSeleccionado.prenda} (${pedidoSeleccionado.id}).`;
        const urlWhatsapp = `https://wa.me/${telefonoContacto.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;

        return (
          <a
            href={urlWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 w-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-900/40 transition-colors block text-center"
          >
            <svg className="w-4 h-4 fill-current inline-block" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            {esAdmin ? 'Abrir chat de WhatsApp con el cliente' : 'Contactar con el Atelier por WhatsApp'}
          </a>
        );
      })()}

      <h3 className="text-lg font-semibold mb-4">Fotos del Trabajo</h3>
      {arrayFotos.length === 0 ? (
          <p className="text-stone-500 text-xs italic mb-4">No hay fotos guardadas en este pedido.</p>
      ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
          {arrayFotos.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 group">
              <img 
                src={img} 
                alt={`Trabajo ${i+1}`} 
                className="w-32 h-32 object-contain bg-stone-950/60 rounded-xl border border-stone-800 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => setFotoAmpliada(img)}
              />
              {esAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setModalConfirm({
                      isOpen: true,
                      text: "¿Estás seguro de que quieres eliminar esta foto?",
                      action: async () => {
                        try {
                          setIsSaving(true);
                          const nuevasFotos = arrayFotos.filter((_, index) => index !== i);
                          const actualizado = { ...pedidoSeleccionado, fotos: nuevasFotos, foto: nuevasFotos[0] || '' };
                          await setDoc(doc(db, "pedidos", String(pedidoSeleccionado.id)), actualizado, { merge: true });
                          setPedidoSeleccionado(actualizado);
                          mostrarToast("Foto eliminada con éxito");
                        } catch (err) {
                          mostrarToast("Error al eliminar la foto");
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    });
                  }}
                  className="absolute top-2 right-2 bg-stone-950/80 text-stone-400 hover:text-red-400 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-stone-800"
                  title="Eliminar foto"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {esAdmin && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          setIsSaving(true);
          try {
            const archivoFoto = e.target.nuevaFotoArchivo.files[0];
            let url = "";
            if (archivoFoto) {
              url = await subirOEncolarFoto(archivoFoto, { coleccion: 'pedidos', documentoId: pedidoSeleccionado.id, campo: 'fotos', agregar: true });
            }
            if (url) {
              const fotosActualizadas = [...arrayFotos, url];
              const actualizado = { ...pedidoSeleccionado, fotos: fotosActualizadas };
              await setDoc(doc(db, "pedidos", String(pedidoSeleccionado.id)), actualizado, { merge: true });
              setPedidoSeleccionado(actualizado);
              e.target.reset();
              mostrarToast("Foto agregada con éxito");
            } else if (archivoFoto) {
              e.target.reset();
              mostrarToast("Foto guardada para sincronizar");
            }
          } catch (err) {
            mostrarToast("Error al agregar foto");
          } finally {
            setIsSaving(false);
          }
        }} onKeyDown={handleKeyDownEnter} className="flex flex-col sm:flex-row gap-2">
          <input name="nuevaFotoArchivo" type="file" accept="image/*" className="w-full bg-stone-900/50 p-2.5 rounded-xl border border-stone-800 outline-none text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer" />
          <button type="submit" className="bg-white text-stone-950 px-4 py-3 sm:py-2 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-stone-200 transition-colors">Agregar Foto</button>
        </form>
      )}
    </div>
  );
}

