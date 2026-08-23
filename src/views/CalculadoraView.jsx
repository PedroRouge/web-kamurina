import React from 'react';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl md:col-span-2">
        <h2 className="text-2xl mb-6 font-light">Calculadora (Tela en Centímetros)</h2>
         
        <div className="mb-4">
          <label className="block text-xs text-stone-400 mb-1">Cargar precio desde Catálogo de Telas (Opcional):</label>
          <select 
            onChange={e => {
              const telaNombre = e.target.value;
              const telaEncontrada = telas.find(t => t.nombre === telaNombre);
              if (telaEncontrada && telaEncontrada.precio) {
                setCalc(prev => ({ ...prev, costoMetro: Number(telaEncontrada.precio) }));
              }
            }}
            className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none text-sm text-white"
          >
            <option value="">Seleccionar tela del catálogo...</option>
            {telas.map(t => <option key={t.id} value={t.nombre}>{t.nombre} {t.precio ? `($${t.precio.toLocaleString()}/m)` : '(Sin precio)'}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <input type="number" min="0" placeholder="Centímetros de tela (cm)" value={calc.cm || ''} onChange={e => setCalc({...calc, cm: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Costo por Metro ($)" value={calc.costoMetro || ''} onChange={e => setCalc({...calc, costoMetro: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Avíos ($)" value={calc.avios || ''} onChange={e => setCalc({...calc, avios: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Horas" value={calc.horas || ''} onChange={e => setCalc({...calc, horas: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Valor Hora ($)" value={calc.valorHora || ''} onChange={e => setCalc({...calc, valorHora: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Margen %" value={calc.margen || ''} onChange={e => setCalc({...calc, margen: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none" />
          <input type="number" min="0" placeholder="Precio Personalizado ($)" value={calc.precioPersonalizado || ''} onChange={e => setCalc({...calc, precioPersonalizado: Number(e.target.value)})} className="bg-stone-950/50 p-3 rounded-xl border border-stone-800 outline-none sm:col-span-2" />
        </div>
        <div className="text-2xl font-bold mb-6 text-center">Total a Cobrar: ${precioFinal.toLocaleString()}</div>
        <form onSubmit={asignarPrecioAPedido} onKeyDown={handleKeyDownEnter} className="border-t border-stone-800 pt-6">
          <label className="block text-sm text-stone-400 mb-2">Asignar a pedido:</label>
          <select name="pedidoId" className="w-full bg-stone-950/50 p-3 rounded-xl border border-stone-800 mb-4 text-white outline-none">
            {pedidosParaCalculadora.map(p => <option key={p.id} value={p.id}>{p.cliente} - {p.prenda}</option>)}
          </select>
          <button type="submit" className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Asignar Precio</button>
        </form>
      </div>

      <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 rounded-3xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-stone-800 pb-2">Resumen de Ganancias</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Costo Materiales:</span>
              <span className="text-white">${materiales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Mano de Obra (Tuya):</span>
              <span className="text-white">${manoObra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-400 border-t border-stone-800/50 pt-2">
              <span>Costo Total:</span>
              <span className="text-white">${costoTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Precio Venta:</span>
              <span className="text-white">${precioFinal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 text-center">
          <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Ganancia Neta Total</span>
          <span className="text-2xl font-bold text-emerald-400">${gananciaNeta.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
