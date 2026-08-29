import React from 'react';

export default function Navbar({
  esAdmin,
  vista,
  cambiarVista,
  totalPedidosActivos,
  ingresosDelMes,
  solicitudesPendientesAdmin,
  handleLogout
}) {
  return (
    <nav className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 md:mb-12 gap-4">
      <div className="w-full flex md:hidden items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
        <h1 className="text-xl font-bold tracking-tighter cursor-pointer flex-shrink-0" onClick={() => cambiarVista('dashboard')}>
          Atelier Kamurina {esAdmin ? <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded-full ml-1">Admin</span> : <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded-full ml-1">Cliente</span>}
        </h1>

        {esAdmin && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            <div className="bg-stone-900/80 border border-stone-800 px-2 py-1 rounded-xl flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400">📦</span>
              <span className="text-xs font-bold text-white">{totalPedidosActivos}</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 px-2 py-1 rounded-xl flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400">💰</span>
              <span className="text-xs font-bold text-emerald-400">${ingresosDelMes.toLocaleString()}</span>
            </div>
            <div 
              onClick={() => cambiarVista('solicitudes')}
              className="bg-stone-900/80 border border-amber-950 px-2 py-1 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-[10px] text-amber-400">🔔</span>
              <span className="text-xs font-bold text-amber-300">{solicitudesPendientesAdmin.length}</span>
            </div>
          </div>
        )}
      </div>

      <h1 className="hidden md:block text-2xl font-bold tracking-tighter cursor-pointer self-start" onClick={() => cambiarVista('dashboard')}>
        Atelier Kamurina {esAdmin ? <span className="text-xs bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full ml-2">Admin</span> : <span className="text-xs bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full ml-2">Cliente</span>}
      </h1>

      <div className="flex gap-4 md:gap-8 text-sm text-stone-400 font-medium overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        <button onClick={() => cambiarVista('dashboard')} className={`whitespace-nowrap ${vista === 'dashboard' ? 'text-white' : ''}`}>Mis Pedidos</button>
        
        {esAdmin && (
          <>
            <button onClick={() => cambiarVista('solicitudes')} className={`whitespace-nowrap relative inline-flex items-center ${vista === 'solicitudes' ? 'text-white' : ''}`}>
              <span>Solicitudes</span>
              {solicitudesPendientesAdmin.length > 0 && (
                <span className="ml-2 bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none inline-block">
                  {solicitudesPendientesAdmin.length}
                </span>
              )}
            </button>
            <button onClick={() => cambiarVista('clientes')} className={`whitespace-nowrap ${vista === 'clientes' ? 'text-white' : ''}`}>Clientes</button>
            <button onClick={() => cambiarVista('molderia')} className={`whitespace-nowrap ${vista === 'molderia' ? 'text-white' : ''}`}>Moldería</button>
            <button onClick={() => cambiarVista('catalogo')} className={`whitespace-nowrap ${vista === 'catalogo' ? 'text-white' : ''}`}>Catálogo Telas</button>
            <button onClick={() => cambiarVista('catalogo-avios')} className={`whitespace-nowrap ${vista === 'catalogo-avios' ? 'text-white' : ''}`}>Catálogo Avios</button>
            <button onClick={() => cambiarVista('calculadora')} className={`whitespace-nowrap ${vista === 'calculadora' ? 'text-white' : ''}`}>Calculadora</button>
            <button onClick={() => cambiarVista('ganancias')} className={`whitespace-nowrap ${vista === 'ganancias' ? 'text-white' : ''}`}>Ganancias</button>
          </>
        )}

        <button onClick={handleLogout} className="text-red-400 text-xs ml-auto md:ml-4 whitespace-nowrap">Cerrar sesion</button>
      </div>
    </nav>
  );
}
