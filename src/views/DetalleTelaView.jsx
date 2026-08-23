import React from 'react';

export default function DetalleTelaView({
  telaSeleccionada,
  cambiarVista
}) {
  if (!telaSeleccionada) return null;

  return (
    <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-6 md:p-8 rounded-3xl max-w-xl mx-auto relative">
      <button onClick={() => cambiarVista('catalogo')} className="absolute top-4 right-4 text-stone-400 hover:text-white">Volver</button>
      {telaSeleccionada.foto && <img src={telaSeleccionada.foto} alt={telaSeleccionada.nombre} className="w-full h-48 object-cover rounded-2xl mb-6 border border-stone-800" />}
      <h2 className="text-2xl font-bold mb-2">{telaSeleccionada.nombre}</h2>
      <p className="text-stone-400 text-sm mb-2"><strong>Descripción:</strong> {telaSeleccionada.descripcion}</p>
      <p className="text-stone-400 text-sm mb-2"><strong>Uso:</strong> {telaSeleccionada.uso}</p>
      <p className="text-stone-400 text-sm mb-2"><strong>Stock:</strong> {telaSeleccionada.stock}</p>
      <p className="text-stone-400 text-sm mb-6"><strong>Precio por metro:</strong> {telaSeleccionada.precio ? `$${telaSeleccionada.precio.toLocaleString()}` : 'No especificado'}</p>
      <button onClick={() => cambiarVista('editar-tela')} className="w-full bg-white text-stone-950 py-3 rounded-xl font-bold">Editar Tela</button>
    </div>
  );
}
