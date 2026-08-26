import React, { useState } from 'react';

const ESTADOS_FILTRO = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Eligiendo telas', value: 'Eligiendo telas' },
  { label: 'En confección', value: 'En confección / Pruebas' },
  { label: 'Listo para retirar', value: 'Listo para retirar en el taller' },
  { label: 'En camino', value: 'En camino (Envío a domicilio)' },
  { label: 'Entregado', value: 'Entregado con éxito' },
  { label: 'Rechazados', value: 'Rechazado' },
  { label: '📦 Archivados / Ocultos', value: 'ARCHIVADOS' },
];

export default function DashboardView({
  esAdmin,
  totalPedidosActivos,
  ingresosDelMes,
  solicitudesPendientesAdmin,
  cambiarVista,
  busquedaDashboard,
  setBusquedaDashboard,
  pedidosVisibles,
  setPedidoSeleccionado,
  setModalConfirm,
  ocultarPedidoDashboard,
  restaurarPedidoDashboard,
  borrarPedidoDefinitivo,
  actualizarEstado,
  setFotoAmpliada,
  setModalPago,
  setModalAlias,
  clientes
}) {
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const pedidosFiltrados = pedidosVisibles.filter(p => {
    if (filtroEstado === 'ARCHIVADOS') {
      return Boolean(p.ocultoDashboard);
    }
    if (p.ocultoDashboard) return false;
    if (filtroEstado === 'TODOS') {
      return esAdmin ? p.estado !== 'Rechazado' : true;
    }
    return p.estado === filtroEstado;
  });

  return (
    <div>
      {esAdmin && (
        <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-3xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Pedidos Activos</p>
              <h3 className="text-2xl font-bold text-white">{totalPedidosActivos}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-300 font-bold">📦</div>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-3xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Ingresos Registrados</p>
              <h3 className="text-2xl font-bold text-emerald-400">${ingresosDelMes.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/50 border border-emerald-900/40 flex items-center justify-center text-emerald-300 font-bold">💰</div>
          </div>
          <div 
            onClick={() => cambiarVista('solicitudes')}
            className="bg-stone-900/60 border border-amber-900/40 p-5 rounded-3xl flex items-center justify-between backdrop-blur-md cursor-pointer hover:border-amber-700 transition-colors"
          >
            <div>
              <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Solicitudes Pendientes</p>
              <h3 className="text-2xl font-bold text-amber-300">{solicitudesPendientesAdmin.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-900/50 flex items-center justify-center text-amber-300 font-bold">🔔</div>
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto flex-1">
          <input 
            type="text" 
            placeholder="Buscar pedido por prenda o ID..." 
            value={busquedaDashboard}
            onChange={(e) => setBusquedaDashboard(e.target.value)}
            className="w-full bg-stone-900/50 border border-stone-800 p-4 rounded-2xl outline-none text-sm text-white backdrop-blur-md" 
          />
        </div>
        <button 
          onClick={() => cambiarVista('nuevo-pedido')}
          className="w-full md:w-auto bg-white text-stone-950 px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap hover:bg-stone-200 transition-colors"
        >
          {esAdmin ? '+ Crear Pedido' : '+ Solicitar Pedido'}
        </button>
      </div>

      {/* Chips de filtrado por estado */}
      {esAdmin && (
        <div className="flex gap-2 flex-wrap mb-6">
          {ESTADOS_FILTRO.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFiltroEstado(value)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                filtroEstado === value
                  ? 'bg-white text-stone-950 border-white font-bold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {pedidosFiltrados.length === 0 ? (
          <p className="col-span-full text-stone-500 text-center py-10 italic">
            {filtroEstado === 'ARCHIVADOS' ? 'No hay pedidos ocultos o archivados.' : 'No hay pedidos con ese estado.'}
          </p>
        ) : (
          pedidosFiltrados.map(p => {
            const gastos = p.gastos || 0;
            const gananciaPedido = p.precio > 0 ? (p.precio - gastos) : 0;
            const esRechazado = p.estado === 'Rechazado';
            const arrayFotosCard = p.fotos || (p.foto ? [p.foto] : []);
            return (
              <div 
                key={p.id} 
                onClick={() => { setPedidoSeleccionado(p); cambiarVista('detalle-pedido'); }} 
                className={`bg-stone-900/40 backdrop-blur-md border p-6 rounded-3xl relative cursor-pointer transition-colors ${esRechazado ? 'border-red-900/60 bg-red-950/10' : 'border-stone-800 hover:border-stone-600'}`}
              >
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (esAdmin) {
                      setModalConfirm({ 
                        isOpen: true, 
                        text: `¿Qué deseas hacer con el pedido "${p.prenda}" (${p.id})?`, 
                        buttons: [
                          { 
                            text: "📦 Solo quitar del Dashboard (Queda guardado en el Historial del Cliente)", 
                            action: () => ocultarPedidoDashboard(p.id), 
                            style: "bg-stone-800 text-white hover:bg-stone-700 text-xs py-3" 
                          },
                          { 
                            text: "🗑️ Eliminar definitivamente (Borrar de todo el sistema)", 
                            action: () => borrarPedidoDefinitivo(p.id), 
                            style: "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40 text-xs py-3" 
                          }
                        ]
                      }); 
                    } else {
                      setModalConfirm({ 
                        isOpen: true, 
                        text: `¿Estás seguro de que quieres eliminar el pedido "${p.prenda}"?`, 
                        action: () => borrarPedidoDefinitivo(p.id) 
                      });
                    }
                  }} 
                  className="absolute top-4 right-4 text-stone-600 hover:text-red-400 text-xs p-1"
                  title="Opciones de eliminación / archivo"
                >
                  ✕
                </button>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500">{p.id}</span>
                  <span className={`text-[10px] uppercase px-2 py-1 rounded font-semibold ${
                    esRechazado 
                      ? 'bg-red-950 text-red-400 border border-red-900/50' 
                      : p.estado === 'Pendiente de Aprobación'
                      ? 'bg-amber-950 text-amber-300 border border-amber-900/50'
                      : (p.pagado ? 'bg-emerald-900 text-emerald-300' : 'bg-stone-800 text-stone-300')
                  }`}>
                    {esRechazado ? 'Rechazado' : (p.estado === 'Pendiente de Aprobación' ? 'Pendiente' : (p.pagado ? 'Pagado' : 'Pendiente de Pago'))}
                  </span>
                </div>

                <h3 className="text-lg font-semibold">{esAdmin ? p.cliente : p.prenda}</h3>
                {esAdmin && <p className="text-stone-400 text-sm mb-2">{p.prenda} {p.tela && `(${p.tela})`}</p>}

                {p.ocultoDashboard && (
                  <div className="mb-3 flex items-center justify-between bg-stone-950/80 border border-amber-900/40 px-3 py-2 rounded-xl text-xs">
                    <span className="text-amber-300">📦 Archivado del Dashboard</span>
                    {esAdmin && restaurarPedidoDashboard && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          restaurarPedidoDashboard(p.id);
                        }}
                        className="bg-white text-stone-950 font-bold px-2.5 py-1 rounded-lg text-[11px] hover:bg-stone-200 transition-colors"
                      >
                        Restaurar
                      </button>
                    )}
                  </div>
                )}

                {esAdmin ? (
                  <div onClick={(e) => e.stopPropagation()} className="mb-2">
                    <div className="flex items-center justify-between bg-stone-950/40 border border-stone-800/80 px-3 py-2 rounded-xl text-xs">
                      <span className="text-stone-300">Estado:</span>
                      <select
                        value={p.estado}
                        onChange={(e) => actualizarEstado(p.id, e.target.value)}
                        className="bg-stone-950 border border-stone-700 px-2 py-1 rounded-lg text-xs text-white font-bold outline-none cursor-pointer"
                      >
                        <option value="Eligiendo telas">Eligiendo telas</option>
                        <option value="En confección / Pruebas">En confección / Pruebas</option>
                        <option value="Listo para retirar en el taller">Listo para retirar en el taller</option>
                        <option value="En camino (Envío a domicilio)">En camino (Envío a domicilio)</option>
                        <option value="Entregado con éxito">Entregado con éxito</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-400 text-sm mb-2">Estado: <strong className={esRechazado ? "text-red-400" : (p.estado === 'Pendiente de Aprobación' ? "text-amber-300" : "text-white")}>{p.estado}</strong></p>
                )}

                {p.descripcionDetalle && (
                  <p className="text-xs text-stone-400 mb-2 line-clamp-2">
                    <strong className="text-stone-300">Detalles:</strong> {p.descripcionDetalle}
                  </p>
                )}

                {esRechazado && p.motivoRechazo && (
                  <div className="bg-red-950/40 border border-red-900/50 p-3 rounded-2xl mb-3 text-xs text-red-200">
                    <strong className="text-red-400 block mb-0.5">⚠️ Solicitud Rechazada:</strong>
                    {p.motivoRechazo}
                  </div>
                )}

                {arrayFotosCard.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                    {arrayFotosCard.map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Pedido" 
                        className="w-16 h-16 object-contain bg-stone-950/60 rounded-xl mb-1 border border-stone-800 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={(e) => { e.stopPropagation(); setFotoAmpliada(img); }}
                      />
                    ))}
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-xl font-bold">{p.precio > 0 ? `$${p.precio.toLocaleString()}` : 'Presupuesto a confirmar'}</p>
                  {esAdmin && p.precio > 0 && (
                    <p className="text-xs text-emerald-400 font-medium">Ganancia: +${gananciaPedido.toLocaleString()}</p>
                  )}
                </div>

                {esAdmin && p.precio > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPago({ isOpen: true, pedidoId: p.id });
                    }}
                    className="mb-3 w-full bg-stone-800 hover:bg-stone-700 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                  >
                    💳 Registrar Pago
                  </button>
                )}

                {!esAdmin && p.precio > 0 && !p.pagado && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalAlias({ isOpen: true, pedido: p });
                    }}
                    className="mb-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                  >
                    💳 Pagar (Ver Alias)
                  </button>
                )}

                {(() => {
                  const telefonoContacto = esAdmin
                    ? p.telefono || (clientes.find(c => (p.clienteId && c.id === p.clienteId) || (c.nombre && p.cliente && c.nombre.toLowerCase() === p.cliente.toLowerCase()))?.telefono)
                    : '3435302448';
                  if (!telefonoContacto) return null;
                  const mensaje = esAdmin 
                    ? `Hola ${p.cliente}, te escribo desde Atelier Kamurina por tu pedido de ${p.prenda} para coordinar detalles y fotos.` 
                    : `Hola, le escribo por mi pedido de ${p.prenda} (${p.id}) en Atelier Kamurina.`;
                  const urlWhatsapp = `https://wa.me/${telefonoContacto.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;

                  return (
                    <a
                      href={urlWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-900/40 transition-colors"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      {esAdmin ? 'Coordinar por WhatsApp' : 'Contactar por WhatsApp'}
                    </a>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
