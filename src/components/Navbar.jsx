import React, { useState } from 'react';

export default function Navbar({
  esAdmin,
  vista,
  cambiarVista,
  totalPedidosActivos,
  ingresosDelMes,
  solicitudesPendientesAdmin,
  handleLogout
}) {
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);

  const navegar = (v) => { cambiarVista(v); setMenuMobileAbierto(false); };

  return (
    <nav className="relative z-10 max-w-6xl mx-auto mb-6 md:mb-12">
      {/* ── MOBILE HEADER ── */}
      <div className="flex md:hidden items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
        <h1
          className="text-xl font-bold tracking-tighter cursor-pointer flex-shrink-0"
          onClick={() => navegar('dashboard')}
        >
          Atelier Kamurina{' '}
          <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded-full ml-1">
            {esAdmin ? 'Admin' : 'Cliente'}
          </span>
        </h1>

        <div className="flex items-center gap-1.5">
          {esAdmin && (
            <>
              <div className="bg-stone-900/80 border border-stone-800 px-2 py-1 rounded-xl flex items-center gap-1">
                <span className="text-[10px] text-stone-400">📦</span>
                <span className="text-xs font-bold text-white">{totalPedidosActivos}</span>
              </div>
              <div
                onClick={() => navegar('solicitudes')}
                className="bg-stone-900/80 border border-amber-950 px-2 py-1 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <span className="text-[10px] text-amber-400">🔔</span>
                <span className="text-xs font-bold text-amber-300">{solicitudesPendientesAdmin.length}</span>
              </div>
            </>
          )}
          {/* Hamburguesa */}
          <button
            onClick={() => setMenuMobileAbierto(v => !v)}
            className="ml-1 p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white transition-colors"
            aria-label="Menú"
          >
            {menuMobileAbierto ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── MENÚ DESPLEGABLE MOBILE ── */}
      {menuMobileAbierto && (
        <div className="md:hidden mt-2 bg-stone-900/95 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="flex flex-col divide-y divide-stone-800/60">
            <button onClick={() => navegar('dashboard')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'dashboard' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
              📋 Mis Pedidos
            </button>
            {esAdmin && (
              <>
                <button onClick={() => navegar('solicitudes')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors flex items-center justify-between ${vista === 'solicitudes' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  <span>🔔 Solicitudes</span>
                  {solicitudesPendientesAdmin.length > 0 && (
                    <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{solicitudesPendientesAdmin.length}</span>
                  )}
                </button>
                <button onClick={() => navegar('clientes')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'clientes' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  👥 Clientes
                </button>
                <button onClick={() => navegar('arreglos')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'arreglos' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  ✂️ Arreglos
                </button>
                <button onClick={() => navegar('catalogo')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'catalogo' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  🧵 Catálogo Telas
                </button>
                <button onClick={() => navegar('catalogo-avios')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'catalogo-avios' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  🪡 Catálogo Avíos
                </button>
                <button onClick={() => navegar('calculadora')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'calculadora' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  🧮 Calculadora
                </button>
                <button onClick={() => navegar('ganancias')} className={`text-left px-5 py-3.5 text-sm font-medium transition-colors ${vista === 'ganancias' ? 'text-white bg-stone-800/60' : 'text-stone-400 hover:text-white hover:bg-stone-800/40'}`}>
                  💰 Ganancias
                </button>
              </>
            )}
            <button onClick={handleLogout} className="text-left px-5 py-3.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-stone-800/40 transition-colors">
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP NAV ── */}
      <div className="hidden md:flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => cambiarVista('dashboard')}>
          Atelier Kamurina{' '}
          <span className="text-xs bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full ml-2">
            {esAdmin ? 'Admin' : 'Cliente'}
          </span>
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-stone-400 font-medium">
          <button onClick={() => cambiarVista('dashboard')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'dashboard' ? 'text-white font-semibold' : ''}`}>Mis Pedidos</button>

          {esAdmin && (
            <>
              <button onClick={() => cambiarVista('solicitudes')} className={`whitespace-nowrap relative inline-flex items-center transition-colors hover:text-stone-200 ${vista === 'solicitudes' ? 'text-white font-semibold' : ''}`}>
                Solicitudes
                {solicitudesPendientesAdmin.length > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{solicitudesPendientesAdmin.length}</span>
                )}
              </button>
              <button onClick={() => cambiarVista('clientes')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'clientes' ? 'text-white font-semibold' : ''}`}>Clientes</button>
              <button onClick={() => cambiarVista('catalogo')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'catalogo' ? 'text-white font-semibold' : ''}`}>Catálogo Telas</button>
              <button onClick={() => cambiarVista('catalogo-avios')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'catalogo-avios' ? 'text-white font-semibold' : ''}`}>Catálogo Avíos</button>
              <button onClick={() => cambiarVista('calculadora')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'calculadora' ? 'text-white font-semibold' : ''}`}>Calculadora</button>
              <button onClick={() => cambiarVista('ganancias')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'ganancias' ? 'text-white font-semibold' : ''}`}>Ganancias</button>
              <button onClick={() => cambiarVista('arreglos')} className={`whitespace-nowrap transition-colors hover:text-stone-200 ${vista === 'arreglos' ? 'text-white font-semibold' : ''}`}>Arreglos</button>
            </>
          )}

          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-xs ml-2 whitespace-nowrap transition-colors">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}
