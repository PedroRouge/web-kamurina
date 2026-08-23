import React from 'react';

export default function LoadingOverlay({ isSaving, message = "Guardando..." }) {
  if (!isSaving) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-stone-900 border border-stone-700 px-6 py-4 rounded-2xl text-white text-sm font-bold flex items-center gap-3">
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {message}
      </div>
    </div>
  );
}
