import React from 'react';
import { formatearMoneda } from '../utils/helpers';

export default function GananciasView({
  exportarReportePDF,
  gananciasPorMes,
  setPedidoSeleccionado,
  cambiarVista
}) {
  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Ganancias Mensuales</h2>
          <p className="text-stone-400 text-xs mt-1">Cálculo de ingresos netos descontando gastos de telas y avíos</p>
        </div>
        <button 
          onClick={exportarReportePDF}
          className="bg-white text-stone-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors shadow-lg"
        >
          🖨️ Exportar Reporte (PDF)
        </button>
      </div>

      {Object.keys(gananciasPorMes).length === 0 ? (
        <p className="text-stone-500 text-center py-10 italic">No hay pedidos con precios asignados para calcular ganancias.</p>
      ) : (
        <div className="space-y-6 print-ganancias-exclusiva">
          {Object.entries(gananciasPorMes).map(([mes, datos]) => (
            <div key={mes} className="bg-stone-950/60 border border-stone-800 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wider text-stone-300">Mes: {mes}</h3>
                  <p className="text-xs text-stone-500">{datos.cantidad} pedido(s) facturado(s)</p>
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

              <div className="space-y-3">
                {datos.pedidos.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => { setPedidoSeleccionado(p); cambiarVista('detalle-pedido'); }}
                    className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-xl cursor-pointer hover:border-stone-600 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-stone-200">{p.cliente} - {p.prenda}</span>
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold ${p.pagado ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50' : 'bg-stone-800 text-stone-300'}`}>
                          {p.pagado ? 'Pagado Total' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">ID: {p.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatearMoneda(p.precio)}</span>
                      <span className="block text-xs text-emerald-400 font-medium">+{formatearMoneda(p.gananciaPedido)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

