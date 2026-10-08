import React from 'react';
import { formatearMoneda } from '../utils/helpers';

function formatearFecha(ts) {
  if (!ts) return null;
  try {
    return new Date(ts).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return null;
  }
}

export default function GananciasView({
  exportarReportePDF,
  gananciasPorMes,
  setPedidoSeleccionado,
  cambiarVista,
  isPdfExporting,
  pedidosSinPrecio
}) {
  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Ganancias Mensuales</h2>
          <p className="text-stone-400 text-xs mt-1">Pedidos y arreglos con precio asignado</p>
        </div>
        <button
          onClick={exportarReportePDF}
          disabled={isPdfExporting}
          className="bg-white text-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPdfExporting ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generando PDF...
            </>
          ) : (
            <>🖨️ Exportar Reporte (PDF)</>
          )}
        </button>
      </div>

      {pedidosSinPrecio > 0 && (
        <div className="bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs px-4 py-3 rounded-2xl mb-6 flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>
            <strong>{pedidosSinPrecio} pedido{pedidosSinPrecio > 1 ? 's' : ''}</strong> activo{pedidosSinPrecio > 1 ? 's' : ''} sin precio asignado — no se incluyen en este reporte.
          </span>
        </div>
      )}

      {Object.keys(gananciasPorMes).length === 0 ? (
        <p className="text-stone-500 text-center py-10 italic">No hay pedidos ni arreglos con precios asignados.</p>
      ) : (
        <div className="space-y-6 print-ganancias-exclusiva">
          {Object.entries(gananciasPorMes).sort(([a], [b]) => b.localeCompare(a)).map(([mes, datos]) => {
            const nPedidos = datos.pedidos.filter(p => p._tipo === 'pedido').length;
            const nArreglos = datos.pedidos.filter(p => p._tipo === 'arreglo').length;
            const itemsOrdenados = [...datos.pedidos].sort((a, b) => {
              const ta = Number(a.createdAt) || 0;
              const tb = Number(b.createdAt) || 0;
              return tb - ta;
            });

            return (
              <div key={mes} className="bg-stone-950/60 border border-stone-800 p-5 rounded-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-stone-300">Mes: {mes}</h3>
                    <p className="text-xs text-stone-500">
                      {datos.cantidad} item(s)
                      {nPedidos > 0 && ` · ${nPedidos} pedido${nPedidos !== 1 ? 's' : ''}`}
                      {nArreglos > 0 && ` · ${nArreglos} arreglo${nArreglos !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase">Ingresos Totales</span>
                      <span className="text-base font-semibold">{formatearMoneda(datos.ingresos)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase">Ganancia Neta</span>
                      <span className="text-xl font-bold text-emerald-400">{formatearMoneda(datos.ganancia)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {itemsOrdenados.map(p => {
                    const esArreglo = p._tipo === 'arreglo';
                    const fecha = formatearFecha(p.createdAt);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (!esArreglo) {
                            setPedidoSeleccionado(p);
                            cambiarVista('detalle-pedido');
                          } else {
                            cambiarVista('arreglos');
                          }
                        }}
                        className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl cursor-pointer hover:border-stone-600 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-bold text-stone-200">
                              {p.cliente}{esArreglo ? '' : ` — ${p.prenda}`}
                            </span>
                            {esArreglo ? (
                              <>
                                <span className="text-[9px] uppercase px-2 py-0.5 rounded font-bold bg-violet-950 text-violet-300 border border-violet-900/50">
                                  ✂️ Arreglo
                                </span>
                                {p.precio > 0 && (
                                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                                    p.pagado ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50' : 'bg-stone-800 text-stone-300'
                                  }`}>
                                    {p.pagado ? 'Pagado' : 'Pendiente'}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${p.pagado ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50' : 'bg-stone-800 text-stone-300'}`}>
                                {p.pagado ? 'Pagado' : 'Pendiente'}
                              </span>
                            )}
                          </div>
                          {esArreglo && (
                            <p className="text-[11px] text-stone-400 line-clamp-1">{p.prenda}</p>
                          )}
                          <div className="flex items-center gap-3 mt-0.5">
                            {!esArreglo && <p className="text-[11px] text-stone-500">ID: {p.id}</p>}
                            {fecha && <p className="text-[11px] text-stone-500">📅 {fecha}</p>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold">{formatearMoneda(p.precio)}</span>
                          <span className="block text-xs text-emerald-400 font-medium">+{formatearMoneda(p.gananciaPedido)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
