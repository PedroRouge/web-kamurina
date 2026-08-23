import React, { useState } from 'react';
import { DATOS_BANCARIOS } from '../../constants/config';

function CopyButton({ text, mostrarToast }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      if (mostrarToast) mostrarToast('¡Copiado al portapapeles!');
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback para navegadores sin soporte
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`ml-2 text-[10px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
        copiado
          ? 'bg-emerald-900/60 border-emerald-700 text-emerald-300'
          : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white hover:border-stone-500'
      }`}
    >
      {copiado ? '✓ Copiado' : 'Copiar'}
    </button>
  );
}

export default function ModalAlias({ modalAlias, setModalAlias, mostrarToast }) {
  if (!modalAlias.isOpen || !modalAlias.pedido) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-stone-900 border border-stone-800 p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center">
        <h3 className="text-xl font-bold mb-1 text-white">Datos para Transferencia</h3>
        <p className="text-stone-400 text-xs mb-6">Realiza el pago con el presupuesto asignado para tu pedido ({modalAlias.pedido.id}).</p>
         
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left space-y-4 mb-6">
          <div>
            <span className="text-[10px] uppercase text-stone-500 block mb-1">Alias de pago:</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400 select-all">{DATOS_BANCARIOS.alias}</span>
              <CopyButton text={DATOS_BANCARIOS.alias} mostrarToast={mostrarToast} />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase text-stone-500 block mb-1">CVU / CBU:</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-stone-200 select-all break-all">{DATOS_BANCARIOS.cbu}</span>
              <CopyButton text={DATOS_BANCARIOS.cbu} mostrarToast={mostrarToast} />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase text-stone-500 block">Titular:</span>
            <span className="text-xs text-stone-300">{DATOS_BANCARIOS.titular}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-stone-500 block">Monto Total a Pagar:</span>
            <span className="text-sm font-bold text-white">${modalAlias.pedido.precio ? modalAlias.pedido.precio.toLocaleString() : 0}</span>
          </div>
        </div>

        <p className="text-[11px] text-stone-400 mb-6 italic">Una vez realizada la transferencia, puedes notificar o enviar el comprobante por WhatsApp al taller.</p>

        <button 
          onClick={() => setModalAlias({ isOpen: false, pedido: null })}
          className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
        >
          Entendido / Cerrar
        </button>
      </div>
    </div>
  );
}
