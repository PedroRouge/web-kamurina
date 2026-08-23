import React from 'react';

export default function DetalleAvioView({
  avioSeleccionado,
  cambiarVista
}) {
  if (!avioSeleccionado) return null;

  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl max-w-xl mx-auto relative">
      <button onClick={() => cambiarVista('catalogo-avios')} className="absolute top-4 right-4 text-stone-400 hover:text-white">Volver</button>
      {avioSeleccionado.foto && <img src={avioSeleccionado.foto} alt={avioSeleccionado.nombre} className="w-full h-48 object-cover rounded-2xl mb-6 border border-stone-800" />}
      <h2 className="text-2xl font-bold mb-2">{avioSeleccionado.nombre}</h2>
      <p className="text-stone-400 text-sm mb-2"><strong>Tipo:</strong> {avioSeleccionado.tipo || 'N/A'}</p>
      <p className="text-stone-400 text-sm mb-2"><strong>Centímetros:</strong> {avioSeleccionado.centimetros || 'N/A'}</p>
      <p className="text-stone-400 text-sm mb-2"><strong>Cantidad:</strong> {avioSeleccionado.cantidad || 'N/A'}</p>
      <p className="text-stone-400 text-sm mb-6"><strong>Precio:</strong> {avioSeleccionado.precio ? `$${avioSeleccionado.precio.toLocaleString()}` : 'No especificado'}</p>
      <button onClick={() => cambiarVista('editar-avio')} className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Editar Avío</button>
    </div>
  );
}
