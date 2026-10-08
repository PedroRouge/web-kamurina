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
    setCalc(prev => ({ ...prev, [campo]: parseNumero(valor, 0) }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

      {/* ── FORMULARIO (col-span-2, segundo en mobile) ── */}
      <div className="order-2 md:order-1 bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl md:col-span-2">
        <h2 className="text-2xl mb-6 font-light">Calculadora de Presupuestos</h2>

        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Cargar precio desde Catálogo de Telas (Opcional):</label>
          <select
            onChange={e => {
              const telaEncontrada = telas.find(t => t.nombre === e.target.value);
              if (telaEncontrada?.precio) setCalc(prev => ({ ...prev, costoMetro: parseNumero(telaEncontrada.precio, 0) }));
            }}
            className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none text-sm text-white focus:border-stone-500"
          >
            <option value="">Seleccionar tela del catálogo...</option>
            {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre} {t.precio ? `(${formatearMoneda(t.precio)}/m)` : '(Sin precio)'}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { campo: 'cm',               label: 'Centímetros de tela (cm)',       placeholder: 'Ej: 150',  step: undefined },
            { campo: 'costoMetro',        label: 'Costo por Metro ($)',            placeholder: 'Ej: 8500', step: undefined },
            { campo: 'avios',             label: 'Avíos y Cierres ($)',            placeholder: 'Ej: 2000', step: undefined },
            { campo: 'horas',             label: 'Horas estimadas de confección',  placeholder: 'Ej: 4',    step: '0.5' },
            { campo: 'valorHora',         label: 'Valor por Hora ($)',             placeholder: 'Ej: 5000', step: undefined },
            { campo: 'margen',            label: 'Margen extra (%)',               placeholder: 'Ej: 20',   step: undefined },
          ].map(({ campo, label, placeholder, step }) => (
            <div key={campo}>
              <label className="text-[11px] text-stone-500 pl-1 block mb-1">{label}</label>
              <input
                type="number"
                min="0"
                step={step}
                placeholder={placeholder}
                value={calc[campo] || ''}
                onChange={e => handleChange(campo, e.target.value)}
                className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none focus:border-stone-500"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-[11px] text-stone-500 pl-1 block mb-1">Precio Personalizado / Redondeado ($) — Opcional</label>
            <input
              type="number"
              min="0"
              placeholder="Dejá en blanco para usar el cálculo automático"
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
              <select name="pedidoId" defaultValue={pedidosParaCalculadora[0]?.id} className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 mb-4 text-white outline-none focus:border-stone-500">
                {pedidosParaCalculadora.map(p => <option key={p.id} value={p.id}>{p.cliente} — {p.prenda} ({p.id})</option>)}
              </select>
              <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors">
                Asignar Precio al Pedido
              </button>
            </>
          )}
        </form>
      </div>

      {/* ── DESGLOSE (primero en mobile, derecha en desktop) ── */}
      <div className="order-1 md:order-2 bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">Desglose de Costos</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Materiales:</span>
              <span className="text-white font-medium">{formatearMoneda(materiales)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Mano de Obra:</span>
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

        <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 text-center mt-auto">
          <span className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Ganancia Neta Estimada</span>
          <span className="text-2xl font-bold text-emerald-400">{formatearMoneda(gananciaNeta)}</span>
        </div>
      </div>

    </div>
  );
}
