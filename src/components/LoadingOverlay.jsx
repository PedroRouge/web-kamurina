import React from 'react';

// Solo se muestra para operaciones realmente lentas (ej: subida de foto a Cloudinary).
// Para guardados simples de Firestore, usar el estado `guardando` local en el botón.
export default function LoadingOverlay({ isSaving, message = 'Guardando...' }) {
  if (!isSaving) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-[2px] flex items-end justify-center pb-10 pointer-events-none">
      <div className="bg-stone-900/95 border border-stone-700 px-5 py-3 rounded-2xl text-white text-xs font-semibold flex items-center gap-2.5 shadow-2xl">
        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
        {message}
      </div>
    </div>
  );
}
