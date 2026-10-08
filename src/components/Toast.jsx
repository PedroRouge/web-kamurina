import React, { useState, useEffect } from 'react';

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    if (message) {
      setTexto(message);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!texto) return null;

  return (
    <div
      className="fixed top-5 left-1/2 z-[200] -translate-x-1/2 pointer-events-none"
      style={{
        animation: visible
          ? 'toastIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards'
          : 'toastOut 0.2s ease-in forwards',
      }}
    >
      <div className="bg-stone-900 border border-stone-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-xs font-semibold">{texto}</span>
      </div>
    </div>
  );
}
