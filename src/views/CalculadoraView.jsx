import React from 'react';
import { parseNumero, formatearMoneda } from '../utils/helpers';

export default function CalculadoraView({
  calc,
  setCalc,
  telas,
  precioFinal,
  materiales,
  manoObra,
  costoTotal,
  gananciaNeta,
  pedidosParaCalculadora,
  asignarPrecioAPedido,
  handleKeyDownEnter
}) {
  const handleChange = (campo, valor) => {
    setCalc(prev => ({
      ...prev,
      [campo]: parseNumero(valor, 0)
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl md:col-span-2">
        <h2 className="text-2xl mb-6 font-light">Calculadora de Presupuestos (Tela en cm)</h2>
         
        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Cargar precio desde Catálogo de Telas (Opcional):</label>
          <select 
            onChange={e => {
              const telaNombre = e.target.value;
              const telaEncontrada = telas.find(t => t.nombre === telaNombre);
              if (telaEncontrada && telaEncontrada.precio) {
                setCalc(prev => ({ ...prev, costoMetro: parseNumero(telaEncontrada.precio, 0) }));
              }
            }}
            className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none text-sm text-white focus:border-stone-500"
          >
            <option value="">Seleccionar tela del catálogo...</option>
            {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre} {t.precio ? `(${formatearMoneda(t.precio)}/m)` : '(Sin precio)'}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Centímetros de tela (cm)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Ej: 150" 
              value={calc.cm || ''} 
              onChange={e => handleChange('cm', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Costo por Metro ($)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Ej: 8500" 
              value={calc.costoMetro || ''} 
              onChange={e => handleChange('costoMetro', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Avíos y Cierres ($)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Ej: 2000" 
              value={calc.avios || ''} 
              onChange={e => handleChange('avios', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Horas estimadas de confección</label>
            <input 
              type="number" 
              min="0" 
              step="0.5"
              placeholder="Ej: 4" 
              value={calc.horas || ''} 
              onChange={e => handleChange('horas', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Valor por Hora ($)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Ej: 5000" 
              value={calc.valorHora || ''} 
              onChange={e => handleChange('valorHora', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div>
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Margen extra (%)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Ej: 20" 
              value={calc.margen || ''} 
              onChange={e => handleChange('margen', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Precio Personalizado / Redondeado ($) (Opcional)</label>
            <input 
              type="number" 
              min="0" 
              placeholder="Deja en blanco para usar el cálculo automático" 
              value={calc.precioPersonalizado || ''} 
              onChange={e => handleChange('precioPersonalizado', e.target.value)} 
              className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500" 
            />
          </div>
        </div>

        <div className="text-2xl font-bold mb-6 text-center text-white bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
          Total a Cobrar: <span className="text-emerald-400">{formatearMoneda(precioFinal)}</span>
        </div>

        <form onSubmit={asignarPrecioAPedido} onKeyDown={handleKeyDownEnter} className="border-t border-stone-800 pt-6">
          <label className="block text-sm text-stone-400 mb-2">Asignar precio calculado a pedido existente:</label>
          {pedidosParaCalculadora.length === 0 ? (
            <p className="text-stone-500 text-xs italic mb-4">No hay pedidos disponibles para asignar precio.</p>
          ) : (
            <>
              <select name="pedidoId" className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 mb-4 text-white outline-none focus:border-stone-500">
                {pedidosParaCalculadora.map(p => <option key={p.id} value={p.id}>{p.cliente} - {p.prenda} ({p.id})</option>)}
              </select>
              <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors">
                Asignar Precio al Pedido
              </button>
            </>
          )}
        </form>
      </div>

      <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-stone-800 pb-2">Desglose de Costos</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Costo Materiales:</span>
              <span className="text-white font-medium">{formatearMoneda(materiales)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Mano de Obra (Tuya):</span>
              <span className="text-white font-medium">{formatearMoneda(manoObra)}</span>
            </div>
            <div className="flex justify-between text-stone-400 border-t border-stone-800/50 pt-2">
              <span>Costo Total:</span>
              <span className="text-white font-medium">{formatearMoneda(costoTotal)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Precio de Venta:</span>
              <span className="text-white font-bold">{formatearMoneda(precioFinal)}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 text-center">
          <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Ganancia Neta Estimada</span>
          <span className="text-2xl font-bold text-emerald-400">{formatearMoneda(gananciaNeta)}</span>
        </div>
      </div>
    </div>
  );
}

