/**
 * Kamurina Parametric Pattern Drafting Engine
 * Generador matemático de moldería industrial y a medida.
 * Calcula curvas Bézier, cotas, piquetes, márgenes de costura y cajas de escala.
 */

// Utilidad para formatear números
const f = (n) => (typeof n === 'number' ? n.toFixed(1) : n);

/**
 * Genera el encabezado SVG con estilos de patronaje industrial
 */
function wrapSvg(content, width, height) {
  const margin = 40;
  const viewBoxW = Math.max(width + margin * 2, 400);
  const viewBoxH = Math.max(height + margin * 2, 400);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(viewBoxW)} ${f(viewBoxH)}" width="100%" height="100%" class="freesewing-pattern-svg w-full h-auto">
  <defs>
    <style>
      .cut-line { fill: none; stroke: #38bdf8; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
      .seam-line { fill: none; stroke: #94a3b8; stroke-width: 1.2; stroke-dasharray: 4, 3; }
      .fold-line { fill: none; stroke: #fbbf24; stroke-width: 1.5; stroke-dasharray: 8, 3, 2, 3; }
      .grain-line { fill: none; stroke: #a855f7; stroke-width: 1.5; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #ef4444; stroke-width: 2; }
      .text-label { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 13px; font-weight: bold; fill: #f1f5f9; }
      .text-sub { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 10px; fill: #94a3b8; }
      .dimension-line { stroke: #64748b; stroke-width: 0.8; stroke-dasharray: 2, 2; }
      .scale-box { fill: #1e293b; stroke: #38bdf8; stroke-width: 1.5; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#a855f7"/>
    </marker>
  </defs>
  
  <rect width="100%" height="100%" fill="#0c0a09" rx="16" />
  <g transform="translate(${margin}, ${margin})">
    ${content}
  </g>
</svg>`;
}

/**
 * Dibuja un rótulo de pieza profesional
 */
function rotulo(x, y, pieza, prenda, cliente, cortar = 'Cortar 2x (Par)') {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="-10" y="-14" width="180" height="64" rx="6" fill="#1c1917" stroke="#44403c" stroke-width="1" opacity="0.9" />
      <text class="text-label" x="0" y="4">${pieza}</text>
      <text class="text-sub" x="0" y="20">${prenda} • ${cliente}</text>
      <text class="text-sub" x="0" y="34" fill="#38bdf8">${cortar} • Costura: 1 cm</text>
    </g>
  `;
}

/**
 * Dibuja una línea de hilo de tela
 */
function hiloTela(x, y1, y2) {
  return `
    <g>
      <line x1="${f(x)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y2)}" class="grain-line" />
      <text class="text-sub" x="${f(x + 6)}" y="${f((y1 + y2) / 2)}" fill="#c084fc" font-size="9" transform="rotate(90 ${f(x + 6)} ${f((y1 + y2) / 2)})">HILO DE TELA</text>
    </g>
  `;
}

/**
 * Dibuja una caja de calibración de 10x10 cm (100x100 unidades en escala 1:1 cm)
 */
function cajaCalibracion(x, y) {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="0" y="0" width="70" height="70" class="scale-box" />
      <text x="35" y="28" text-anchor="middle" class="text-label" font-size="10" fill="#38bdf8">10 x 10 cm</text>
      <text x="35" y="44" text-anchor="middle" class="text-sub" font-size="8">TEST ESCALA</text>
      <text x="35" y="56" text-anchor="middle" class="text-sub" font-size="7" fill="#64748b">Imprimir al 100%</text>
    </g>
  `;
}

/**
 * Generadores especializados por categoría
 */
export const GENERADORES_MOLDES = {
  // 1. Remera Clásica (Delantero + Espalda + Manga)
  remera: (m, cliente) => {
    const pecho = (m.busto || m.pecho || 96) / 4 + 2;
    const largo = m.largoTalle || m.largoTotal || 65;
    const hombro = (m.espalda || 40) / 2;
    const caidaHombro = 3.5;
    const sisa = (m.busto || 96) / 4 + 1;
    const escoteAncho = (m.cuello || 38) / 6 + 1.5;
    const escoteProfDel = (m.cuello || 38) / 6 + 3.5;
    const escoteProfEsp = 2.5;

    // Delantero
    const delPath = `M 0,${f(escoteProfDel)} 
      Q ${f(escoteAncho * 0.4)},${f(escoteProfDel)} ${f(escoteAncho)},0 
      L ${f(hombro)},${f(caidaHombro)} 
      Q ${f(hombro - 1.5)},${f(sisa * 0.6)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho)},${f(largo)} 
      L 0,${f(largo)} Z`;

    // Espalda (Desplazada)
    const espOffX = pecho + 40;
    const espPath = `M ${f(espOffX)},${f(escoteProfEsp)} 
      Q ${f(espOffX + escoteAncho * 0.5)},${f(escoteProfEsp)} ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + hombro)},${f(caidaHombro)} 
      Q ${f(espOffX + hombro - 0.5)},${f(sisa * 0.6)} ${f(espOffX + pecho)},${f(sisa)} 
      L ${f(espOffX + pecho)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    // Manga
    const mangaOffX = espOffX + pecho + 40;
    const mangaAncho = (m.brazo || 32) + 4;
    const mangaLargo = m.largoManga || 22;
    const mangaCopa = 12;
    const mangaPath = `M ${f(mangaOffX + mangaAncho / 2)},0 
      Q ${f(mangaOffX + mangaAncho * 0.85)},0 ${f(mangaOffX + mangaAncho)},${f(mangaCopa)} 
      L ${f(mangaOffX + mangaAncho * 0.9)},${f(mangaLargo + mangaCopa)} 
      L ${f(mangaOffX + mangaAncho * 0.1)},${f(mangaLargo + mangaCopa)} 
      L ${f(mangaOffX)},${f(mangaCopa)} 
      Q ${f(mangaOffX + mangaAncho * 0.15)},0 ${f(mangaOffX + mangaAncho / 2)},0 Z`;

    const content = `
      <!-- DELANTERO -->
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(pecho * 0.25, largo * 0.45, 'DELANTERO', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(pecho * 0.35, sisa + 10, largo - 15)}
        <text class="text-sub" x="4" y="${f(largo / 2)}" fill="#fbbf24">DOBLEZ DE TELA</text>
      </g>

      <!-- ESPALDA -->
      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + pecho * 0.25, largo * 0.45, 'ESPALDA', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pecho * 0.35, sisa + 10, largo - 15)}
        <text class="text-sub" x="${f(espOffX + 4)}" y="${f(largo / 2)}" fill="#fbbf24">DOBLEZ DE TELA</text>
      </g>

      <!-- MANGA -->
      <g>
        <path d="${mangaPath}" class="cut-line" />
        ${rotulo(mangaOffX + 5, mangaLargo * 0.5, 'MANGA CORTA', 'Remera Básica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(mangaOffX + mangaAncho / 2, mangaCopa + 5, mangaLargo + mangaCopa - 5)}
      </g>

      ${cajaCalibracion(mangaOffX, largo - 70)}
    `;

    return wrapSvg(content, mangaOffX + mangaAncho + 20, largo + 20, 'Remera Básica', cliente.nombre);
  },

  // 2. Musculosa / Top sin mangas
  musculosa: (m, cliente) => {
    const pecho = (m.busto || m.pecho || 92) / 4 + 1;
    const largo = m.largoTalle || 58;
    const hombro = ((m.espalda || 38) / 2) * 0.65;
    const caidaHombro = 3;
    const sisa = (m.busto || 92) / 4 + 4; // Sisa más cavada
    const escoteAncho = (m.cuello || 36) / 6 + 3.5;
    const escoteProfDel = (m.cuello || 36) / 6 + 7;
    const escoteProfEsp = 4;

    // Delantero
    const delPath = `M 0,${f(escoteProfDel)} 
      Q ${f(escoteAncho * 0.4)},${f(escoteProfDel)} ${f(escoteAncho)},0 
      L ${f(escoteAncho + hombro)},${f(caidaHombro)} 
      Q ${f(escoteAncho + hombro - 2)},${f(sisa * 0.65)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho - 1)},${f(largo)} 
      L 0,${f(largo)} Z`;

    // Espalda
    const espOffX = pecho + 40;
    const espPath = `M ${f(espOffX)},${f(escoteProfEsp)} 
      Q ${f(espOffX + escoteAncho * 0.4)},${f(escoteProfEsp)} ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + escoteAncho + hombro)},${f(caidaHombro)} 
      Q ${f(espOffX + escoteAncho + hombro - 1)},${f(sisa * 0.65)} ${f(espOffX + pecho)},${f(sisa)} 
      L ${f(espOffX + pecho - 1)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(pecho * 0.2, largo * 0.45, 'DELANTERO', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(pecho * 0.4, sisa + 5, largo - 15)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + pecho * 0.2, largo * 0.45, 'ESPALDA', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pecho * 0.4, sisa + 5, largo - 15)}
      </g>

      ${cajaCalibracion(espOffX + pecho + 30, largo - 70)}
    `;

    return wrapSvg(content, espOffX + pecho + 120, largo + 20, 'Musculosa Top', cliente.nombre);
  },

  // 3. Falda Evasé / Tubo con pinzas
  falda: (m, cliente) => {
    const cintura = (m.cintura || 70) / 4;
    const cadera = (m.cadera || 96) / 4 + 1;
    const altoCadera = m.altoCadera || 20;
    const largo = m.largoFalda || 55;
    const vueloEvase = 6;

    // Delantero
    const pinzaDelX = cintura * 0.6;
    const pinzaDelAncho = 2;
    const pinzaDelLargo = 9;

    const delPath = `M 0,0 
      L ${f(pinzaDelX - pinzaDelAncho / 2)},0 
      L ${f(pinzaDelX)},${f(pinzaDelLargo)} 
      L ${f(pinzaDelX + pinzaDelAncho / 2)},0 
      L ${f(cintura + pinzaDelAncho)},0 
      Q ${f(cadera + 1)},${f(altoCadera * 0.7)} ${f(cadera)},${f(altoCadera)} 
      L ${f(cadera + vueloEvase)},${f(largo)} 
      Q ${f((cadera + vueloEvase) / 2)},${f(largo + 1)} 0,${f(largo)} Z`;

    // Trasero (con margen de cierre y pinza más profunda)
    const trasOffX = cadera + vueloEvase + 40;
    const pinzaTrasX = cintura * 0.5;
    const pinzaTrasAncho = 3;
    const pinzaTrasLargo = 12;

    const trasPath = `M ${f(trasOffX)},0 
      L ${f(trasOffX + pinzaTrasX - pinzaTrasAncho / 2)},0 
      L ${f(trasOffX + pinzaTrasX)},${f(pinzaTrasLargo)} 
      L ${f(trasOffX + pinzaTrasX + pinzaTrasAncho / 2)},0 
      L ${f(trasOffX + cintura + pinzaTrasAncho)},0 
      Q ${f(trasOffX + cadera + 1)},${f(altoCadera * 0.7)} ${f(trasOffX + cadera)},${f(altoCadera)} 
      L ${f(trasOffX + cadera + vueloEvase)},${f(largo)} 
      Q ${f(trasOffX + (cadera + vueloEvase) / 2)},${f(largo + 1)} ${f(trasOffX)},${f(largo)} Z`;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(cadera * 0.2, largo * 0.45, 'FALDA DELANTERO', 'Falda Evasé', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(cadera * 0.4, altoCadera + 10, largo - 15)}
        <text class="text-sub" x="4" y="${f(largo / 2)}" fill="#fbbf24">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cadera * 0.2, largo * 0.45, 'FALDA TRASERO', 'Falda Evasé', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + cadera * 0.4, altoCadera + 10, largo - 15)}
        <text class="text-sub" x="${f(trasOffX + 4)}" y="${f(largo * 0.2)}" fill="#38bdf8">CIERRE Y CENTRO ESPALDA</text>
      </g>

      ${cajaCalibracion(trasOffX + cadera + vueloEvase + 30, largo - 70)}
    `;

    return wrapSvg(content, trasOffX + cadera + vueloEvase + 120, largo + 20, 'Falda Evasé', cliente.nombre);
  },

  // 4. Pantalón Recto / Palazzo
  pantalon: (m, cliente) => {
    const cintura = (m.cintura || 74) / 4;
    const cadera = (m.cadera || 100) / 4 + 1.5;
    const tiro = m.tiro || 26;
    const largo = m.largoPantalon || 95;
    const anchoBota = 22;
    const avanceTiroDel = (cadera * 0.15);
    const avanceTiroTras = (cadera * 0.35);

    // Delantero
    const delPath = `M 0,0 
      L ${f(cintura)},0 
      Q ${f(cadera)},${f(tiro * 0.6)} ${f(cadera)},${f(tiro)} 
      L ${f(anchoBota + 5)},${f(largo)} 
      L 0,${f(largo)} 
      L ${f(-avanceTiroDel)},${f(tiro)} 
      Q ${f(-avanceTiroDel * 0.4)},${f(tiro * 0.6)} 0,0 Z`;

    // Trasero
    const trasOffX = cadera + anchoBota + 60;
    const trasPath = `M ${f(trasOffX)},3 
      L ${f(trasOffX + cintura + 2)},0 
      Q ${f(trasOffX + cadera + 1)},${f(tiro * 0.6)} ${f(trasOffX + cadera + 1)},${f(tiro)} 
      L ${f(trasOffX + anchoBota + 7)},${f(largo)} 
      L ${f(trasOffX - 2)},${f(largo)} 
      L ${f(trasOffX - avanceTiroTras)},${f(tiro + 1)} 
      Q ${f(trasOffX - avanceTiroTras * 0.4)},${f(tiro * 0.5)} ${f(trasOffX)},3 Z`;

    const content = `
      <g transform="translate(${f(avanceTiroDel + 10)}, 0)">
        <path d="${delPath}" class="cut-line" />
        ${rotulo(cintura * 0.1, largo * 0.4, 'PANTALÓN DELANTERO', 'Pantalón Palazzo', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(cadera * 0.4, tiro + 10, largo - 20)}
      </g>

      <g transform="translate(${f(avanceTiroDel + 10)}, 0)">
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cintura * 0.1, largo * 0.4, 'PANTALÓN TRASERO', 'Pantalón Palazzo', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + cadera * 0.4, tiro + 10, largo - 20)}
      </g>

      ${cajaCalibracion(trasOffX + cadera + anchoBota + 40, largo - 70)}
    `;

    return wrapSvg(content, trasOffX + cadera + anchoBota + 130, largo + 20, 'Pantalón Palazzo', cliente.nombre);
  },

  // 5. Corset / Bustier Anatómico
  corset: (m, cliente) => {
    const busto = (m.busto || 90) / 4;
    const cintura = (m.cintura || 68) / 4;
    const altoBusto = m.altoBusto || 25;
    const largo = 36; // Altura total corset

    // Centro Delantero
    const p1W = busto * 0.45;
    const p1Cint = cintura * 0.4;
    const p1Path = `M 0,0 
      L ${f(p1W)},0 
      Q ${f(p1W - 0.5)},${f(altoBusto * 0.6)} ${f(p1Cint)},${f(altoBusto)} 
      L ${f(p1Cint - 0.5)},${f(largo)} 
      L 0,${f(largo - 2)} Z`;

    // Lateral Delantero
    const p2OffX = p1W + 25;
    const p2W = busto * 0.55;
    const p2Cint = cintura * 0.5;
    const p2Path = `M ${f(p2OffX)},0 
      Q ${f(p2OffX + p2W * 0.6)},-2 ${f(p2OffX + p2W)},0 
      L ${f(p2OffX + p2Cint + 2)},${f(largo)} 
      L ${f(p2OffX)},${f(largo)} 
      Q ${f(p2OffX + 1)},${f(altoBusto * 0.6)} ${f(p2OffX)},0 Z`;

    // Espalda Lateral
    const p3OffX = p2OffX + p2W + 25;
    const p3W = busto * 0.48;
    const p3Cint = cintura * 0.45;
    const p3Path = `M ${f(p3OffX)},2 
      L ${f(p3OffX + p3W)},0 
      L ${f(p3OffX + p3Cint)},${f(largo)} 
      L ${f(p3OffX)},${f(largo)} Z`;

    // Espalda Centro (Para ojalillos)
    const p4OffX = p3OffX + p3W + 25;
    const p4W = busto * 0.45;
    const p4Cint = cintura * 0.42;
    const p4Path = `M ${f(p4OffX)},0 
      L ${f(p4OffX + p4W)},0 
      L ${f(p4OffX + p4Cint)},${f(largo - 2)} 
      L ${f(p4OffX)},${f(largo)} Z`;

    const content = `
      <g>
        <path d="${p1Path}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo - 2)}" class="fold-line" />
        ${rotulo(5, largo * 0.4, 'CENTRO DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(p1W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p2Path}" class="cut-line" />
        ${rotulo(p2OffX + 5, largo * 0.4, 'LATERAL DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p2OffX + p2W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p3Path}" class="cut-line" />
        ${rotulo(p3OffX + 5, largo * 0.4, 'LATERAL ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p3OffX + p3W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p4Path}" class="cut-line" />
        ${rotulo(p4OffX + 5, largo * 0.4, 'CENTRO ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Ojalillos)')}
        ${hiloTela(p4OffX + p4W * 0.5, 6, largo - 10)}
      </g>

      ${cajaCalibracion(p4OffX + p4W + 30, largo - 60)}
    `;

    return wrapSvg(content, p4OffX + p4W + 120, largo + 30, 'Corset Bustier', cliente.nombre);
  },

  // 6. Camisa con Cuello y Pie de Cuello
  camisa: (m, cliente) => {
    const pecho = (m.pecho || m.busto || 100) / 4 + 3; // Con holgura
    const largo = m.largoTalle || 72;
    const hombro = (m.espalda || 42) / 2 + 1;
    const sisa = (m.pecho || 100) / 4 + 2;
    const escoteAncho = (m.cuello || 40) / 6 + 1.5;

    // Delantero con cruce de botones (1.5 cm)
    const delPath = `M -2,7 
      Q ${f(escoteAncho * 0.3)},6 ${f(escoteAncho)},0 
      L ${f(hombro)},3.5 
      Q ${f(hombro - 1)},${f(sisa * 0.6)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho)},${f(largo)} 
      L -2,${f(largo)} Z`;

    // Espalda
    const espOffX = pecho + 40;
    const espPath = `M ${f(espOffX)},2.5 
      Q ${f(espOffX + escoteAncho * 0.4)},2 ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + hombro)},3.5 
      Q ${f(espOffX + hombro - 0.5)},${f(sisa * 0.6)} ${f(espOffX + pecho)},${f(sisa)} 
      L ${f(espOffX + pecho)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    // Cuello camisero y pie
    const cuelloLargo = (m.cuello || 40) / 2 + 1.5;
    const cuelloOffX = espOffX + pecho + 40;
    const piePath = `M ${f(cuelloOffX)},0 L ${f(cuelloOffX + cuelloLargo - 1.5)},0 Q ${f(cuelloOffX + cuelloLargo)},1.5 ${f(cuelloOffX + cuelloLargo)},3.5 L ${f(cuelloOffX)},3.5 Z`;
    const cuelloPath = `M ${f(cuelloOffX)},7 L ${f(cuelloOffX + cuelloLargo + 1.5)},6 L ${f(cuelloOffX + cuelloLargo - 0.5)},11 L ${f(cuelloOffX)},11 Z`;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <line x1="0" y1="0" x2="0" y2="${f(largo)}" class="seam-line" />
        ${rotulo(pecho * 0.2, largo * 0.4, 'DELANTERO CON CARTERA', 'Camisa Clásica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(pecho * 0.4, sisa + 10, largo - 20)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + pecho * 0.2, largo * 0.4, 'ESPALDA', 'Camisa Clásica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pecho * 0.4, sisa + 10, largo - 20)}
      </g>

      <g>
        <path d="${piePath}" class="cut-line" />
        <path d="${cuelloPath}" class="cut-line" />
        ${rotulo(cuelloOffX, 18, 'CUELLO Y PIE DE CUELLO', 'Camisa Clásica', cliente.nombre, 'Cortar 2x + Entretela')}
      </g>

      ${cajaCalibracion(cuelloOffX, largo - 70)}
    `;

    return wrapSvg(content, cuelloOffX + cuelloLargo + 50, largo + 20, 'Camisa Clásica', cliente.nombre);
  },

  // 7. Buzo con Capucha (Hoodie)
  hoodie: (m, cliente) => {
    const pecho = (m.pecho || m.busto || 96) / 4 + 6; // Holgura deportiva
    const largo = m.largoTalle || 68;
    const hombro = (m.espalda || 40) / 2 + 3;
    const sisa = (m.pecho || 96) / 4 + 4;
    const escoteAncho = (m.cuello || 38) / 6 + 2.5;

    // Delantero
    const delPath = `M 0,8 
      Q ${f(escoteAncho * 0.4)},8 ${f(escoteAncho)},0 
      L ${f(hombro)},4 
      Q ${f(hombro - 1)},${f(sisa * 0.6)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho)},${f(largo)} 
      L 0,${f(largo)} Z`;

    // Capucha
    const capOffX = pecho + 40;
    const capW = 28;
    const capH = 38;
    const capPath = `M ${f(capOffX)},${f(capH)} 
      L ${f(capOffX + capW * 0.6)},${f(capH - 1)} 
      Q ${f(capOffX + capW)},${f(capH - 4)} ${f(capOffX + capW)},${f(capH * 0.5)} 
      Q ${f(capOffX + capW)},0 ${f(capOffX + capW * 0.4)},0 
      L ${f(capOffX)},0 Z`;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(pecho * 0.2, largo * 0.4, 'CUERPO DELANTERO / ESPALDA', 'Buzo Hoodie', cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(pecho * 0.4, sisa + 10, largo - 20)}
      </g>

      <g>
        <path d="${capPath}" class="cut-line" />
        ${rotulo(capOffX + 2, capH * 0.4, 'CAPUCHA FORRADA', 'Buzo Hoodie', cliente.nombre, 'Cortar 4x (2x Tela + 2x Forro)')}
        ${hiloTela(capOffX + capW * 0.5, 5, capH - 10)}
      </g>

      ${cajaCalibracion(capOffX + capW + 30, largo - 70)}
    `;

    return wrapSvg(content, capOffX + capW + 120, largo + 20, 'Buzo Hoodie', cliente.nombre);
  }
};

/**
 * Trazador Principal y Universal de Moldería
 */
export function trazarMoldeSeguro(tipoMoldeId, medidasCliente = {}, opciones = {}) {
  // Extraer medidas normalizadas en cm
  const m = {
    pecho: parseFloat(medidasCliente['Ancho de Pecho']) || parseFloat(medidasCliente['Contorno de Busto']) || 96,
    busto: parseFloat(medidasCliente['Contorno de Busto']) || 94,
    cintura: parseFloat(medidasCliente['Contorno de Cintura']) || 72,
    cadera: parseFloat(medidasCliente['Contorno de Cadera']) || 98,
    espalda: parseFloat(medidasCliente['Ancho de Espalda']) || 38,
    cuello: parseFloat(medidasCliente['Contorno de Cuello']) || 37,
    largoTalle: parseFloat(medidasCliente['Largo de Talle']) || parseFloat(medidasCliente['Largo de Espalda']) || 62,
    largoManga: parseFloat(medidasCliente['Largo de Manga']) || 58,
    brazo: parseFloat(medidasCliente['Contorno de Brazo']) || 30,
    largoPantalon: parseFloat(medidasCliente['Largo de Pantalón']) || 98,
    tiro: parseFloat(medidasCliente['Altura de Tiro']) || 26,
    altoCadera: parseFloat(medidasCliente['Altura de Cadera']) || 20,
    altoBusto: parseFloat(medidasCliente['Altura de Busto']) || 26,
    bajoBusto: parseFloat(medidasCliente['Bajo Busto']) || 76,
    largoFalda: parseFloat(medidasCliente['Largo de Falda']) || 58
  };

  const cliente = {
    nombre: opciones.clienteNombre || 'Cliente'
  };

  // Mapear el ID del molde a su generador geométrico
  const id = String(tipoMoldeId).toLowerCase();

  if (id.includes('pantalon') || id.includes('charlie') || id.includes('titan') || id.includes('paco') || id.includes('bruce') || id.includes('shin') || id.includes('waralee')) {
    return GENERADORES_MOLDES.pantalon(m, cliente);
  }
  if (id.includes('falda') || id.includes('penelope') || id.includes('sandy') || id.includes('lucy')) {
    return GENERADORES_MOLDES.falda(m, cliente);
  }
  if (id.includes('corset') || id.includes('cathrin') || id.includes('bustier') || id.includes('lumina') || id.includes('bee')) {
    return GENERADORES_MOLDES.corset(m, cliente);
  }
  if (id.includes('camisa') || id.includes('simon') || id.includes('simone') || id.includes('wahid') || id.includes('jaeger') || id.includes('bent') || id.includes('trayvon')) {
    return GENERADORES_MOLDES.camisa(m, cliente);
  }
  if (id.includes('hoodie') || id.includes('huey') || id.includes('hugo') || id.includes('sven') || id.includes('yuri') || id.includes('florent') || id.includes('florence')) {
    return GENERADORES_MOLDES.hoodie(m, cliente);
  }
  if (id.includes('musculosa') || id.includes('aaron') || id.includes('diana') || id.includes('tamiko') || id.includes('albert')) {
    return GENERADORES_MOLDES.musculosa(m, cliente);
  }

  // Por defecto: Remera / Top Clásico
  return GENERADORES_MOLDES.remera(m, cliente);
}
