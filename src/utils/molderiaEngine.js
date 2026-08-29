/**
 * Kamurina Parametric Pattern Drafting Engine
 * Generador matemático de moldería profesional con escala 1:1 milimétrica (1 unidad SVG = 1 mm)
 * Diseñado con despiece limpio, rótulos legibles y separación sin solapamiento
 */

// Utilidad para formatear números
const f = (n) => (typeof n === 'number' ? n.toFixed(1) : n);

/**
 * Envoltorio SVG con viewBox milimétrico exacto y estilos profesionales
 */
function wrapSvg(content, widthMm, heightMm) {
  const margin = 40; // 40mm de margen de lienzo
  const vbW = Math.max(widthMm + margin * 2, 800);
  const vbH = Math.max(heightMm + margin * 2, 700);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(vbW)} ${f(vbH)}" width="100%" height="100%" class="freesewing-pattern-svg w-full h-auto">
  <defs>
    <style>
      .cut-line { fill: rgba(56, 189, 248, 0.05); stroke: #38bdf8; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .seam-line { fill: none; stroke: #94a3b8; stroke-width: 2; stroke-dasharray: 8, 5; }
      .fold-line { fill: none; stroke: #fbbf24; stroke-width: 2.5; stroke-dasharray: 12, 5, 4, 5; }
      .grain-line { fill: none; stroke: #c084fc; stroke-width: 2.2; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #ef4444; stroke-width: 3; }
      .text-label { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 16px; font-weight: 800; fill: #ffffff; }
      .text-sub { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 12px; font-weight: 600; fill: #cbd5e1; }
      .scale-box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2.5; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 2 L 10 5 L 0 8 z" fill="#c084fc"/>
    </marker>
  </defs>
  
  <rect width="100%" height="100%" fill="#0c0a09" rx="16" />
  <g transform="translate(${margin}, ${margin})">
    ${content}
  </g>
</svg>`;
}

/**
 * Rótulo flotante de pieza en milímetros
 */
function rotulo(x, y, pieza, prenda, cliente, cortar = 'Cortar 2x (Par)') {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="-10" y="-12" width="220" height="72" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" opacity="0.95" />
      <text class="text-label" x="2" y="10">${pieza}</text>
      <text class="text-sub" x="2" y="30">${prenda} • ${cliente}</text>
      <text class="text-sub" x="2" y="48" fill="#38bdf8">${cortar} • Costura: 1 cm</text>
    </g>
  `;
}

/**
 * Línea indicadora de hilo de tela en milímetros
 */
function hiloTela(x, y1, y2) {
  const midY = (y1 + y2) / 2;
  return `
    <g>
      <line x1="${f(x)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y2)}" class="grain-line" />
      <text class="text-sub" x="${f(x + 10)}" y="${f(midY)}" fill="#d8b4fe" font-size="11" font-weight="700" transform="rotate(90 ${f(x + 10)} ${f(midY)})">HILO DE TELA</text>
    </g>
  `;
}

/**
 * Cuadro de prueba de escala 10 x 10 cm (100 x 100 mm)
 */
function cajaCalibracion(x, y) {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="0" y="0" width="100" height="100" rx="8" class="scale-box" />
      <text x="50" y="38" text-anchor="middle" class="text-label" font-size="14" fill="#38bdf8">10 x 10 cm</text>
      <text x="50" y="58" text-anchor="middle" class="text-sub" font-size="11">TEST DE ESCALA</text>
      <text x="50" y="78" text-anchor="middle" class="text-sub" font-size="10" fill="#94a3b8">Imprimir al 100%</text>
    </g>
  `;
}

/**
 * GENERADORES PARAMÉTRICOS POR CATEGORÍA
 * Todas las dimensiones se multiplican por 10 para trabajar en milímetros reales (1cm = 10mm)
 */
export const GENERADORES_MOLDES = {
  // 1. Remera / T-Shirt Básica
  remera: (m, cliente) => {
    const bustoMm = ((m.busto || m.pecho || 96) / 4 + 2) * 10;
    const largoMm = (m.largoEspalda || 65) * 10;
    const hombroMm = ((m.espalda || 40) / 2) * 10;
    const caidaHombroMm = 35;
    const sisaMm = ((m.busto || 96) / 4 + 1) * 10;
    const escoteAnchoMm = ((m.cuello || 38) / 6 + 1.5) * 10;
    const escoteProfDelMm = ((m.cuello || 38) / 6 + 4.5) * 10;
    const escoteProfEspMm = 25;

    // 1. Delantero
    const delX = 0;
    const delPath = `M ${f(delX)},${f(escoteProfDelMm)} 
      Q ${f(delX + escoteAnchoMm * 0.4)},${f(escoteProfDelMm)} ${f(delX + escoteAnchoMm)},0 
      L ${f(delX + hombroMm)},${f(caidaHombroMm)} 
      Q ${f(delX + hombroMm - 15)},${f(sisaMm * 0.6)} ${f(delX + bustoMm)},${f(sisaMm)} 
      L ${f(delX + bustoMm)},${f(largoMm)} 
      L ${f(delX)},${f(largoMm)} Z`;

    // 2. Espalda (separado 60mm)
    const espOffX = bustoMm + 60;
    const espPath = `M ${f(espOffX)},${f(escoteProfEspMm)} 
      Q ${f(espOffX + escoteAnchoMm * 0.5)},${f(escoteProfEspMm)} ${f(espOffX + escoteAnchoMm)},0 
      L ${f(espOffX + hombroMm)},${f(caidaHombroMm)} 
      Q ${f(espOffX + hombroMm - 5)},${f(sisaMm * 0.6)} ${f(espOffX + bustoMm)},${f(sisaMm)} 
      L ${f(espOffX + bustoMm)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

    // 3. Manga Corta (separada 60mm)
    const mangaOffX = espOffX + bustoMm + 60;
    const mangaAnchoMm = ((m.brazo || 32) + 4) * 10;
    const mangaLargoMm = (m.largoManga || 24) * 10;
    const mangaCopaMm = 130;
    const mangaPath = `M ${f(mangaOffX + mangaAnchoMm / 2)},0 
      Q ${f(mangaOffX + mangaAnchoMm * 0.85)},0 ${f(mangaOffX + mangaAnchoMm)},${f(mangaCopaMm)} 
      L ${f(mangaOffX + mangaAnchoMm * 0.9)},${f(mangaLargoMm + mangaCopaMm)} 
      L ${f(mangaOffX + mangaAnchoMm * 0.1)},${f(mangaLargoMm + mangaCopaMm)} 
      L ${f(mangaOffX)},${f(mangaCopaMm)} 
      Q ${f(mangaOffX + mangaAnchoMm * 0.15)},0 ${f(mangaOffX + mangaAnchoMm / 2)},0 Z`;

    const scaleX = mangaOffX + mangaAnchoMm + 50;

    const content = `
      <!-- DELANTERO -->
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M ${f(delX)},0 L ${f(delX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(delX + 20, largoMm * 0.4, 'DELANTERO', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(delX + bustoMm * 0.45, sisaMm + 40, largoMm - 60)}
        <text class="text-sub" x="${f(delX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <!-- ESPALDA -->
      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, 'ESPALDA', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + bustoMm * 0.45, sisaMm + 40, largoMm - 60)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <!-- MANGA -->
      <g>
        <path d="${mangaPath}" class="cut-line" />
        ${rotulo(mangaOffX + 10, mangaLargoMm + mangaCopaMm + 30, 'MANGA CORTA', 'Remera Básica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(mangaOffX + mangaAnchoMm / 2, mangaCopaMm + 20, mangaLargoMm + mangaCopaMm - 20)}
      </g>

      <!-- CAJA CALIBRACIÓN -->
      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 2. Musculosa / Top sin mangas
  musculosa: (m, cliente) => {
    const bustoMm = ((m.busto || m.pecho || 92) / 4 + 1) * 10;
    const largoMm = (m.largoEspalda || 58) * 10;
    const hombroMm = (((m.espalda || 38) / 2) * 0.65) * 10;
    const caidaHombroMm = 30;
    const sisaMm = ((m.busto || 92) / 4 + 3.5) * 10;
    const escoteAnchoMm = ((m.cuello || 36) / 6 + 3.5) * 10;
    const escoteProfDelMm = ((m.cuello || 36) / 6 + 7) * 10;
    const escoteProfEspMm = 40;

    const delPath = `M 0,${f(escoteProfDelMm)} 
      Q ${f(escoteAnchoMm * 0.4)},${f(escoteProfDelMm)} ${f(escoteAnchoMm)},0 
      L ${f(escoteAnchoMm + hombroMm)},${f(caidaHombroMm)} 
      Q ${f(escoteAnchoMm + hombroMm - 20)},${f(sisaMm * 0.65)} ${f(bustoMm)},${f(sisaMm)} 
      L ${f(bustoMm - 10)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const espOffX = bustoMm + 60;
    const espPath = `M ${f(espOffX)},${f(escoteProfEspMm)} 
      Q ${f(espOffX + escoteAnchoMm * 0.4)},${f(escoteProfEspMm)} ${f(espOffX + escoteAnchoMm)},0 
      L ${f(espOffX + escoteAnchoMm + hombroMm)},${f(caidaHombroMm)} 
      Q ${f(espOffX + escoteAnchoMm + hombroMm - 10)},${f(sisaMm * 0.65)} ${f(espOffX + bustoMm)},${f(sisaMm)} 
      L ${f(espOffX + bustoMm - 10)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

    const scaleX = espOffX + bustoMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, 'DELANTERO', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(bustoMm * 0.45, sisaMm + 30, largoMm - 50)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, 'ESPALDA', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + bustoMm * 0.45, sisaMm + 30, largoMm - 50)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 3. Falda Evasé / Recta
  falda: (m, cliente) => {
    const cinturaMm = ((m.cintura || 70) / 4) * 10;
    const caderaMm = ((m.cadera || 96) / 4 + 1) * 10;
    const altoCaderaMm = (m.altoCadera || 20) * 10;
    const largoMm = (m.largoFalda || 58) * 10;
    const vueloEvaseMm = 60;

    const pinzaDelX = cinturaMm * 0.6;
    const pinzaDelAncho = 20;
    const pinzaDelLargo = 90;

    const delPath = `M 0,0 
      L ${f(pinzaDelX - pinzaDelAncho / 2)},0 
      L ${f(pinzaDelX)},${f(pinzaDelLargo)} 
      L ${f(pinzaDelX + pinzaDelAncho / 2)},0 
      L ${f(cinturaMm + pinzaDelAncho)},0 
      Q ${f(caderaMm + 10)},${f(altoCaderaMm * 0.7)} ${f(caderaMm)},${f(altoCaderaMm)} 
      L ${f(caderaMm + vueloEvaseMm)},${f(largoMm)} 
      Q ${f((caderaMm + vueloEvaseMm) / 2)},${f(largoMm + 10)} 0,${f(largoMm)} Z`;

    const trasOffX = caderaMm + vueloEvaseMm + 70;
    const pinzaTrasX = cinturaMm * 0.5;
    const pinzaTrasAncho = 30;
    const pinzaTrasLargo = 120;

    const trasPath = `M ${f(trasOffX)},0 
      L ${f(trasOffX + pinzaTrasX - pinzaTrasAncho / 2)},0 
      L ${f(trasOffX + pinzaTrasX)},${f(pinzaTrasLargo)} 
      L ${f(trasOffX + pinzaTrasX + pinzaTrasAncho / 2)},0 
      L ${f(trasOffX + cinturaMm + pinzaTrasAncho)},0 
      Q ${f(trasOffX + caderaMm + 10)},${f(altoCaderaMm * 0.7)} ${f(trasOffX + caderaMm)},${f(altoCaderaMm)} 
      L ${f(trasOffX + caderaMm + vueloEvaseMm)},${f(largoMm)} 
      Q ${f(trasOffX + (caderaMm + vueloEvaseMm) / 2)},${f(largoMm + 10)} ${f(trasOffX)},${f(largoMm)} Z`;

    const scaleX = trasOffX + caderaMm + vueloEvaseMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, 'FALDA DELANTERO', 'Falda Evasé', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(caderaMm * 0.45, altoCaderaMm + 50, largoMm - 60)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + 20, largoMm * 0.4, 'FALDA TRASERO', 'Falda Evasé', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.45, altoCaderaMm + 50, largoMm - 60)}
        <text class="text-sub" x="${f(trasOffX + 10)}" y="${f(largoMm * 0.2)}" fill="#38bdf8">CIERRE POSTERIOR</text>
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 4. Pantalón Recto / Palazzo
  pantalon: (m, cliente) => {
    const cinturaMm = ((m.cintura || 74) / 4) * 10;
    const caderaMm = ((m.cadera || 100) / 4 + 1.5) * 10;
    const tiroMm = (m.tiro || 26) * 10;
    const largoMm = (m.largoPantalon || 98) * 10;
    const anchoBotaMm = 220;
    const avanceTiroDelMm = caderaMm * 0.15;
    const avanceTiroTrasMm = caderaMm * 0.35;

    const delPath = `M 0,0 
      L ${f(cinturaMm)},0 
      Q ${f(caderaMm)},${f(tiroMm * 0.6)} ${f(caderaMm)},${f(tiroMm)} 
      L ${f(anchoBotaMm + 50)},${f(largoMm)} 
      L 0,${f(largoMm)} 
      L ${f(-avanceTiroDelMm)},${f(tiroMm)} 
      Q ${f(-avanceTiroDelMm * 0.4)},${f(tiroMm * 0.6)} 0,0 Z`;

    const trasOffX = caderaMm + anchoBotaMm + 80;
    const trasPath = `M ${f(trasOffX)},30 
      L ${f(trasOffX + cinturaMm + 20)},0 
      Q ${f(trasOffX + caderaMm + 10)},${f(tiroMm * 0.6)} ${f(trasOffX + caderaMm + 10)},${f(tiroMm)} 
      L ${f(trasOffX + anchoBotaMm + 70)},${f(largoMm)} 
      L ${f(trasOffX - 20)},${f(largoMm)} 
      L ${f(trasOffX - avanceTiroTrasMm)},${f(tiroMm + 10)} 
      Q ${f(trasOffX - avanceTiroTrasMm * 0.4)},${f(tiroMm * 0.5)} ${f(trasOffX)},30 Z`;

    const scaleX = trasOffX + caderaMm + anchoBotaMm + 60;

    const content = `
      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${delPath}" class="cut-line" />
        ${rotulo(cinturaMm * 0.1, largoMm * 0.35, 'PANTALÓN DELANTERO', 'Pantalón a Medida', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cinturaMm * 0.1, largoMm * 0.35, 'PANTALÓN TRASERO', 'Pantalón a Medida', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 5. Corset / Bustier Anatómico
  corset: (m, cliente) => {
    const bustoMm = ((m.busto || 90) / 4) * 10;
    const cinturaMm = ((m.cintura || 68) / 4) * 10;
    const altoBustoMm = (m.altoBusto || 25) * 10;
    const largoMm = 360;

    // Panel 1 Centro Delantero
    const p1W = bustoMm * 0.45;
    const p1Cint = cinturaMm * 0.4;
    const p1Path = `M 0,0 
      L ${f(p1W)},0 
      Q ${f(p1W - 5)},${f(altoBustoMm * 0.6)} ${f(p1Cint)},${f(altoBustoMm)} 
      L ${f(p1Cint - 5)},${f(largoMm)} 
      L 0,${f(largoMm - 20)} Z`;

    // Panel 2 Lateral Delantero
    const p2OffX = p1W + 40;
    const p2W = bustoMm * 0.55;
    const p2Cint = cinturaMm * 0.5;
    const p2Path = `M ${f(p2OffX)},0 
      Q ${f(p2OffX + p2W * 0.6)},-20 ${f(p2OffX + p2W)},0 
      L ${f(p2OffX + p2Cint + 20)},${f(largoMm)} 
      L ${f(p2OffX)},${f(largoMm)} 
      Q ${f(p2OffX + 10)},${f(altoBustoMm * 0.6)} ${f(p2OffX)},0 Z`;

    // Panel 3 Lateral Espalda
    const p3OffX = p2OffX + p2W + 40;
    const p3W = bustoMm * 0.48;
    const p3Cint = cinturaMm * 0.45;
    const p3Path = `M ${f(p3OffX)},20 
      L ${f(p3OffX + p3W)},0 
      L ${f(p3OffX + p3Cint)},${f(largoMm)} 
      L ${f(p3OffX)},${f(largoMm)} Z`;

    // Panel 4 Centro Espalda
    const p4OffX = p3OffX + p3W + 40;
    const p4W = bustoMm * 0.45;
    const p4Cint = cinturaMm * 0.42;
    const p4Path = `M ${f(p4OffX)},0 
      L ${f(p4OffX + p4W)},0 
      L ${f(p4OffX + p4Cint)},${f(largoMm - 20)} 
      L ${f(p4OffX)},${f(largoMm)} Z`;

    const scaleX = p4OffX + p4W + 50;

    const content = `
      <g>
        <path d="${p1Path}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm - 20)}" class="fold-line" />
        ${rotulo(0, largoMm + 20, '1. CENTRO DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(p1W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p2Path}" class="cut-line" />
        ${rotulo(p2OffX, largoMm + 20, '2. LATERAL DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p2OffX + p2W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p3Path}" class="cut-line" />
        ${rotulo(p3OffX, largoMm + 20, '3. LATERAL ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p3OffX + p3W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p4Path}" class="cut-line" />
        ${rotulo(p4OffX, largoMm + 20, '4. CENTRO ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Ojalillos)')}
        ${hiloTela(p4OffX + p4W * 0.5, 30, largoMm - 40)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 110);
  },

  // 6. Camisa Clásica con Cartera y Cuello
  camisa: (m, cliente) => {
    const pechoMm = ((m.pecho || m.busto || 100) / 4 + 3) * 10;
    const largoMm = (m.largoEspalda || 72) * 10;
    const hombroMm = ((m.espalda || 42) / 2 + 1) * 10;
    const sisaMm = ((m.pecho || 100) / 4 + 2) * 10;
    const escoteAnchoMm = ((m.cuello || 40) / 6 + 1.5) * 10;

    const delPath = `M -20,70 
      Q ${f(escoteAnchoMm * 0.3)},60 ${f(escoteAnchoMm)},0 
      L ${f(hombroMm)},35 
      Q ${f(hombroMm - 10)},${f(sisaMm * 0.6)} ${f(pechoMm)},${f(sisaMm)} 
      L ${f(pechoMm)},${f(largoMm)} 
      L -20,${f(largoMm)} Z`;

    const espOffX = pechoMm + 60;
    const espPath = `M ${f(espOffX)},25 
      Q ${f(espOffX + escoteAnchoMm * 0.4)},20 ${f(espOffX + escoteAnchoMm)},0 
      L ${f(espOffX + hombroMm)},35 
      Q ${f(espOffX + hombroMm - 5)},${f(sisaMm * 0.6)} ${f(espOffX + pechoMm)},${f(sisaMm)} 
      L ${f(espOffX + pechoMm)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

    const cuelloLargoMm = ((m.cuello || 40) / 2 + 1.5) * 10;
    const cuelloOffX = espOffX + pechoMm + 60;
    const piePath = `M ${f(cuelloOffX)},0 L ${f(cuelloOffX + cuelloLargoMm - 15)},0 Q ${f(cuelloOffX + cuelloLargoMm)},15 ${f(cuelloOffX + cuelloLargoMm)},35 L ${f(cuelloOffX)},35 Z`;
    const cuelloPath = `M ${f(cuelloOffX)},100 L ${f(cuelloOffX + cuelloLargoMm + 15)},90 L ${f(cuelloOffX + cuelloLargoMm - 5)},150 L ${f(cuelloOffX)},150 Z`;

    const scaleX = cuelloOffX + cuelloLargoMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <line x1="0" y1="0" x2="0" y2="${f(largoMm)}" class="seam-line" />
        ${rotulo(20, largoMm * 0.4, 'DELANTERO CON CARTERA', 'Camisa Clásica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, 'ESPALDA', 'Camisa Clásica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${piePath}" class="cut-line" />
        <path d="${cuelloPath}" class="cut-line" />
        ${rotulo(cuelloOffX, 180, 'CUELLO Y PIE DE CUELLO', 'Camisa Clásica', cliente.nombre, 'Cortar 2x + Entretela')}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 7. Buzo Canguro con Capucha (Hoodie)
  hoodie: (m, cliente) => {
    const pechoMm = ((m.pecho || m.busto || 96) / 4 + 6) * 10;
    const largoMm = (m.largoEspalda || 68) * 10;
    const hombroMm = ((m.espalda || 40) / 2 + 3) * 10;
    const sisaMm = ((m.pecho || 96) / 4 + 4) * 10;
    const escoteAnchoMm = ((m.cuello || 38) / 6 + 2.5) * 10;

    const delPath = `M 0,80 
      Q ${f(escoteAnchoMm * 0.4)},80 ${f(escoteAnchoMm)},0 
      L ${f(hombroMm)},40 
      Q ${f(hombroMm - 10)},${f(sisaMm * 0.6)} ${f(pechoMm)},${f(sisaMm)} 
      L ${f(pechoMm)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const capOffX = pechoMm + 60;
    const capWMm = 280;
    const capHMm = 380;
    const capPath = `M ${f(capOffX)},${f(capHMm)} 
      L ${f(capOffX + capWMm * 0.6)},${f(capHMm - 10)} 
      Q ${f(capOffX + capWMm)},${f(capHMm - 40)} ${f(capOffX + capWMm)},${f(capHMm * 0.5)} 
      Q ${f(capOffX + capWMm)},0 ${f(capOffX + capWMm * 0.4)},0 
      L ${f(capOffX)},0 Z`;

    const scaleX = capOffX + capWMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, 'CUERPO DELANTERO/ESPALDA', 'Buzo Hoodie', cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${capPath}" class="cut-line" />
        ${rotulo(capOffX, capHMm + 20, 'CAPUCHA FORRADA', 'Buzo Hoodie', cliente.nombre, 'Cortar 4x (Tela + Forro)')}
        ${hiloTela(capOffX + capWMm * 0.5, 30, capHMm - 50)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  }
};

/**
 * Trazador Principal y Universal de Moldería
 */
export function trazarMoldeSeguro(tipoMoldeId, medidasCliente = {}, opciones = {}) {
  const m = {
    pecho: parseFloat(medidasCliente['Ancho de Pecho']) || parseFloat(medidasCliente['Contorno de Busto']) || 96,
    busto: parseFloat(medidasCliente['Contorno de Busto']) || parseFloat(medidasCliente['Ancho de Pecho']) || 94,
    cintura: parseFloat(medidasCliente['Contorno de Cintura']) || 72,
    cadera: parseFloat(medidasCliente['Contorno de Cadera']) || 98,
    espalda: parseFloat(medidasCliente['Ancho de Espalda']) || parseFloat(medidasCliente['Ancho de Hombros']) || 38,
    cuello: parseFloat(medidasCliente['Contorno de Cuello']) || 37,
    largoEspalda: parseFloat(medidasCliente['Largo de Espalda']) || parseFloat(medidasCliente['Largo de Talle']) || 62,
    largoManga: parseFloat(medidasCliente['Largo de Manga']) || 58,
    brazo: parseFloat(medidasCliente['Contorno de Brazo']) || 30,
    largoPantalon: parseFloat(medidasCliente['Largo de Pantalón']) || 98,
    tiro: parseFloat(medidasCliente['Altura Tiro de Pantalón']) || parseFloat(medidasCliente['Altura de Tiro']) || 26,
    altoCadera: parseFloat(medidasCliente['Altura de Cadera']) || 20,
    altoBusto: parseFloat(medidasCliente['Altura de Busto']) || 26,
    largoFalda: parseFloat(medidasCliente['Largo de Falda']) || 58
  };

  const cliente = {
    nombre: opciones.clienteNombre || 'Cliente'
  };

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

  return GENERADORES_MOLDES.remera(m, cliente);
}
