import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] bg-stone-900 border border-stone-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span className="text-xs font-bold">{message}</span>
    </div>
  );
}
