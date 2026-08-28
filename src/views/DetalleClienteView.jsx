import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../services/firebase';
import { MEDIDAS_LISTA } from '../constants/medidas';
import { sonNombresEquivalentes, coincidenTelefonos } from '../utils/clienteMatcher';

export default function DetalleClienteView({
  clienteSeleccionado,
  cambiarVista,
  setModalConfirm,
  borrarCliente,
  pedidos,
  borrarPedidoDefinitivo,
  restaurarPedidoDashboard,
  ocultarPedidoDashboard,
  setFotoAmpliada,
  setIsSaving,
  mostrarToast,
  handleKeyDownEnter,
  subirOEncolarFoto
}) {
  if (!clienteSeleccionado) return null;

  const pedidosDelCliente = pedidos.filter(p => 
    (p.clienteId && (p.clienteId === clienteSeleccionado.id || p.clienteId === clienteSeleccionado.authUid)) || 
    (p.cliente && clienteSeleccionado.nombre && sonNombresEquivalentes(p.cliente, clienteSeleccionado.nombre)) ||
    (p.telefono && clienteSeleccionado.telefono && coincidenTelefonos(p.telefono, clienteSeleccionado.telefono))
  );

  return (
    <>
      {/* 1. AGREGAMOS print:hidden AQUÍ PARA QUE LA APP DESAPAREZCA AL IMPRIMIR Y NO OCUPE ESPACIO */}
      <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl max-w-2xl mx-auto relative print:hidden">
        <button onClick={() => cambiarVista('clientes')} className="absolute top-4 right-4 text-stone-400 hover:text-white">Volver</button>
        <h2 className="text-3xl font-bold mb-1">{clienteSeleccionado.nombre}</h2>
        <p className="text-stone-400 text-sm mb-6">{clienteSeleccionado.telefono}</p>
         
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button onClick={() => cambiarVista('editar-cliente')} className="bg-stone-800 px-4 py-3 sm:py-2 rounded-xl text-sm sm:text-xs border border-stone-700 hover:bg-stone-700 font-medium">Editar Datos y Medidas</button>
          <button onClick={() => window.print()} className="bg-stone-800 px-4 py-3 sm:py-2 rounded-xl text-sm sm:text-xs border border-stone-700 hover:bg-stone-700 font-medium">Imprimir Ficha</button>
          <button 
            onClick={() => borrarCliente(clienteSeleccionado)} 
            className="bg-red-950/40 text-red-400 px-4 py-3 sm:py-2 rounded-xl text-sm sm:text-xs border border-red-900/50 hover:bg-red-900/40 font-medium"
          >
            Eliminar Cliente
          </button>
        </div>

        <h3 className="text-lg font-semibold mb-3">Medidas Registradas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-8 bg-stone-950/50 p-4 rounded-2xl border border-stone-800">
          {MEDIDAS_LISTA.map(m => (
            <div key={m} className="text-stone-300"><strong>{m}:</strong> {clienteSeleccionado.medidas?.[m] || 'N/A'}</div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3">Historial de Pedidos</h3>
        <div className="space-y-4">
          {pedidosDelCliente.length === 0 ? (
            <p className="text-stone-500 text-xs italic">No hay pedidos registrados para este cliente.</p>
          ) : (
            pedidosDelCliente.map(p => {
              const arrayFotos = p.fotos || (p.foto ? [p.foto] : []);
              const esRechazado = p.estado === 'Rechazado';
              return (
                <div key={p.id} className={`bg-stone-950/40 border p-4 rounded-2xl flex flex-col gap-3 relative ${esRechazado ? 'border-red-900/50' : 'border-stone-800'}`}>
                  <button 
                    onClick={() => borrarPedidoDefinitivo(p)} 
                    className="absolute top-4 right-4 text-stone-600 hover:text-red-400 text-xs p-1"
                    title="Eliminar definitivamente"
                  >
                    ✕
                  </button>
                   
                  <div className="flex flex-wrap justify-between items-center pr-6 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold">{p.prenda} (<span className={esRechazado ? "text-red-400" : ""}>{p.estado}</span>)</span>
                      {p.ocultoDashboard ? (
                        <span className="text-[10px] bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-amber-900/40">
                          📦 Archivado del Dashboard
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-900/40">
                          🟢 Visible en Dashboard
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {p.ocultoDashboard ? (
                        <button
                          type="button"
                          onClick={() => restaurarPedidoDashboard && restaurarPedidoDashboard(p.id)}
                          className="text-[10px] font-bold bg-white text-stone-950 px-2.5 py-1 rounded-lg hover:bg-stone-200 transition-colors"
                          title="Volver a mostrar en el Dashboard"
                        >
                          ↩️ Mostrar en Dashboard
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => ocultarPedidoDashboard && ocultarPedidoDashboard(p.id)}
                          className="text-[10px] text-stone-400 hover:text-stone-200 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 transition-colors"
                          title="Quitar solo del Dashboard (Conservar en este historial)"
                        >
                          📦 Quitar del Dashboard
                        </button>
                      )}
                      <span className="text-xs text-stone-400">{p.entrega}</span>
                    </div>
                  </div>

                  {p.descripcionDetalle && (
                    <p className="text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800"><strong>Detalles:</strong> {p.descripcionDetalle}</p>
                  )}

                  {esRechazado && p.motivoRechazo && (
                    <div className="text-xs text-red-200 bg-red-950/40 border border-red-900/50 p-2.5 rounded-xl">
                      <strong className="text-red-400 block mb-0.5">Motivo de rechazo:</strong> {p.motivoRechazo}
                    </div>
                  )}
                   
                  <div className="text-sm font-semibold">{p.precio > 0 ? `$${p.precio.toLocaleString()}` : 'Sin precio asignado'}</div>

                  {arrayFotos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {arrayFotos.map((img, i) => (
                        <div key={i} className="relative flex-shrink-0">
                          <img 
                            src={img} 
                            alt={`Trabajo ${i+1}`} 
                            className="w-24 h-24 object-contain bg-stone-950/60 rounded-xl border border-stone-800 cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => setFotoAmpliada(img)}
                          />
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
                                    const actualizado = { ...p, fotos: nuevasFotos, foto: nuevasFotos[0] || '' };
                                    await setDoc(doc(db, "pedidos", String(p.id)), actualizado, { merge: true });
                                    mostrarToast("Foto eliminada con éxito");
                                  } catch (err) {
                                    mostrarToast("Error al eliminar la foto");
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }
                              });
                            }}
                            className="absolute top-1 right-1 bg-stone-950/80 text-stone-400 hover:text-red-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-stone-800"
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSaving(true);
                    try {
                      const archivoFoto = e.target.nuevaFotoArchivo.files[0];
                      let url = "";
                      if (archivoFoto) {
                        url = await subirOEncolarFoto(archivoFoto, { coleccion: 'pedidos', documentoId: p.id, campo: 'fotos', agregar: true });
                      }
                      if (url) {
                        const fotosActualizadas = [...arrayFotos, url];
                        const actualizado = { ...p, fotos: fotosActualizadas };
                        await setDoc(doc(db, "pedidos", String(p.id)), actualizado, { merge: true });
                        e.target.reset();
                        mostrarToast("Foto agregada");
                      } else if (archivoFoto) {
                        e.target.reset();
                        mostrarToast("Foto guardada para sincronizar");
                      }
                    } catch (err) {
                      mostrarToast("Error al agregar foto");
                    } finally {
                      setIsSaving(false);
                    }
                  }} onKeyDown={handleKeyDownEnter} className="flex flex-col sm:flex-row gap-2 mt-1">
                    <input name="nuevaFotoArchivo" type="file" accept="image/*" className="w-full bg-stone-900/50 p-2 rounded-xl border border-stone-800 outline-none text-xs text-stone-300 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-stone-800 file:text-white hover:file:bg-stone-700 cursor-pointer" />
                    <button type="submit" className="bg-stone-800 px-4 py-2 rounded-xl text-xs border border-stone-700 hover:bg-stone-700 font-medium">Agregar</button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </div>
{/* 2. ESTA ES LA PLANTILLA DE IMPRESIÓN */}
      <div className="print-ficha-exclusiva hidden">
        
        <div className="border-b-2 border-black pb-2 mb-4 print:mt-0 print:pt-0">
          {/* Acá agregué font-serif para darle el toque elegante al título */}
          <h1 className="text-3xl font-serif font-bold tracking-tight text-black">
            ATELIER KAMURINA - FICHA DE CLIENTE
          </h1>
        </div>
        
        {/* Volvimos al texto simple y compacto para el cliente */}
        <div className="mb-4 space-y-1">
          <p className="text-xl font-bold text-black">Cliente: {clienteSeleccionado.nombre}</p>
          <p className="text-sm text-gray-700">Teléfono: {clienteSeleccionado.telefono}</p>
        </div>
        
        <h3 className="text-md font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2 text-black">
          Medidas Registradas
        </h3>
        
        {/* Volvimos al grid original, bien juntito y del mismo tamaño que antes */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-4">
          {MEDIDAS_LISTA.map(m => (
            <div key={m} className="flex justify-between border-b border-gray-200 py-1">
              <span className="text-gray-800 font-medium">{m}:</span>
              <span className="font-bold text-black">{clienteSeleccionado.medidas?.[m] || 'N/A'}</span>
            </div>
          ))}
        </div>

        {/* Sección de Notas con el recuadro que pediste, pero adaptado para que no se pase de hoja */}
        <div className="w-full">
          <h3 className="text-md font-bold text-black mb-2 uppercase tracking-wider">
            Notas:
          </h3>
          {/* h-56 le da una altura enorme pero calculada para que entre perfecto en el A4 */}
          <div className="h-56 w-full border-2 border-dashed border-gray-400 rounded-xl p-4"></div>
        </div>

      </div>
    </>
  );
}