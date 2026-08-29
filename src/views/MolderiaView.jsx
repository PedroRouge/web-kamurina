import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CATALOGO_MOLDES } from '../utils/molderiaCatalog';
import { trazarMoldeSeguro } from '../utils/molderiaEngine';

export default function MolderiaView({
  clientes = [],
  clienteInicial = null,
  cambiarVista,
  setClienteSeleccionado,
  mostrarToast
}) {
  const [clienteId, setClienteId] = useState(clienteInicial?.id || (clientes.length > 0 ? clientes[0].id : ''));
  const [moldeId, setMoldeId] = useState('teagan');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [conMargenCostura, setConMargenCostura] = useState(true);
  const [conCotas, setConCotas] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [errorTrazado, setErrorTrazado] = useState(null);
  const [svgRenderizado, setSvgRenderizado] = useState('');

  const svgContainerRef = useRef(null);

  // Cliente activo
  const clienteActivo = useMemo(() => {
    return clientes.find(c => String(c.id) === String(clienteId)) || clienteInicial || null;
  }, [clientes, clienteId, clienteInicial]);

  // Molde activo
  const moldeActivo = useMemo(() => {
    return CATALOGO_MOLDES.find(m => m.id === moldeId) || CATALOGO_MOLDES[0];
  }, [moldeId]);

  // Categorías disponibles
  const categorias = useMemo(() => {
    const setCat = new Set(CATALOGO_MOLDES.map(m => m.categoria));
    return ['Todas', ...Array.from(setCat)];
  }, []);

  // Moldes filtrados por categoría y búsqueda
  const moldesFiltrados = useMemo(() => {
    return CATALOGO_MOLDES.filter(m => {
      const matchCat = filtroCategoria === 'Todas' || m.categoria === filtroCategoria;
      const matchBusqueda = !busqueda || 
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.categoria.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchBusqueda;
    });
  }, [filtroCategoria, busqueda]);

  // Medidas del cliente activo o estándar
  const medidasCliente = useMemo(() => {
    return clienteActivo?.medidas || {};
  }, [clienteActivo]);

  // Validación de medidas requeridas
  const validacion = useMemo(() => {
    const requeridas = moldeActivo?.medidasRequeridas || [];
    if (!clienteActivo) return { esValido: true, faltantes: [], usandoEstandar: true };

    const faltantes = [];
    for (const req of requeridas) {
      if (!medidasCliente[req] || parseFloat(medidasCliente[req]) <= 0) {
        faltantes.push(req);
      }
    }

    return {
      esValido: faltantes.length === 0,
      faltantes,
      usandoEstandar: false
    };
  }, [moldeActivo, clienteActivo, medidasCliente]);

  // Efecto para trazar el molde cuando cambia el molde, cliente o configuraciones
  useEffect(() => {
    setCargando(true);
    setErrorTrazado(null);

    const timer = setTimeout(() => {
      try {
        const svg = trazarMoldeSeguro(moldeActivo.id, medidasCliente, {
          clienteNombre: clienteActivo?.nombre || 'Medida Estándar',
          conMargenCostura,
          conCotas
        });

        setSvgRenderizado(svg);
        setErrorTrazado(null);
      } catch (err) {
        console.error("Error al trazar el molde:", err);
        setErrorTrazado(`Error al generar el patrón: ${err.message || 'Verifique las medidas del cliente.'}`);
      } finally {
        setCargando(false);
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [moldeActivo, clienteActivo, medidasCliente, conMargenCostura, conCotas]);

  // Descargar archivo SVG
  const descargarSVG = () => {
    if (!svgRenderizado) return;
    const blob = new Blob([svgRenderizado], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Patron_${moldeActivo.id}_${clienteActivo?.nombre?.replace(/\s+/g, '_') || 'Cliente'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (mostrarToast) mostrarToast("Archivo SVG del molde descargado correctamente");
  };

  // Imprimir molde a escala 1:1
  const imprimirMolde = () => {
    if (!svgRenderizado) return;
    const ventanaImpresion = window.open('', '_blank');
    if (!ventanaImpresion) {
      if (mostrarToast) mostrarToast("⚠️ Habilita las ventanas emergentes para imprimir");
      return;
    }
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patrón ${moldeActivo.nombre} - ${clienteActivo?.nombre || 'Estándar'}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { font-family: sans-serif; margin: 0; padding: 20px; color: #000; background: #fff; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            p { font-size: 12px; margin-bottom: 16px; color: #555; }
            svg { width: 100%; height: auto; display: block; }
            .header-info { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="header-info">
            <h1>Atelier Kamurina — ${moldeActivo.nombre}</h1>
            <p><strong>Cliente:</strong> ${clienteActivo?.nombre || 'Medidas Estándar'} | <strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ${svgRenderizado}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
  };

  // Ir a editar cliente
  const irAEditarCliente = () => {
    if (clienteActivo && setClienteSeleccionado) {
      setClienteSeleccionado(clienteActivo);
      cambiarVista('editar-cliente');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Encabezado Principal */}
      <div className="bg-stone-900/50 backdrop-blur-md border border-stone-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📐</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Moldería Automática & Graduación</h2>
            <span className="bg-stone-800 text-stone-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-stone-700">
              Patronaje Digital
            </span>
          </div>
          <p className="text-stone-400 text-xs">
            Generador paramétrico de patrones a medida exacta para corte y confección en alta costura.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => cambiarVista('clientes')}
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors font-medium whitespace-nowrap"
          >
            👥 Gestión Clientes
          </button>
        </div>
      </div>

      {/* Panel de Controles: Selector de Cliente y Selector de Molde */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Selección y Parámetros */}
        <div className="lg:col-span-1 space-y-5">
          {/* 1. Selector de Cliente */}
          <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-5 rounded-3xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                1. Seleccionar Cliente
              </label>
              {clienteActivo && (
                <button
                  onClick={irAEditarCliente}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  ✏️ Editar Medidas
                </button>
              )}
            </div>

            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-stone-600 transition-colors"
            >
              {clientes.length === 0 ? (
                <option value="">Medidas Estándar Base</option>
              ) : (
                clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.telefono ? `(${c.telefono})` : ''}
                  </option>
                ))
              )}
            </select>

            {clienteActivo ? (
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Cliente:</span>
                  <span className="font-semibold">{clienteActivo.nombre}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Busto/Pecho:</span>
                  <span>{clienteActivo.medidas?.['Contorno de Busto'] || clienteActivo.medidas?.['Ancho de Pecho'] || '—'} cm</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Cintura:</span>
                  <span>{clienteActivo.medidas?.['Contorno de Cintura'] || '—'} cm</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-500">Cadera:</span>
                  <span>{clienteActivo.medidas?.['Contorno de Cadera'] || '—'} cm</span>
                </div>
              </div>
            ) : (
              <div className="bg-stone-950/40 p-2.5 rounded-xl border border-stone-800 text-[11px] text-stone-500">
                ℹ️ Trazando con proporciones anatómicas estándar base.
              </div>
            )}
          </div>

          {/* 2. Selector de Prenda / Molde */}
          <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-5 rounded-3xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                2. Catálogo de Moldes ({CATALOGO_MOLDES.length})
              </label>
              <span className="text-[10px] text-stone-500">{moldeActivo.genero}</span>
            </div>

            {/* Filtro por Categoría y Buscador */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-300 focus:outline-none"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar molde..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-300 placeholder-stone-600 focus:outline-none"
              />
            </div>

            {/* Selector Desplegable Agrupado */}
            <select
              value={moldeId}
              onChange={(e) => setMoldeId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-stone-600 transition-colors"
            >
              {moldesFiltrados.map(m => (
                <option key={m.id} value={m.id}>
                  {m.icono} {m.nombre} ({m.categoria})
                </option>
              ))}
            </select>

            {/* Ficha descriptiva del molde seleccionado */}
            <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-xs space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span>{moldeActivo.icono}</span>
                <span>{moldeActivo.nombre}</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                {moldeActivo.descripcion}
              </p>
              
              {moldeActivo.piezas && (
                <div className="pt-2 border-t border-stone-900 space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Despiece incluido:</span>
                  <div className="flex flex-wrap gap-1">
                    {moldeActivo.piezas.map((p, idx) => (
                      <span key={idx} className="bg-stone-900 border border-stone-800 text-[10px] text-stone-300 px-2 py-0.5 rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Opciones de Trazado */}
          <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-5 rounded-3xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
              3. Opciones de Trazado
            </label>

            <div className="space-y-2 text-xs text-stone-300">
              <label className="flex items-center gap-2.5 cursor-pointer bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={conMargenCostura}
                  onChange={(e) => setConMargenCostura(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-700 text-white focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="font-medium text-white">Margen de Costura (1 cm)</div>
                  <div className="text-[10px] text-stone-500">Añade línea punteada exterior para corte directo</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={conCotas}
                  onChange={(e) => setConCotas(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-700 text-white focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="font-medium text-white">Cotas y Medidas en Pantalla</div>
                  <div className="text-[10px] text-stone-500">Muestra cotas, hilo de tela y piquetes</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Área de Renderizado SVG y Manejo de Errores */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barra de Acciones del Visor */}
          <div className="bg-stone-900/50 backdrop-blur-md border border-stone-800 p-3 rounded-2xl flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Zoom:</span>
              <button
                onClick={() => setZoom(z => Math.max(0.4, Number((z - 0.15).toFixed(2))))}
                className="bg-stone-800 hover:bg-stone-700 text-white w-7 h-7 rounded-lg text-xs font-bold transition-colors"
                title="Alejar"
              >
                -
              </button>
              <span className="text-xs font-mono text-stone-300 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
                className="bg-stone-800 hover:bg-stone-700 text-white w-7 h-7 rounded-lg text-xs font-bold transition-colors"
                title="Acercar"
              >
                +
              </button>
              <button
                onClick={() => setZoom(1)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded-lg text-xs transition-colors"
                title="Restablecer Zoom"
              >
                100%
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={imprimirMolde}
                disabled={!svgRenderizado || cargando}
                className="bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                🖨️ Imprimir / PDF
              </button>
              <button
                onClick={descargarSVG}
                disabled={!svgRenderizado || cargando}
                className="bg-white hover:bg-stone-200 disabled:opacity-40 text-stone-950 px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                ⬇️ Descargar SVG
              </button>
            </div>
          </div>

          {/* Lienzo Principal del Molde */}
          <div 
            ref={svgContainerRef}
            className="bg-stone-950 border border-stone-800 rounded-3xl p-4 md:p-6 min-h-[550px] flex items-center justify-center relative overflow-hidden shadow-inner"
          >
            {/* Estado de Carga */}
            {cargando && (
              <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-300 text-xs font-medium tracking-wide">
                  Trazando geometría paramétrica para {clienteActivo?.nombre || 'Cliente'}...
                </p>
              </div>
            )}

            {/* Advertencia si faltan medidas del cliente */}
            {!validacion.esValido && clienteActivo && (
              <div className="absolute top-4 right-4 z-10 max-w-xs bg-amber-950/90 border border-amber-500/40 rounded-xl p-3 text-xs space-y-2 backdrop-blur-md">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <span>⚠️</span> Medidas sugeridas:
                </div>
                <p className="text-stone-300 text-[11px]">
                  Falta completar: {validacion.faltantes.join(', ')}. Se trazó con valores estándar para previsualizar.
                </p>
                <button
                  onClick={irAEditarCliente}
                  className="text-amber-400 hover:text-amber-300 underline font-semibold text-[11px]"
                >
                  ✏️ Completar Medidas Ahora
                </button>
              </div>
            )}

            {/* Error en el Trazado */}
            {errorTrazado && (
              <div className="max-w-md w-full bg-red-950/30 border border-red-900/60 rounded-2xl p-6 text-center space-y-3">
                <div className="text-2xl">⚠️</div>
                <h3 className="text-sm font-bold text-red-400">Error en el Cálculo del Patrón</h3>
                <p className="text-stone-400 text-xs leading-relaxed">{errorTrazado}</p>
                <button
                  onClick={irAEditarCliente}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Revisar Medidas del Cliente
                </button>
              </div>
            )}

            {/* Molde Generado Exitosamente */}
            {svgRenderizado && !errorTrazado && !cargando && (
              <div 
                className="w-full flex items-center justify-center transition-transform duration-200 overflow-auto"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                dangerouslySetInnerHTML={{ __html: svgRenderizado }}
              />
            )}
          </div>

          {/* Pie de Información y Consejos de Taller */}
          <div className="bg-stone-900/30 border border-stone-800/80 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-sky-400">●</span>
              <span>Graduación matemática al 100% vectorial con caja de escala 10x10 cm</span>
            </div>
            <div className="text-stone-500">
              💡 Tip: Puedes exportar a SVG para cortar en plotter o abrirlo en Illustrator / Inkscape / Audaces.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
