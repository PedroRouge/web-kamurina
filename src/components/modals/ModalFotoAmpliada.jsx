import React, { useEffect } from 'react';

export default function ModalFotoAmpliada({ fotoAmpliada, setFotoAmpliada }) {
  useEffect(() => {
    if (!fotoAmpliada) return;
    const onKey = (e) => { if (e.key === 'Escape') setFotoAmpliada(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fotoAmpliada, setFotoAmpliada]);

  if (!fotoAmpliada) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      onClick={() => setFotoAmpliada(null)}
    >
      <button 
        className="absolute top-4 right-4 text-white bg-stone-900/80 border border-stone-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600/80 transition-colors z-[101] text-lg font-bold shadow-lg"
        onClick={() => setFotoAmpliada(null)}
        aria-label="Cerrar"
      >
        ✕
      </button>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-stone-500 text-xs">Toca fuera de la imagen o presiona Esc para cerrar</p>
      <img 
        src={fotoAmpliada} 
        alt="Foto ampliada" 
        className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl" 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
}
