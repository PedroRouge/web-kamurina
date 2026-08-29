/**
 * Kamurina Parametric Pattern Drafting Engine
 * Generador matemático de moldería industrial y a medida.
 * Espaciado holgado y profesional para despiece sin amontonamiento.
 */

// Utilidad para formatear números
const f = (n) => (typeof n === 'number' ? n.toFixed(1) : n);

/**
 * Genera el SVG completo con estilos de patronaje industrial y espaciado perfecto
 */
function wrapSvg(content, width, height) {
  const margin = 50;
  const viewBoxW = Math.max(width + margin * 2, 700);
  const viewBoxH = Math.max(height + margin * 2, 600);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(viewBoxW)} ${f(viewBoxH)}" width="100%" height="100%" class="freesewing-pattern-svg w-full h-auto">
  <defs>
    <style>
      .cut-line { fill: #1e293b15; stroke: #38bdf8; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
      .seam-line { fill: none; stroke: #94a3b8; stroke-width: 1.4; stroke-dasharray: 6, 4; }
      .fold-line { fill: none; stroke: #fbbf24; stroke-width: 2; stroke-dasharray: 10, 4, 3, 4; }
      .grain-line { fill: none; stroke: #a855f7; stroke-width: 1.8; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #ef4444; stroke-width: 2.2; }
      .text-label { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 14px; font-weight: 800; fill: #ffffff; }
      .text-sub { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 11px; font-weight: 500; fill: #cbd5e1; }
      .dimension-line { stroke: #64748b; stroke-width: 1; stroke-dasharray: 3, 3; }
      .scale-box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 2 L 10 5 L 0 8 z" fill="#a855f7"/>
    </marker>
  </defs>
  
  <rect width="100%" height="100%" fill="#0c0a09" rx="20" />
  <g transform="translate(${margin}, ${margin})">
    ${content}
  </g>
</svg>`;
}

/**
 * Rótulo flotante de pieza profesional con fondo oscuro y bordes definidos
 */
function rotulo(x, y, pieza, prenda, cliente, cortar = 'Cortar 2x (Par)') {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="-12" y="-14" width="210" height="68" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="1.2" opacity="0.95" />
      <text class="text-label" x="0" y="6">${pieza}</text>
      <text class="text-sub" x="0" y="24">${prenda} • ${cliente}</text>
      <text class="text-sub" x="0" y="40" fill="#38bdf8">${cortar} • Costura: 1 cm</text>
    </g>
  `;
}

/**
 * Línea indicadora de hilo de tela
 */
function hiloTela(x, y1, y2) {
  const midY = (y1 + y2) / 2;
  return `
    <g>
      <line x1="${f(x)}" y1="${f(y1)}" x2="${f(x)}" y2="${f(y2)}" class="grain-line" />
      <text class="text-sub" x="${f(x + 8)}" y="${f(midY)}" fill="#c084fc" font-size="10" font-weight="700" transform="rotate(90 ${f(x + 8)} ${f(midY)})">HILO DE TELA</text>
    </g>
  `;
}

/**
 * Caja de calibración de 10x10 cm ubicada de forma limpia
 */
function cajaCalibracion(x, y) {
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="0" y="0" width="100" height="100" rx="6" class="scale-box" />
      <text x="50" y="36" text-anchor="middle" class="text-label" font-size="13" fill="#38bdf8">10 x 10 cm</text>
      <text x="50" y="56" text-anchor="middle" class="text-sub" font-size="10">TEST DE ESCALA</text>
      <text x="50" y="74" text-anchor="middle" class="text-sub" font-size="9" fill="#94a3b8">Imprimir al 100%</text>
    </g>
  `;
}

/**
 * Generadores especializados por categoría con separación espacial amplia
 */
export const GENERADORES_MOLDES = {
  // 1. Remera Clásica
  remera: (m, cliente) => {
    const busto = (m.busto || m.pecho || 96) / 4 + 2;
    const largo = m.largoEspalda || 65;
    const hombro = (m.espalda || 40) / 2;
    const caidaHombro = 3.5;
    const sisa = (m.busto || 96) / 4 + 1;
    const escoteAncho = (m.cuello || 38) / 6 + 1.5;
    const escoteProfDel = (m.cuello || 38) / 6 + 4.5;
    const escoteProfEsp = 2.5;

    // 1. Delantero
    const delX = 0;
    const delPath = `M ${f(delX)},${f(escoteProfDel)} 
      Q ${f(delX + escoteAncho * 0.4)},${f(escoteProfDel)} ${f(delX + escoteAncho)},0 
      L ${f(delX + hombro)},${f(caidaHombro)} 
      Q ${f(delX + hombro - 1.5)},${f(sisa * 0.6)} ${f(delX + busto)},${f(sisa)} 
      L ${f(delX + busto)},${f(largo)} 
      L ${f(delX)},${f(largo)} Z`;

    // 2. Espalda (Con separación amplia de 90 cm)
    const espOffX = busto + 90;
    const espPath = `M ${f(espOffX)},${f(escoteProfEsp)} 
      Q ${f(espOffX + escoteAncho * 0.5)},${f(escoteProfEsp)} ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + hombro)},${f(caidaHombro)} 
      Q ${f(espOffX + hombro - 0.5)},${f(sisa * 0.6)} ${f(espOffX + busto)},${f(sisa)} 
      L ${f(espOffX + busto)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    // 3. Manga Corta (Con separación amplia)
    const mangaOffX = espOffX + busto + 90;
    const mangaAncho = (m.brazo || 32) + 4;
    const mangaLargo = m.largoManga || 24;
    const mangaCopa = 13;
    const mangaPath = `M ${f(mangaOffX + mangaAncho / 2)},0 
      Q ${f(mangaOffX + mangaAncho * 0.85)},0 ${f(mangaOffX + mangaAncho)},${f(mangaCopa)} 
      L ${f(mangaOffX + mangaAncho * 0.9)},${f(mangaLargo + mangaCopa)} 
      L ${f(mangaOffX + mangaAncho * 0.1)},${f(mangaLargo + mangaCopa)} 
      L ${f(mangaOffX)},${f(mangaCopa)} 
      Q ${f(mangaOffX + mangaAncho * 0.15)},0 ${f(mangaOffX + mangaAncho / 2)},0 Z`;

    // Caja de calibración colocada abajo a la derecha de forma no solapada
    const scaleX = mangaOffX + mangaAncho + 50;

    const content = `
      <!-- DELANTERO -->
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M ${f(delX)},0 L ${f(delX)},${f(largo)}" class="fold-line" />
        ${rotulo(delX + 15, largo * 0.4, 'DELANTERO', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(delX + busto * 0.45, sisa + 10, largo - 15)}
        <text class="text-sub" x="${f(delX + 5)}" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <!-- ESPALDA -->
      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + 15, largo * 0.4, 'ESPALDA', 'Remera Básica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + busto * 0.45, sisa + 10, largo - 15)}
        <text class="text-sub" x="${f(espOffX + 5)}" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <!-- MANGA -->
      <g>
        <path d="${mangaPath}" class="cut-line" />
        ${rotulo(mangaOffX + 5, mangaLargo + mangaCopa + 25, 'MANGA CORTA', 'Remera Básica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(mangaOffX + mangaAncho / 2, mangaCopa + 5, mangaLargo + mangaCopa - 5)}
      </g>

      <!-- CAJA CALIBRACIÓN -->
      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  },

  // 2. Musculosa / Top sin mangas
  musculosa: (m, cliente) => {
    const busto = (m.busto || m.pecho || 92) / 4 + 1;
    const largo = m.largoEspalda || 58;
    const hombro = ((m.espalda || 38) / 2) * 0.65;
    const caidaHombro = 3;
    const sisa = (m.busto || 92) / 4 + 3.5;
    const escoteAncho = (m.cuello || 36) / 6 + 3.5;
    const escoteProfDel = (m.cuello || 36) / 6 + 7;
    const escoteProfEsp = 4;

    const delPath = `M 0,${f(escoteProfDel)} 
      Q ${f(escoteAncho * 0.4)},${f(escoteProfDel)} ${f(escoteAncho)},0 
      L ${f(escoteAncho + hombro)},${f(caidaHombro)} 
      Q ${f(escoteAncho + hombro - 2)},${f(sisa * 0.65)} ${f(busto)},${f(sisa)} 
      L ${f(busto - 1)},${f(largo)} 
      L 0,${f(largo)} Z`;

    const espOffX = busto + 90;
    const espPath = `M ${f(espOffX)},${f(escoteProfEsp)} 
      Q ${f(espOffX + escoteAncho * 0.4)},${f(escoteProfEsp)} ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + escoteAncho + hombro)},${f(caidaHombro)} 
      Q ${f(espOffX + escoteAncho + hombro - 1)},${f(sisa * 0.65)} ${f(espOffX + busto)},${f(sisa)} 
      L ${f(espOffX + busto - 1)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    const scaleX = espOffX + busto + 70;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(15, largo * 0.4, 'DELANTERO', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(busto * 0.45, sisa + 5, largo - 15)}
        <text class="text-sub" x="5" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + 15, largo * 0.4, 'ESPALDA', 'Musculosa Top', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + busto * 0.45, sisa + 5, largo - 15)}
        <text class="text-sub" x="${f(espOffX + 5)}" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  },

  // 3. Falda Evasé / Recta con pinzas
  falda: (m, cliente) => {
    const cintura = (m.cintura || 70) / 4;
    const cadera = (m.cadera || 96) / 4 + 1;
    const altoCadera = m.altoCadera || 20;
    const largo = m.largoFalda || 58;
    const vueloEvase = 6;

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

    const trasOffX = cadera + vueloEvase + 90;
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

    const scaleX = trasOffX + cadera + vueloEvase + 70;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(15, largo * 0.4, 'FALDA DELANTERO', 'Falda Evasé', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(cadera * 0.45, altoCadera + 10, largo - 15)}
        <text class="text-sub" x="5" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + 15, largo * 0.4, 'FALDA TRASERO', 'Falda Evasé', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + cadera * 0.45, altoCadera + 10, largo - 15)}
        <text class="text-sub" x="${f(trasOffX + 5)}" y="${f(largo * 0.2)}" fill="#38bdf8">CIERRE POSTERIOR</text>
      </g>

      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  },

  // 4. Pantalón Recto / Palazzo
  pantalon: (m, cliente) => {
    const cintura = (m.cintura || 74) / 4;
    const cadera = (m.cadera || 100) / 4 + 1.5;
    const tiro = m.tiro || 26;
    const largo = m.largoPantalon || 98;
    const anchoBota = 22;
    const avanceTiroDel = (cadera * 0.15);
    const avanceTiroTras = (cadera * 0.35);

    const delPath = `M 0,0 
      L ${f(cintura)},0 
      Q ${f(cadera)},${f(tiro * 0.6)} ${f(cadera)},${f(tiro)} 
      L ${f(anchoBota + 5)},${f(largo)} 
      L 0,${f(largo)} 
      L ${f(-avanceTiroDel)},${f(tiro)} 
      Q ${f(-avanceTiroDel * 0.4)},${f(tiro * 0.6)} 0,0 Z`;

    const trasOffX = cadera + anchoBota + 100;
    const trasPath = `M ${f(trasOffX)},3 
      L ${f(trasOffX + cintura + 2)},0 
      Q ${f(trasOffX + cadera + 1)},${f(tiro * 0.6)} ${f(trasOffX + cadera + 1)},${f(tiro)} 
      L ${f(trasOffX + anchoBota + 7)},${f(largo)} 
      L ${f(trasOffX - 2)},${f(largo)} 
      L ${f(trasOffX - avanceTiroTras)},${f(tiro + 1)} 
      Q ${f(trasOffX - avanceTiroTras * 0.4)},${f(tiro * 0.5)} ${f(trasOffX)},3 Z`;

    const scaleX = trasOffX + cadera + anchoBota + 70;

    const content = `
      <g transform="translate(${f(avanceTiroDel + 15)}, 0)">
        <path d="${delPath}" class="cut-line" />
        ${rotulo(cintura * 0.1, largo * 0.35, 'PANTALÓN DELANTERO', 'Pantalón a Medida', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(cadera * 0.4, tiro + 10, largo - 20)}
      </g>

      <g transform="translate(${f(avanceTiroDel + 15)}, 0)">
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cintura * 0.1, largo * 0.35, 'PANTALÓN TRASERO', 'Pantalón a Medida', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + cadera * 0.4, tiro + 10, largo - 20)}
      </g>

      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  },

  // 5. Corset / Bustier Anatómico
  corset: (m, cliente) => {
    const busto = (m.busto || 90) / 4;
    const cintura = (m.cintura || 68) / 4;
    const altoBusto = m.altoBusto || 25;
    const largo = 36;

    // Panel 1 Centro Delantero
    const p1W = busto * 0.45;
    const p1Cint = cintura * 0.4;
    const p1Path = `M 0,0 
      L ${f(p1W)},0 
      Q ${f(p1W - 0.5)},${f(altoBusto * 0.6)} ${f(p1Cint)},${f(altoBusto)} 
      L ${f(p1Cint - 0.5)},${f(largo)} 
      L 0,${f(largo - 2)} Z`;

    // Panel 2 Lateral Delantero
    const p2OffX = p1W + 60;
    const p2W = busto * 0.55;
    const p2Cint = cintura * 0.5;
    const p2Path = `M ${f(p2OffX)},0 
      Q ${f(p2OffX + p2W * 0.6)},-2 ${f(p2OffX + p2W)},0 
      L ${f(p2OffX + p2Cint + 2)},${f(largo)} 
      L ${f(p2OffX)},${f(largo)} 
      Q ${f(p2OffX + 1)},${f(altoBusto * 0.6)} ${f(p2OffX)},0 Z`;

    // Panel 3 Lateral Espalda
    const p3OffX = p2OffX + p2W + 60;
    const p3W = busto * 0.48;
    const p3Cint = cintura * 0.45;
    const p3Path = `M ${f(p3OffX)},2 
      L ${f(p3OffX + p3W)},0 
      L ${f(p3OffX + p3Cint)},${f(largo)} 
      L ${f(p3OffX)},${f(largo)} Z`;

    // Panel 4 Centro Espalda
    const p4OffX = p3OffX + p3W + 60;
    const p4W = busto * 0.45;
    const p4Cint = cintura * 0.42;
    const p4Path = `M ${f(p4OffX)},0 
      L ${f(p4OffX + p4W)},0 
      L ${f(p4OffX + p4Cint)},${f(largo - 2)} 
      L ${f(p4OffX)},${f(largo)} Z`;

    const scaleX = p4OffX + p4W + 60;

    const content = `
      <g>
        <path d="${p1Path}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo - 2)}" class="fold-line" />
        ${rotulo(0, largo + 15, '1. CENTRO DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(p1W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p2Path}" class="cut-line" />
        ${rotulo(p2OffX, largo + 15, '2. LATERAL DELANTERO', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p2OffX + p2W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p3Path}" class="cut-line" />
        ${rotulo(p3OffX, largo + 15, '3. LATERAL ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p3OffX + p3W * 0.5, 6, largo - 10)}
      </g>

      <g>
        <path d="${p4Path}" class="cut-line" />
        ${rotulo(p4OffX, largo + 15, '4. CENTRO ESPALDA', 'Corset Bustier', cliente.nombre, 'Cortar 4x (Ojalillos)')}
        ${hiloTela(p4OffX + p4W * 0.5, 6, largo - 10)}
      </g>

      ${cajaCalibracion(scaleX, 0)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 100);
  },

  // 6. Camisa con Cuello y Pie de Cuello
  camisa: (m, cliente) => {
    const pecho = (m.pecho || m.busto || 100) / 4 + 3;
    const largo = m.largoEspalda || 72;
    const hombro = (m.espalda || 42) / 2 + 1;
    const sisa = (m.pecho || 100) / 4 + 2;
    const escoteAncho = (m.cuello || 40) / 6 + 1.5;

    const delPath = `M -2,7 
      Q ${f(escoteAncho * 0.3)},6 ${f(escoteAncho)},0 
      L ${f(hombro)},3.5 
      Q ${f(hombro - 1)},${f(sisa * 0.6)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho)},${f(largo)} 
      L -2,${f(largo)} Z`;

    const espOffX = pecho + 90;
    const espPath = `M ${f(espOffX)},2.5 
      Q ${f(espOffX + escoteAncho * 0.4)},2 ${f(espOffX + escoteAncho)},0 
      L ${f(espOffX + hombro)},3.5 
      Q ${f(espOffX + hombro - 0.5)},${f(sisa * 0.6)} ${f(espOffX + pecho)},${f(sisa)} 
      L ${f(espOffX + pecho)},${f(largo)} 
      L ${f(espOffX)},${f(largo)} Z`;

    const cuelloLargo = (m.cuello || 40) / 2 + 1.5;
    const cuelloOffX = espOffX + pecho + 90;
    const piePath = `M ${f(cuelloOffX)},0 L ${f(cuelloOffX + cuelloLargo - 1.5)},0 Q ${f(cuelloOffX + cuelloLargo)},1.5 ${f(cuelloOffX + cuelloLargo)},3.5 L ${f(cuelloOffX)},3.5 Z`;
    const cuelloPath = `M ${f(cuelloOffX)},10 L ${f(cuelloOffX + cuelloLargo + 1.5)},9 L ${f(cuelloOffX + cuelloLargo - 0.5)},15 L ${f(cuelloOffX)},15 Z`;

    const scaleX = cuelloOffX + cuelloLargo + 60;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <line x1="0" y1="0" x2="0" y2="${f(largo)}" class="seam-line" />
        ${rotulo(15, largo * 0.4, 'DELANTERO CON CARTERA', 'Camisa Clásica', cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(pecho * 0.4, sisa + 10, largo - 20)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largo)}" class="fold-line" />
        ${rotulo(espOffX + 15, largo * 0.4, 'ESPALDA', 'Camisa Clásica', cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pecho * 0.4, sisa + 10, largo - 20)}
        <text class="text-sub" x="${f(espOffX + 5)}" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${piePath}" class="cut-line" />
        <path d="${cuelloPath}" class="cut-line" />
        ${rotulo(cuelloOffX, 26, 'CUELLO Y PIE DE CUELLO', 'Camisa Clásica', cliente.nombre, 'Cortar 2x + Entretela')}
      </g>

      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  },

  // 7. Buzo con Capucha (Hoodie)
  hoodie: (m, cliente) => {
    const pecho = (m.pecho || m.busto || 96) / 4 + 6;
    const largo = m.largoEspalda || 68;
    const hombro = (m.espalda || 40) / 2 + 3;
    const sisa = (m.pecho || 96) / 4 + 4;
    const escoteAncho = (m.cuello || 38) / 6 + 2.5;

    const delPath = `M 0,8 
      Q ${f(escoteAncho * 0.4)},8 ${f(escoteAncho)},0 
      L ${f(hombro)},4 
      Q ${f(hombro - 1)},${f(sisa * 0.6)} ${f(pecho)},${f(sisa)} 
      L ${f(pecho)},${f(largo)} 
      L 0,${f(largo)} Z`;

    const capOffX = pecho + 90;
    const capW = 28;
    const capH = 38;
    const capPath = `M ${f(capOffX)},${f(capH)} 
      L ${f(capOffX + capW * 0.6)},${f(capH - 1)} 
      Q ${f(capOffX + capW)},${f(capH - 4)} ${f(capOffX + capW)},${f(capH * 0.5)} 
      Q ${f(capOffX + capW)},0 ${f(capOffX + capW * 0.4)},0 
      L ${f(capOffX)},0 Z`;

    const scaleX = capOffX + capW + 70;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largo)}" class="fold-line" />
        ${rotulo(15, largo * 0.4, 'CUERPO DELANTERO/ESPALDA', 'Buzo Hoodie', cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(pecho * 0.4, sisa + 10, largo - 20)}
        <text class="text-sub" x="5" y="${f(largo - 10)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${capPath}" class="cut-line" />
        ${rotulo(capOffX, capH + 15, 'CAPUCHA FORRADA', 'Buzo Hoodie', cliente.nombre, 'Cortar 4x (Tela + Forro)')}
        ${hiloTela(capOffX + capW * 0.5, 5, capH - 10)}
      </g>

      ${cajaCalibracion(scaleX, largo - 100)}
    `;

    return wrapSvg(content, scaleX + 130, largo + 50);
  }
};

/**
 * Trazador Principal y Universal de Moldería
 */
export function trazarMoldeSeguro(tipoMoldeId, medidasCliente = {}, opciones = {}) {
  // Extraer medidas normalizadas en cm utilizando estrictamente los nombres de la app
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
