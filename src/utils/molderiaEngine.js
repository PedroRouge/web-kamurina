/**
 * Kamurina Parametric Pattern Drafting Engine (Motor Maestro de Patronaje Paramétrico)
 * Generador matemático de moldería profesional con escala 1:1 milimétrica (1 unidad SVG = 1 mm)
 * Despiece geométrico específico para los 40 patrones del catálogo, con rotulación y graduación real.
 */

// Utilidad para formatear números a 1 decimal
const f = (n) => (typeof n === 'number' ? n.toFixed(1) : n);

/**
 * Envoltorio SVG con viewBox milimétrico exacto y estilos de alta definición
 */
export function wrapSvg(content, widthMm, heightMm) {
  const margin = 50; // 50mm de margen de lienzo
  const vbW = Math.max(Math.round(widthMm + margin * 2), 850);
  const vbH = Math.max(Math.round(heightMm + margin * 2), 650);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="100%" height="100%" class="freesewing-pattern-svg w-full h-auto">
  <defs>
    <style>
      .cut-line { fill: rgba(56, 189, 248, 0.04); stroke: #38bdf8; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .seam-line { fill: none; stroke: #94a3b8; stroke-width: 2; stroke-dasharray: 8, 5; }
      .fold-line { fill: none; stroke: #fbbf24; stroke-width: 2.5; stroke-dasharray: 12, 5, 4, 5; }
      .grain-line { fill: none; stroke: #c084fc; stroke-width: 2.2; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #ef4444; stroke-width: 3; }
      .text-label { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 15px; font-weight: 800; fill: #ffffff; }
      .text-sub { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; font-size: 11.5px; font-weight: 600; fill: #cbd5e1; }
      .scale-box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2.5; }
      .cota-line { stroke: #64748b; stroke-width: 1.2; stroke-dasharray: 3, 3; }
      .cota-text { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #38bdf8; font-weight: bold; }
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
export function rotulo(x, y, pieza, prenda, cliente, cortar = 'Cortar 2x (Par)') {
  const w = 230;
  const h = 76;
  return `
    <g transform="translate(${f(x)}, ${f(y)})">
      <rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" opacity="0.95" />
      <text class="text-label" x="12" y="24">${pieza}</text>
      <text class="text-sub" x="12" y="44">${prenda} • ${cliente}</text>
      <text class="text-sub" x="12" y="62" fill="#38bdf8">${cortar} • Costura: 1 cm</text>
    </g>
  `;
}

/**
 * Línea indicadora de hilo de tela en milímetros
 */
export function hiloTela(x, y1, y2) {
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
export function cajaCalibracion(x, y) {
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
 * GENERADORES PARAMÉTRICOS POR CADA PRENDA ESPECÍFICA DEL CATÁLOGO
 */
export const GENERADORES_ESPECIFICOS = {
  // ==========================================
  // ACCESORIOS Y COMPLEMENTOS
  // ==========================================

  // 1. Gorra Boina Plana Clásica (Flat Cap / Boina)
  florent: (m, cliente, nombre) => {
    const largoTapaMm = 280;
    const anchoTapaMm = 230;

    // Tapa Superior (ovalada con punta frontal)
    const tapaPath = `M 0,${f(anchoTapaMm / 2)} 
      C 0,${f(anchoTapaMm * 0.1)} ${f(largoTapaMm * 0.35)},0 ${f(largoTapaMm * 0.7)},0 
      Q ${f(largoTapaMm)},${f(anchoTapaMm * 0.2)} ${f(largoTapaMm)},${f(anchoTapaMm / 2)} 
      Q ${f(largoTapaMm)},${f(anchoTapaMm * 0.8)} ${f(largoTapaMm * 0.7)},${f(anchoTapaMm)} 
      C ${f(largoTapaMm * 0.35)},${f(anchoTapaMm)} 0,${f(anchoTapaMm * 0.9)} 0,${f(anchoTapaMm / 2)} Z`;

    // Lateral de Boina (2x)
    const latOffX = largoTapaMm + 70;
    const latWMm = 270;
    const latHMm = 120;
    const lateralPath = `M ${f(latOffX)},20 
      Q ${f(latOffX + latWMm * 0.5)},0 ${f(latOffX + latWMm)},20 
      L ${f(latOffX + latWMm - 10)},${f(latHMm)} 
      Q ${f(latOffX + latWMm * 0.5)},${f(latHMm + 25)} ${f(latOffX + 10)},${f(latHMm)} Z`;

    // Visera Curva Rígida (2x)
    const visOffX = latOffX + latWMm + 70;
    const visWMm = 180;
    const visHMm = 90;
    const viseraPath = `M ${f(visOffX)},20 
      Q ${f(visOffX + visWMm / 2)},-15 ${f(visOffX + visWMm)},20 
      Q ${f(visOffX + visWMm / 2)},${f(visHMm + 25)} ${f(visOffX)},20 Z`;

    const scaleX = visOffX + visWMm + 50;

    const content = `
      <!-- TAPA SUPERIOR -->
      <g>
        <path d="${tapaPath}" class="cut-line" />
        ${rotulo(10, anchoTapaMm + 25, '1. TAPA SUPERIOR', nombre, cliente.nombre, 'Cortar 1x (Tela + Forro)')}
        ${hiloTela(largoTapaMm * 0.5, 30, anchoTapaMm - 30)}
      </g>

      <!-- LATERALES -->
      <g>
        <path d="${lateralPath}" class="cut-line" />
        ${rotulo(latOffX, latHMm + 45, '2. LATERALES', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(latOffX + latWMm * 0.5, 25, latHMm - 10)}
      </g>

      <!-- VISERA -->
      <g>
        <path d="${viseraPath}" class="cut-line" />
        ${rotulo(visOffX, visHMm + 45, '3. VISERA CURVA', nombre, cliente.nombre, 'Cortar 2x (Tela + Entretela Rígida)')}
        ${hiloTela(visOffX + visWMm * 0.5, 10, visHMm - 10)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, Math.max(anchoTapaMm, latHMm) + 140);
  },

  // 2. Bucket Hat / Gorra Piluso
  bob: (m, cliente, nombre) => {
    const coronaR = 85; // radio 8.5 cm
    const coronaDiam = coronaR * 2;

    const paredW = 290;
    const paredH = 95;
    const paredOffX = coronaDiam + 70;

    const alaW = 320;
    const alaH = 80;
    const alaOffX = paredOffX + paredW + 70;

    const content = `
      <!-- CORONA SUPERIOR -->
      <g>
        <circle cx="${coronaR}" cy="${coronaR}" r="${coronaR}" class="cut-line" />
        ${rotulo(0, coronaDiam + 25, '1. CORONA SUPERIOR', nombre, cliente.nombre, 'Cortar 1x (Tela + Forro)')}
        ${hiloTela(coronaR, 20, coronaDiam - 20)}
      </g>

      <!-- PARED LATERAL -->
      <g>
        <path d="M ${f(paredOffX)},20 Q ${f(paredOffX + paredW / 2)},0 ${f(paredOffX + paredW)},20 L ${f(paredOffX + paredW - 20)},${f(paredH + 20)} Q ${f(paredOffX + paredW / 2)},${f(paredH + 40)} ${f(paredOffX + 20)},${f(paredH + 20)} Z" class="cut-line" />
        ${rotulo(paredOffX, paredH + 50, '2. PARED LATERAL', nombre, cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(paredOffX + paredW / 2, 20, paredH + 15)}
      </g>

      <!-- ALA PESCADOR -->
      <g>
        <path d="M ${f(alaOffX)},30 Q ${f(alaOffX + alaW / 2)},-25 ${f(alaOffX + alaW)},30 L ${f(alaOffX + alaW + 25)},${f(alaH + 40)} Q ${f(alaOffX + alaW / 2)},${f(alaH + 85)} ${f(alaOffX - 25)},${f(alaH + 40)} Z" class="cut-line" />
        ${rotulo(alaOffX, alaH + 80, '3. ALA PESCADOR', nombre, cliente.nombre, 'Cortar 2x (Tela + Entretela)')}
        ${hiloTela(alaOffX + alaW / 2, 20, alaH + 30)}
      </g>

      ${cajaCalibracion(alaOffX + alaW + 50, 20)}
    `;

    return wrapSvg(content, alaOffX + alaW + 180, 320);
  },

  // 3. Gorra Deerstalker / Sherlock Holmes
  holmes: (m, cliente, nombre) => {
    const gajoW = 140;
    const gajoH = 220;

    const visOffX = gajoW + 70;
    const visW = 180;
    const visH = 95;

    const orejOffX = visOffX + visW + 70;
    const orejW = 130;
    const orejH = 150;

    const content = `
      <!-- GAJOS CORONA -->
      <g>
        <path d="M ${f(gajoW / 2)},0 Q ${f(gajoW * 0.9)},${f(gajoH * 0.4)} ${f(gajoW)},${f(gajoH)} Q ${f(gajoW / 2)},${f(gajoH + 15)} 0,${f(gajoH)} Q ${f(gajoW * 0.1)},${f(gajoH * 0.4)} ${f(gajoW / 2)},0 Z" class="cut-line" />
        ${rotulo(0, gajoH + 30, '1. GAJOS CORONA', nombre, cliente.nombre, 'Cortar 6x (Tela + Forro)')}
        ${hiloTela(gajoW / 2, 20, gajoH - 20)}
      </g>

      <!-- VISERAS DOBLES -->
      <g>
        <path d="M ${f(visOffX)},25 Q ${f(visOffX + visW / 2)},-15 ${f(visOffX + visW)},25 Q ${f(visOffX + visW / 2)},${f(visH + 35)} ${f(visOffX)},25 Z" class="cut-line" />
        ${rotulo(visOffX, visH + 50, '2. VISERAS (FRENTE/ATRÁS)', nombre, cliente.nombre, 'Cortar 4x (Tela + Entretela)')}
        ${hiloTela(visOffX + visW / 2, 10, visH + 10)}
      </g>

      <!-- OREJERAS ABATIBLES -->
      <g>
        <path d="M ${f(orejOffX)},0 L ${f(orejOffX + orejW)},0 L ${f(orejOffX + orejW - 10)},${f(orejH * 0.6)} Q ${f(orejOffX + orejW / 2)},${f(orejH + 20)} ${f(orejOffX + 10)},${f(orejH * 0.6)} Z" class="cut-line" />
        ${rotulo(orejOffX, orejH + 30, '3. OREJERAS', nombre, cliente.nombre, 'Cortar 4x + Cintas')}
        ${hiloTela(orejOffX + orejW / 2, 20, orejH - 20)}
      </g>

      ${cajaCalibracion(orejOffX + orejW + 50, 20)}
    `;

    return wrapSvg(content, orejOffX + orejW + 180, 360);
  },

  // 4. Delantal de Cocina / Taller Gastronómico
  albert: (m, cliente, nombre) => {
    const anchoPechera = 240;
    const anchoFalda = 720;
    const largoDelantal = 860;
    const altoPechera = 260;

    const delPath = `M 0,0 
      L ${f(anchoPechera)},0 
      Q ${f(anchoPechera + 60)},${f(altoPechera * 0.6)} ${f(anchoFalda)},${f(altoPechera)} 
      L ${f(anchoFalda)},${f(largoDelantal)} 
      L 0,${f(largoDelantal)} Z`;

    const bolsOffX = anchoFalda + 70;
    const bolsW = 320;
    const bolsH = 220;

    const scaleX = bolsOffX + bolsW + 50;

    const content = `
      <!-- CUERPO DELANTAL -->
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoDelantal)}" class="fold-line" />
        ${rotulo(20, largoDelantal * 0.4, '1. CUERPO DELANTAL', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(anchoFalda * 0.5, altoPechera + 50, largoDelantal - 80)}
        <text class="text-sub" x="15" y="${f(largoDelantal - 25)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <!-- BOLSILLO DIVIDIDO -->
      <g>
        <rect x="${f(bolsOffX)}" y="0" width="${f(bolsW)}" height="${f(bolsH)}" rx="8" class="cut-line" />
        <line x1="${f(bolsOffX + bolsW / 2)}" y1="0" x2="${f(bolsOffX + bolsW / 2)}" y2="${f(bolsH)}" class="seam-line" />
        ${rotulo(bolsOffX, bolsH + 20, '2. BOLSILLO COMPARTIMENTADO', nombre, cliente.nombre, 'Cortar 1x')}
        ${hiloTela(bolsOffX + bolsW / 2, 20, bolsH - 20)}
      </g>

      <!-- CINTAS -->
      <g transform="translate(${f(bolsOffX)}, ${f(bolsH + 120)})">
        <rect x="0" y="0" width="${f(bolsW)}" height="50" rx="4" class="cut-line" />
        <text class="text-sub" x="10" y="30" fill="#38bdf8">3. CINTAS AMARRE (Cortar 3x de 70x3 cm)</text>
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, largoDelantal + 50);
  },

  // 5. Tiburón de Peluche Artesanal
  hi: (m, cliente, nombre) => {
    const cuerpoW = 480;
    const cuerpoH = 200;

    const panzaW = 440;
    const panzaH = 140;
    const panzaOffX = cuerpoW + 70;

    const aletaOffX = panzaOffX + panzaW + 70;
    const aletaW = 140;
    const aletaH = 160;

    const content = `
      <!-- LOMO SUPERIOR TIBURÓN -->
      <g>
        <path d="M 0,${f(cuerpoH * 0.5)} Q ${f(cuerpoW * 0.35)},0 ${f(cuerpoW * 0.7)},${f(cuerpoH * 0.15)} L ${f(cuerpoW)},0 L ${f(cuerpoW - 20)},${f(cuerpoH * 0.5)} L ${f(cuerpoW)},${f(cuerpoH)} L ${f(cuerpoW * 0.7)},${f(cuerpoH * 0.85)} Q ${f(cuerpoW * 0.35)},${f(cuerpoH)} 0,${f(cuerpoH * 0.5)} Z" class="cut-line" />
        ${rotulo(10, cuerpoH + 20, '1. LOMO LATERAL', nombre, cliente.nombre, 'Cortar 2x (Gris / Azul)')}
        ${hiloTela(cuerpoW * 0.5, 30, cuerpoH - 30)}
      </g>

      <!-- PANZA INFERIOR -->
      <g>
        <path d="M ${f(panzaOffX)},${f(panzaH * 0.5)} Q ${f(panzaOffX + panzaW * 0.5)},0 ${f(panzaOffX + panzaW)},${f(panzaH * 0.5)} Q ${f(panzaOffX + panzaW * 0.5)},${f(panzaH)} ${f(panzaOffX)},${f(panzaH * 0.5)} Z" class="cut-line" />
        ${rotulo(panzaOffX, panzaH + 30, '2. PANZA INFERIOR', nombre, cliente.nombre, 'Cortar 1x (Blanco)')}
        ${hiloTela(panzaOffX + panzaW * 0.5, 20, panzaH - 20)}
      </g>

      <!-- ALETAS -->
      <g>
        <path d="M ${f(aletaOffX)},${f(aletaH)} L ${f(aletaOffX + aletaW * 0.4)},0 Q ${f(aletaOffX + aletaW)},${f(aletaH * 0.5)} ${f(aletaOffX + aletaW)},${f(aletaH)} Z" class="cut-line" />
        ${rotulo(aletaOffX, aletaH + 20, '3. ALETAS DORSAL Y LATERALES', nombre, cliente.nombre, 'Cortar 6x')}
        ${hiloTela(aletaOffX + aletaW * 0.5, 20, aletaH - 20)}
      </g>

      ${cajaCalibracion(aletaOffX + aletaW + 50, 20)}
    `;

    return wrapSvg(content, aletaOffX + aletaW + 180, 360);
  },

  // 6. Máscara / Antifaz Anatómico
  florence: (m, cliente, nombre) => {
    const masW = 160;
    const masH = 150;

    const maskPath = `M 0,${f(masH * 0.35)} 
      Q ${f(masW * 0.5)},0 ${f(masW)},${f(masH * 0.2)} 
      L ${f(masW)},${f(masH * 0.8)} 
      Q ${f(masW * 0.5)},${f(masH)} 0,${f(masH * 0.65)} Z`;

    const content = `
      <g>
        <path d="${maskPath}" class="cut-line" />
        ${rotulo(0, masH + 25, '1. PANEL FACIAL LATERAL', nombre, cliente.nombre, 'Cortar 4x (Tela + Forro)')}
        ${hiloTela(masW * 0.5, 20, masH - 20)}
      </g>

      <g transform="translate(${f(masW + 70)}, 0)">
        <rect x="0" y="20" width="130" height="45" rx="6" class="cut-line" />
        ${rotulo(0, masH + 25, '2. PUENTE NASAL', nombre, cliente.nombre, 'Cortar 2x')}
      </g>

      ${cajaCalibracion(masW + 250, 20)}
    `;

    return wrapSvg(content, masW + 380, 280);
  },

  // 7. Polainas / Calentadores de Tobillo
  shin: (m, cliente, nombre) => {
    const polW = 280;
    const polH = 340;

    const polPath = `M 20,0 
      L ${f(polW - 20)},0 
      L ${f(polW)},${f(polH * 0.7)} 
      Q ${f(polW * 0.7)},${f(polH)} ${f(polW * 0.5)},${f(polH + 25)} 
      Q ${f(polW * 0.3)},${f(polH)} 0,${f(polH * 0.7)} Z`;

    const content = `
      <g>
        <path d="${polPath}" class="cut-line" />
        ${rotulo(10, polH + 45, '1. CUERPO POLAINA', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(polW * 0.5, 30, polH - 30)}
      </g>

      <g transform="translate(${f(polW + 70)}, 0)">
        <rect x="0" y="30" width="220" height="70" rx="8" class="cut-line" />
        ${rotulo(0, polH + 45, '2. REFUERZO Y CORREA', nombre, cliente.nombre, 'Cortar 4x')}
      </g>

      ${cajaCalibracion(polW + 340, 20)}
    `;

    return wrapSvg(content, polW + 470, polH + 140);
  },

  // 8. Corbata Clásica de Seda
  trayvon: (m, cliente, nombre) => {
    const palaW = 90;
    const palaH = 680;

    const palaOffX = palaW + 70;
    const pala2W = 60;
    const pala2H = 580;

    const content = `
      <!-- PALA DELANTERA EN PUNTA -->
      <g>
        <path d="M 0,${f(palaH)} L ${f(palaW / 2)},${f(palaH + 45)} L ${f(palaW)},${f(palaH)} L ${f(palaW * 0.65)},0 L ${f(palaW * 0.35)},0 Z" class="cut-line" />
        ${rotulo(0, palaH + 65, '1. PALA DELANTERA', nombre, cliente.nombre, 'Cortar 1x Sesgo 45°')}
        ${hiloTela(palaW / 2, 50, palaH - 50)}
      </g>

      <!-- PALA TRASERA Y CUELLO -->
      <g>
        <path d="M ${f(palaOffX)},${f(pala2H)} L ${f(palaOffX + pala2W / 2)},${f(pala2H + 30)} L ${f(palaOffX + pala2W)},${f(pala2H)} L ${f(palaOffX + pala2W * 0.7)},0 L ${f(palaOffX + pala2W * 0.3)},0 Z" class="cut-line" />
        ${rotulo(palaOffX, pala2H + 65, '2. PALA TRASERA', nombre, cliente.nombre, 'Cortar 1x Sesgo 45°')}
        ${hiloTela(palaOffX + pala2W / 2, 50, pala2H - 50)}
      </g>

      ${cajaCalibracion(palaOffX + pala2W + 50, 20)}
    `;

    return wrapSvg(content, palaOffX + pala2W + 180, palaH + 160);
  },

  // ==========================================
  // ROPA INTERIOR, TRAJES DE BAÑO Y CORSETS
  // ==========================================

  // 9. Bóxer Anatómico
  bruce: (m, cliente, nombre) => {
    const cintMm = ((m.cintura || 80) / 4) * 10;
    const cadMm = ((m.cadera || 96) / 4) * 10;
    const largoMm = 300;

    const latPath = `M 0,0 L ${f(cintMm)},0 L ${f(cadMm + 15)},${f(largoMm)} L 0,${f(largoMm)} Z`;

    const copaOffX = cadMm + 60;
    const copaPath = `M ${f(copaOffX)},30 Q ${f(copaOffX + 80)},0 ${f(copaOffX + 90)},${f(largoMm * 0.5)} Q ${f(copaOffX + 60)},${f(largoMm)} ${f(copaOffX)},${f(largoMm - 20)} Z`;

    const scaleX = copaOffX + 130 + 50;

    const content = `
      <g>
        <path d="${latPath}" class="cut-line" />
        ${rotulo(0, largoMm + 20, '1. LATERALES BÓXER', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(cintMm * 0.5, 30, largoMm - 30)}
      </g>

      <g>
        <path d="${copaPath}" class="cut-line" />
        ${rotulo(copaOffX, largoMm + 20, '2. COPAS FRONTALES ERGONÓMICAS', nombre, cliente.nombre, 'Cortar 2x')}
        ${hiloTela(copaOffX + 45, 40, largoMm - 40)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 110);
  },

  // 10. Bikini / Traje de Baño 2 Piezas
  bee: (m, cliente, nombre) => {
    const triW = 160;
    const triH = 170;

    const bombW = 220;
    const bombH = 230;
    const bombOffX = triW + 70;

    const colOffX = bombOffX + bombW + 70;
    const colW = 200;
    const colH = 210;

    const scaleX = colOffX + colW + 50;

    const content = `
      <!-- TRIÁNGULOS CORPIÑO -->
      <g>
        <path d="M ${f(triW / 2)},0 L ${f(triW)},${f(triH)} L 0,${f(triH)} Z" class="cut-line" />
        <line x1="0" y1="${f(triH - 15)}" x2="${f(triW)}" y2="${f(triH - 15)}" class="seam-line" />
        ${rotulo(0, triH + 20, '1. TRIÁNGULO BUSTO', nombre, cliente.nombre, 'Cortar 4x (Tela + Forro)')}
        ${hiloTela(triW / 2, 30, triH - 30)}
      </g>

      <!-- DELANTERO BIKINI -->
      <g>
        <path d="M ${f(bombOffX)},0 L ${f(bombOffX + bombW)},0 Q ${f(bombOffX + bombW * 0.7)},${f(bombH * 0.6)} ${f(bombOffX + bombW * 0.65)},${f(bombH)} L ${f(bombOffX + bombW * 0.35)},${f(bombH)} Q ${f(bombOffX + bombW * 0.3)},${f(bombH * 0.6)} ${f(bombOffX)},0 Z" class="cut-line" />
        ${rotulo(bombOffX, bombH + 20, '2. DELANTERO BIKINI', nombre, cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(bombOffX + bombW / 2, 20, bombH - 20)}
      </g>

      <!-- TRASERO BIKINI / COLALESS -->
      <g>
        <path d="M ${f(colOffX)},0 L ${f(colOffX + colW)},0 Q ${f(colOffX + colW * 0.8)},${f(colH * 0.6)} ${f(colOffX + colW * 0.6)},${f(colH)} L ${f(colOffX + colW * 0.4)},${f(colH)} Q ${f(colOffX + colW * 0.2)},${f(colH * 0.6)} ${f(colOffX)},0 Z" class="cut-line" />
        ${rotulo(colOffX, colH + 20, '3. TRASERO BIKINI', nombre, cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(colOffX + colW / 2, 20, colH - 20)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, Math.max(triH, bombH) + 110);
  },

  // 11. Bustier Moderno con Copas
  lumina: (m, cliente, nombre) => {
    const copaSupW = 150;
    const copaSupH = 90;
    const copaInfW = 160;
    const copaInfH = 95;

    const cuerpoW = 280;
    const cuerpoH = 160;
    const cuerpoOffX = Math.max(copaSupW, copaInfW) + 70;

    const espOffX = cuerpoOffX + cuerpoW + 70;
    const espW = 240;
    const espH = 150;

    const scaleX = espOffX + espW + 50;

    const content = `
      <!-- COPAS BALCONETTE -->
      <g>
        <path d="M 0,0 Q ${f(copaSupW / 2)},-20 ${f(copaSupW)},0 Q ${f(copaSupW / 2)},${f(copaSupH)} 0,0 Z" class="cut-line" />
        ${rotulo(0, copaSupH + 15, '1. COPA SUPERIOR', nombre, cliente.nombre, 'Cortar 4x')}
      </g>

      <g transform="translate(0, ${f(copaSupH + 95)})">
        <path d="M 0,${f(copaInfH)} Q ${f(copaInfW / 2)},0 ${f(copaInfW)},${f(copaInfH)} Z" class="cut-line" />
        ${rotulo(0, copaInfH + 15, '2. COPA INFERIOR', nombre, cliente.nombre, 'Cortar 4x')}
      </g>

      <!-- FAJÓN CENTRAL DELANTERO -->
      <g>
        <path d="M ${f(cuerpoOffX)},0 L ${f(cuerpoOffX + cuerpoW)},0 L ${f(cuerpoOffX + cuerpoW - 20)},${f(cuerpoH)} L ${f(cuerpoOffX)},${f(cuerpoH)} Z" class="cut-line" />
        ${rotulo(cuerpoOffX, cuerpoH + 20, '3. FAJÓN DELANTERO', nombre, cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(cuerpoOffX + cuerpoW / 2, 20, cuerpoH - 20)}
      </g>

      <!-- ESPALDA ELASTIZADA -->
      <g>
        <path d="M ${f(espOffX)},0 L ${f(espOffX + espW)},15 L ${f(espOffX + espW)},${f(espH - 15)} L ${f(espOffX)},${f(espH)} Z" class="cut-line" />
        ${rotulo(espOffX, espH + 20, '4. ESPALDA BUSTIER', nombre, cliente.nombre, 'Cortar 2x')}
        ${hiloTela(espOffX + espW / 2, 20, espH - 20)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, 360);
  },

  // 12. Corset Victoriano Sastre (Cathrin)
  cathrin: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || 92) / 4) * 10;
    const cinturaMm = ((m.cintura || 70) / 4) * 10;
    const altoBustoMm = (m.altoBusto || 25) * 10;
    const largoMm = 370;

    const p1W = bustoMm * 0.45;
    const p1Cint = cinturaMm * 0.4;
    const p1Path = `M 0,0 L ${f(p1W)},0 Q ${f(p1W - 5)},${f(altoBustoMm * 0.6)} ${f(p1Cint)},${f(altoBustoMm)} L ${f(p1Cint - 5)},${f(largoMm)} L 0,${f(largoMm - 20)} Z`;

    const p2OffX = p1W + 40;
    const p2W = bustoMm * 0.55;
    const p2Cint = cinturaMm * 0.5;
    const p2Path = `M ${f(p2OffX)},0 Q ${f(p2OffX + p2W * 0.6)},-20 ${f(p2OffX + p2W)},0 L ${f(p2OffX + p2Cint + 20)},${f(largoMm)} L ${f(p2OffX)},${f(largoMm)} Q ${f(p2OffX + 10)},${f(altoBustoMm * 0.6)} ${f(p2OffX)},0 Z`;

    const p3OffX = p2OffX + p2W + 40;
    const p3W = bustoMm * 0.48;
    const p3Cint = cinturaMm * 0.45;
    const p3Path = `M ${f(p3OffX)},20 L ${f(p3OffX + p3W)},0 L ${f(p3OffX + p3Cint)},${f(largoMm)} L ${f(p3OffX)},${f(largoMm)} Z`;

    const p4OffX = p3OffX + p3W + 40;
    const p4W = bustoMm * 0.45;
    const p4Cint = cinturaMm * 0.42;
    const p4Path = `M ${f(p4OffX)},0 L ${f(p4OffX + p4W)},0 L ${f(p4OffX + p4Cint)},${f(largoMm - 20)} L ${f(p4OffX)},${f(largoMm)} Z`;

    const scaleX = p4OffX + p4W + 50;

    const content = `
      <g>
        <path d="${p1Path}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm - 20)}" class="fold-line" />
        ${rotulo(0, largoMm + 20, '1. CENTRO DELANTERO', nombre, cliente.nombre, 'Cortar 2x (Tela + Forro)')}
        ${hiloTela(p1W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p2Path}" class="cut-line" />
        ${rotulo(p2OffX, largoMm + 20, '2. LATERAL DELANTERO', nombre, cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p2OffX + p2W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p3Path}" class="cut-line" />
        ${rotulo(p3OffX, largoMm + 20, '3. LATERAL ESPALDA', nombre, cliente.nombre, 'Cortar 4x (Par + Forro)')}
        ${hiloTela(p3OffX + p3W * 0.5, 30, largoMm - 40)}
      </g>

      <g>
        <path d="${p4Path}" class="cut-line" />
        ${rotulo(p4OffX, largoMm + 20, '4. CENTRO ESPALDA', nombre, cliente.nombre, 'Cortar 4x (Ojalillos)')}
        ${hiloTela(p4OffX + p4W * 0.5, 30, largoMm - 40)}
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 110);
  },

  // ==========================================
  // FALDAS Y VESTIDOS
  // ==========================================

  // 13. Falda Tubo / Lápiz (Penelope)
  penelope: (m, cliente, nombre) => {
    const cinturaMm = ((m.cintura || 70) / 4) * 10;
    const caderaMm = ((m.cadera || 96) / 4) * 10;
    const altoCaderaMm = (m.altoCadera || 20) * 10;
    const largoMm = (m.largoFalda || 60) * 10;
    const entalleTuboMm = 25;

    const delPath = `M 0,0 
      L ${f(cinturaMm + 15)},0 
      Q ${f(caderaMm + 5)},${f(altoCaderaMm * 0.7)} ${f(caderaMm)},${f(altoCaderaMm)} 
      L ${f(caderaMm - entalleTuboMm)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const trasOffX = caderaMm + 70;
    const trasPath = `M ${f(trasOffX)},0 
      L ${f(trasOffX + cinturaMm + 25)},0 
      Q ${f(trasOffX + caderaMm + 5)},${f(altoCaderaMm * 0.7)} ${f(trasOffX + caderaMm)},${f(altoCaderaMm)} 
      L ${f(trasOffX + caderaMm - entalleTuboMm)},${f(largoMm)} 
      L ${f(trasOffX + 30)},${f(largoMm)} 
      L ${f(trasOffX + 30)},${f(largoMm - 180)} 
      L ${f(trasOffX)},${f(largoMm - 180)} Z`;

    const scaleX = trasOffX + caderaMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. FALDA DELANTERO', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(caderaMm * 0.5, altoCaderaMm + 40, largoMm - 60)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + 20, largoMm * 0.4, '2. ESPALDA CON TAJO', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.5, altoCaderaMm + 40, largoMm - 60)}
        <text class="text-sub" x="${f(trasOffX + 35)}" y="${f(largoMm - 100)}" fill="#38bdf8">CRUCE DE TAJO</text>
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 14. Falda Evasé Acampanada (Sandy)
  sandy: (m, cliente, nombre) => {
    const cinturaMm = ((m.cintura || 70) / 4) * 10;
    const caderaMm = ((m.cadera || 96) / 4 + 1) * 10;
    const altoCaderaMm = (m.altoCadera || 20) * 10;
    const largoMm = (m.largoFalda || 58) * 10;
    const vueloEvaseMm = 80;

    const delPath = `M 0,0 
      L ${f(cinturaMm + 15)},0 
      Q ${f(caderaMm + 10)},${f(altoCaderaMm * 0.7)} ${f(caderaMm)},${f(altoCaderaMm)} 
      L ${f(caderaMm + vueloEvaseMm)},${f(largoMm)} 
      Q ${f((caderaMm + vueloEvaseMm) / 2)},${f(largoMm + 15)} 0,${f(largoMm)} Z`;

    const trasOffX = caderaMm + vueloEvaseMm + 70;
    const trasPath = `M ${f(trasOffX)},0 
      L ${f(trasOffX + cinturaMm + 20)},0 
      Q ${f(trasOffX + caderaMm + 10)},${f(altoCaderaMm * 0.7)} ${f(trasOffX + caderaMm)},${f(altoCaderaMm)} 
      L ${f(trasOffX + caderaMm + vueloEvaseMm)},${f(largoMm)} 
      Q ${f(trasOffX + (caderaMm + vueloEvaseMm) / 2)},${f(largoMm + 15)} ${f(trasOffX)},${f(largoMm)} Z`;

    const scaleX = trasOffX + caderaMm + vueloEvaseMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. FALDA DELANTERO EVASÉ', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(caderaMm * 0.5, altoCaderaMm + 40, largoMm - 60)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + 20, largoMm * 0.4, '2. FALDA ESPALDA EVASÉ', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.5, altoCaderaMm + 40, largoMm - 60)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 15. Túnica Imperial Romana (Tiberius)
  tiberius: (m, cliente, nombre) => {
    const pechoMm = ((m.pecho || m.busto || 96) / 4 + 8) * 10;
    const largoMm = (m.largoEspalda || 110) * 10;
    const caidaHombroMm = 280;

    const tunicaPath = `M 0,40 
      L ${f(caidaHombroMm)},0 
      L ${f(caidaHombroMm - 30)},220 
      L ${f(pechoMm + 40)},220 
      L ${f(pechoMm + 80)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const scaleX = caidaHombroMm + 70;

    const content = `
      <g>
        <path d="${tunicaPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. TÚNICA IMPERIAL', nombre, cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(pechoMm * 0.5, 250, largoMm - 80)}
        <text class="text-sub" x="10" y="${f(largoMm - 25)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 150, largoMm + 50);
  },

  // ==========================================
  // PANTALONES Y BERMUDAS
  // ==========================================

  // 16. Pantalón Chino / Sastre (Charlie)
  charlie: (m, cliente, nombre) => {
    const cinturaMm = ((m.cintura || 76) / 4) * 10;
    const caderaMm = ((m.cadera || 100) / 4) * 10;
    const tiroMm = (m.tiro || 26) * 10;
    const largoMm = (m.largoPantalon || 98) * 10;
    const anchoBotaMm = 210;
    const avanceTiroDelMm = caderaMm * 0.15;
    const avanceTiroTrasMm = caderaMm * 0.35;

    const delPath = `M 0,0 
      L ${f(cinturaMm)},0 
      Q ${f(caderaMm)},${f(tiroMm * 0.6)} ${f(caderaMm)},${f(tiroMm)} 
      L ${f(anchoBotaMm + 40)},${f(largoMm)} 
      L 0,${f(largoMm)} 
      L ${f(-avanceTiroDelMm)},${f(tiroMm)} 
      Q ${f(-avanceTiroDelMm * 0.4)},${f(tiroMm * 0.6)} 0,0 Z`;

    const trasOffX = caderaMm + anchoBotaMm + 80;
    const trasPath = `M ${f(trasOffX)},30 
      L ${f(trasOffX + cinturaMm + 25)},0 
      Q ${f(trasOffX + caderaMm + 10)},${f(tiroMm * 0.6)} ${f(trasOffX + caderaMm + 10)},${f(tiroMm)} 
      L ${f(trasOffX + anchoBotaMm + 60)},${f(largoMm)} 
      L ${f(trasOffX - 20)},${f(largoMm)} 
      L ${f(trasOffX - avanceTiroTrasMm)},${f(tiroMm + 15)} 
      Q ${f(trasOffX - avanceTiroTrasMm * 0.4)},${f(tiroMm * 0.5)} ${f(trasOffX)},30 Z`;

    const scaleX = trasOffX + caderaMm + anchoBotaMm + 60;

    const content = `
      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${delPath}" class="cut-line" />
        ${rotulo(cinturaMm * 0.1, largoMm * 0.35, '1. DELANTERO CHINO', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cinturaMm * 0.1, largoMm * 0.35, '2. TRASERO CHINO', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 17. Pantalón Jogger / Cargo (Paco)
  paco: (m, cliente, nombre) => {
    const cinturaMm = ((m.cintura || 78) / 4 + 3) * 10;
    const caderaMm = ((m.cadera || 102) / 4 + 2) * 10;
    const tiroMm = (m.tiro || 28) * 10;
    const largoMm = (m.largoPantalon || 96) * 10;
    const anchoBotaMm = 180;
    const avanceTiroDelMm = caderaMm * 0.18;
    const avanceTiroTrasMm = caderaMm * 0.38;

    const delPath = `M 0,0 L ${f(cinturaMm)},0 Q ${f(caderaMm)},${f(tiroMm * 0.6)} ${f(caderaMm)},${f(tiroMm)} L ${f(anchoBotaMm + 40)},${f(largoMm)} L 0,${f(largoMm)} L ${f(-avanceTiroDelMm)},${f(tiroMm)} Q ${f(-avanceTiroDelMm * 0.4)},${f(tiroMm * 0.6)} 0,0 Z`;

    const trasOffX = caderaMm + anchoBotaMm + 80;
    const trasPath = `M ${f(trasOffX)},30 L ${f(trasOffX + cinturaMm + 20)},0 Q ${f(trasOffX + caderaMm + 10)},${f(tiroMm * 0.6)} ${f(trasOffX + caderaMm + 10)},${f(tiroMm)} L ${f(trasOffX + anchoBotaMm + 60)},${f(largoMm)} L ${f(trasOffX - 20)},${f(largoMm)} L ${f(trasOffX - avanceTiroTrasMm)},${f(tiroMm + 15)} Q ${f(trasOffX - avanceTiroTrasMm * 0.4)},${f(tiroMm * 0.5)} ${f(trasOffX)},30 Z`;

    const cargoOffX = trasOffX + caderaMm + anchoBotaMm + 70;
    const cargoW = 200;
    const cargoH = 220;

    const scaleX = cargoOffX + cargoW + 50;

    const content = `
      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${delPath}" class="cut-line" />
        ${rotulo(cinturaMm * 0.1, largoMm * 0.35, '1. DELANTERO JOGGER', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <path d="${trasPath}" class="cut-line" />
        ${rotulo(trasOffX + cinturaMm * 0.1, largoMm * 0.35, '2. TRASERO JOGGER', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(trasOffX + caderaMm * 0.4, tiroMm + 50, largoMm - 100)}
      </g>

      <g transform="translate(${f(avanceTiroDelMm + 20)}, 0)">
        <rect x="${f(cargoOffX)}" y="30" width="${f(cargoW)}" height="${f(cargoH)}" rx="8" class="cut-line" />
        <path d="M ${f(cargoOffX - 10)},30 L ${f(cargoOffX + cargoW + 10)},30 L ${f(cargoOffX + cargoW / 2)},70 Z" class="cut-line" />
        ${rotulo(cargoOffX, cargoH + 60, '3. BOLSILLO CARGO CON TAPA', nombre, cliente.nombre, 'Cortar 2x')}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 18. Pantalón Envolvente Tailandés (Waralee)
  waralee: (m, cliente, nombre) => {
    const caderaMm = ((m.cadera || 98) / 2 + 10) * 10;
    const tiroMm = (m.tiro || 32) * 10;
    const largoMm = (m.largoPantalon || 98) * 10;

    const wrapPath = `M 0,0 
      L ${f(caderaMm)},0 
      L ${f(caderaMm)},${f(largoMm)} 
      L ${f(caderaMm * 0.35)},${f(largoMm)} 
      L ${f(caderaMm * 0.35)},${f(tiroMm)} 
      Q 0,${f(tiroMm)} 0,0 Z`;

    const scaleX = caderaMm + 70;

    const content = `
      <g>
        <path d="${wrapPath}" class="cut-line" />
        ${rotulo(20, largoMm * 0.4, '1. PATA ENVOLVENTE', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(caderaMm * 0.6, 50, largoMm - 100)}
      </g>

      <g transform="translate(${f(scaleX)}, 150)">
        <rect x="0" y="0" width="180" height="40" rx="4" class="cut-line" />
        <text class="text-sub" x="10" y="25" fill="#38bdf8">2. LAZOS (Cortar 2x de 90x4 cm)</text>
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 220, largoMm + 50);
  },

  // ==========================================
  // TOPS, REMERAS, BLUSAS Y BUZOS
  // ==========================================

  // 19. Buzo Canguro con Capucha (Huey / Hoodie)
  huey: (m, cliente, nombre) => {
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

    const bolsOffX = capOffX + capWMm + 60;
    const bolsWMm = 260;
    const bolsHMm = 220;
    const bolsPath = `M ${f(bolsOffX)},0 L ${f(bolsOffX + bolsWMm * 0.6)},0 L ${f(bolsOffX + bolsWMm)},${f(bolsHMm * 0.5)} L ${f(bolsOffX + bolsWMm)},${f(bolsHMm)} L ${f(bolsOffX)},${f(bolsHMm)} Z`;

    const scaleX = bolsOffX + bolsWMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. CUERPO DELANTERO/ESPALDA', nombre, cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${capPath}" class="cut-line" />
        ${rotulo(capOffX, capHMm + 20, '2. CAPUCHA FORRADA', nombre, cliente.nombre, 'Cortar 4x (Tela + Forro)')}
        ${hiloTela(capOffX + capWMm * 0.5, 30, capHMm - 50)}
      </g>

      <g>
        <path d="${bolsPath}" class="cut-line" />
        <path d="M ${f(bolsOffX)},0 L ${f(bolsOffX)},${f(bolsHMm)}" class="fold-line" />
        ${rotulo(bolsOffX, bolsHMm + 20, '3. BOLSILLO CANGURO', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(bolsOffX + bolsWMm * 0.5, 20, bolsHMm - 20)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 20. Remera Básica Clásica (Teagan)
  teagan: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || m.pecho || 96) / 4 + 2) * 10;
    const largoMm = (m.largoEspalda || 65) * 10;
    const hombroMm = ((m.espalda || 40) / 2) * 10;
    const caidaHombroMm = 35;
    const sisaMm = ((m.busto || 96) / 4 + 1) * 10;
    const escoteAnchoMm = ((m.cuello || 38) / 6 + 1.5) * 10;
    const escoteProfDelMm = ((m.cuello || 38) / 6 + 4.5) * 10;
    const escoteProfEspMm = 25;

    const delPath = `M 0,${f(escoteProfDelMm)} 
      Q ${f(escoteAnchoMm * 0.4)},${f(escoteProfDelMm)} ${f(escoteAnchoMm)},0 
      L ${f(hombroMm)},${f(caidaHombroMm)} 
      Q ${f(hombroMm - 15)},${f(sisaMm * 0.6)} ${f(bustoMm)},${f(sisaMm)} 
      L ${f(bustoMm)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const espOffX = bustoMm + 60;
    const espPath = `M ${f(espOffX)},${f(escoteProfEspMm)} 
      Q ${f(espOffX + escoteAnchoMm * 0.5)},${f(escoteProfEspMm)} ${f(espOffX + escoteAnchoMm)},0 
      L ${f(espOffX + hombroMm)},${f(caidaHombroMm)} 
      Q ${f(espOffX + hombroMm - 5)},${f(sisaMm * 0.6)} ${f(espOffX + bustoMm)},${f(sisaMm)} 
      L ${f(espOffX + bustoMm)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

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
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(bustoMm * 0.45, sisaMm + 40, largoMm - 60)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + bustoMm * 0.45, sisaMm + 40, largoMm - 60)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${mangaPath}" class="cut-line" />
        ${rotulo(mangaOffX, mangaLargoMm + mangaCopaMm + 30, '3. MANGA CORTA', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(mangaOffX + mangaAnchoMm / 2, mangaCopaMm + 20, mangaLargoMm + mangaCopaMm - 20)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 21. Musculosa Básica (Aaron)
  aaron: (m, cliente, nombre) => {
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
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO MUSCULOSA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(bustoMm * 0.45, sisaMm + 30, largoMm - 50)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA MUSCULOSA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + bustoMm * 0.45, sisaMm + 30, largoMm - 50)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 22. Blusa Drapeada con Escote al Cuello (Diana)
  diana: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || 92) / 4 + 3) * 10;
    const largoMm = (m.largoEspalda || 60) * 10;
    const sisaMm = 240;

    const delPath = `M 0,0 
      L ${f(bustoMm + 80)},0 
      L ${f(bustoMm + 20)},${f(sisaMm)} 
      L ${f(bustoMm)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const espOffX = bustoMm + 120;
    const espPath = `M ${f(espOffX)},25 L ${f(espOffX + bustoMm)},0 L ${f(espOffX + bustoMm)},${f(sisaMm)} L ${f(espOffX + bustoMm - 10)},${f(largoMm)} L ${f(espOffX)},${f(largoMm)} Z`;

    const scaleX = espOffX + bustoMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO DRAPEADO EN CASCADA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(bustoMm * 0.5, sisaMm + 30, largoMm - 50)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA ENTALLADA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + bustoMm * 0.5, sisaMm + 30, largoMm - 50)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 23. Top Kimono Envolvente (Tamiko)
  tamiko: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || 92) / 4 + 4) * 10;
    const largoMm = (m.largoEspalda || 58) * 10;
    const mangaKimonoMm = 280;

    const kimonoPath = `M 0,0 
      L ${f(bustoMm + mangaKimonoMm)},0 
      L ${f(bustoMm + mangaKimonoMm)},180 
      L ${f(bustoMm + 40)},220 
      L ${f(bustoMm)},${f(largoMm)} 
      L 0,${f(largoMm)} Z`;

    const scaleX = bustoMm + mangaKimonoMm + 60;

    const content = `
      <g>
        <path d="${kimonoPath}" class="cut-line" />
        <path d="M 0,0 L 0,${f(largoMm)}" class="fold-line" />
        ${rotulo(20, largoMm * 0.4, '1. CUERPO KIMONO ENVOLVENTE', nombre, cliente.nombre, 'Cortar 2x al Doblez')}
        ${hiloTela(bustoMm * 0.5, 250, largoMm - 60)}
        <text class="text-sub" x="10" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      ${cajaCalibracion(scaleX, 20)}
    `;

    return wrapSvg(content, scaleX + 150, largoMm + 50);
  },

  // 24. Camisa Clásica de Vestir (Simon / Simone)
  simon: (m, cliente, nombre) => {
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
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO CON CARTERA', nombre, cliente.nombre, 'Cortar 2x (Par)')}
        ${hiloTela(pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA CON CANESÚ', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pechoMm * 0.4, sisaMm + 50, largoMm - 80)}
        <text class="text-sub" x="${f(espOffX + 10)}" y="${f(largoMm - 20)}" fill="#fbbf24" font-weight="bold">DOBLEZ DE TELA</text>
      </g>

      <g>
        <path d="${piePath}" class="cut-line" />
        <path d="${cuelloPath}" class="cut-line" />
        ${rotulo(cuelloOffX, 180, '3. CUELLO Y PIE DE CUELLO', nombre, cliente.nombre, 'Cortar 2x + Entretela')}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 25. Chaleco Sastre Formal (Wahid)
  wahid: (m, cliente, nombre) => {
    const pechoMm = ((m.pecho || m.busto || 96) / 4 + 2) * 10;
    const cinturaMm = ((m.cintura || 80) / 4 + 1.5) * 10;
    const largoMm = 560;

    const delPath = `M 0,160 
      L 80,0 
      L 140,25 
      Q 130,120 ${f(pechoMm)},180 
      L ${f(cinturaMm)},${f(largoMm - 40)} 
      L 0,${f(largoMm)} Z`;

    const espOffX = pechoMm + 60;
    const espPath = `M ${f(espOffX)},25 L ${f(espOffX + 120)},0 L ${f(espOffX + 140)},25 Q ${f(espOffX + 130)},120 ${f(espOffX + pechoMm)},180 L ${f(espOffX + cinturaMm - 10)},${f(largoMm - 40)} L ${f(espOffX)},${f(largoMm - 40)} Z`;

    const scaleX = espOffX + pechoMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO EN PUNTA SASTRE', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(pechoMm * 0.45, 200, largoMm - 80)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        <path d="M ${f(espOffX)},0 L ${f(espOffX)},${f(largoMm - 40)}" class="fold-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA EN FORRERÍA', nombre, cliente.nombre, 'Cortar 1x al Doblez')}
        ${hiloTela(espOffX + pechoMm * 0.45, 200, largoMm - 80)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 26. Blazer / Saco Sastre con Solapa (Jaeger / Bent)
  jaeger: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || 96) / 4 + 3) * 10;
    const cinturaMm = ((m.cintura || 74) / 4 + 2) * 10;
    const caderaMm = ((m.cadera || 100) / 4 + 2) * 10;
    const largoMm = 680;

    // Delantero con Solapa Sastre
    const delPath = `M -30,220 
      L 30,120 
      L 120,0 
      L 180,30 
      Q 170,160 ${f(bustoMm)},220 
      L ${f(cinturaMm)},400 
      L ${f(caderaMm)},${f(largoMm)} 
      L -30,${f(largoMm)} Z`;

    const espOffX = caderaMm + 80;
    const espPath = `M ${f(espOffX)},25 
      L ${f(espOffX + 110)},0 
      L ${f(espOffX + 170)},30 
      Q ${f(espOffX + 160)},160 ${f(espOffX + bustoMm)},220 
      L ${f(espOffX + cinturaMm)},400 
      L ${f(espOffX + caderaMm)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

    const scaleX = espOffX + caderaMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO CON SOLAPA SASTRE', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(bustoMm * 0.45, 260, largoMm - 80)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA SASTRE', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(espOffX + bustoMm * 0.45, 260, largoMm - 80)}
      </g>

      ${cajaCalibracion(scaleX, largoMm - 110)}
    `;

    return wrapSvg(content, scaleX + 120, largoMm + 50);
  },

  // 27. Abrigo Largo de Invierno / Trench Coat (Carlton / Carlita)
  carlton: (m, cliente, nombre) => {
    const bustoMm = ((m.busto || 98) / 4 + 5) * 10;
    const caderaMm = ((m.cadera || 104) / 4 + 6) * 10;
    const largoMm = (m.largoEspalda || 105) * 10;

    const delPath = `M -40,260 
      L 40,140 
      L 140,0 
      L 200,35 
      Q 190,180 ${f(bustoMm)},240 
      L ${f(caderaMm + 40)},${f(largoMm)} 
      L -40,${f(largoMm)} Z`;

    const espOffX = caderaMm + 100;
    const espPath = `M ${f(espOffX)},30 
      L ${f(espOffX + 130)},0 
      L ${f(espOffX + 190)},35 
      Q ${f(espOffX + 180)},180 ${f(espOffX + bustoMm)},240 
      L ${f(espOffX + caderaMm + 30)},${f(largoMm)} 
      L ${f(espOffX)},${f(largoMm)} Z`;

    const scaleX = espOffX + caderaMm + 50;

    const content = `
      <g>
        <path d="${delPath}" class="cut-line" />
        ${rotulo(20, largoMm * 0.4, '1. DELANTERO ABRIGO CRUZADO', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(bustoMm * 0.45, 280, largoMm - 100)}
      </g>

      <g>
        <path d="${espPath}" class="cut-line" />
        ${rotulo(espOffX + 20, largoMm * 0.4, '2. ESPALDA CON ABERTURA', nombre, cliente.nombre, 'Cortar 2x (Par + Forro)')}
        ${hiloTela(espOffX + bustoMm * 0.45, 280, largoMm - 100)}
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

  const id = String(tipoMoldeId).toLowerCase().trim();
  const nombreMolde = opciones.moldeNombre || 'Patrón';

  // 1. Accesorios Específicos
  if (id === 'florent') return GENERADORES_ESPECIFICOS.florent(m, cliente, nombreMolde);
  if (id === 'bob') return GENERADORES_ESPECIFICOS.bob(m, cliente, nombreMolde);
  if (id === 'holmes') return GENERADORES_ESPECIFICOS.holmes(m, cliente, nombreMolde);
  if (id === 'albert') return GENERADORES_ESPECIFICOS.albert(m, cliente, nombreMolde);
  if (id === 'hi') return GENERADORES_ESPECIFICOS.hi(m, cliente, nombreMolde);
  if (id === 'florence') return GENERADORES_ESPECIFICOS.florence(m, cliente, nombreMolde);
  if (id === 'shin') return GENERADORES_ESPECIFICOS.shin(m, cliente, nombreMolde);
  if (id === 'trayvon') return GENERADORES_ESPECIFICOS.trayvon(m, cliente, nombreMolde);

  // 2. Ropa Interior, Trajes de Baño y Corsets
  if (id === 'bruce') return GENERADORES_ESPECIFICOS.bruce(m, cliente, nombreMolde);
  if (id === 'bee') return GENERADORES_ESPECIFICOS.bee(m, cliente, nombreMolde);
  if (id === 'lumina') return GENERADORES_ESPECIFICOS.lumina(m, cliente, nombreMolde);
  if (id === 'cathrin') return GENERADORES_ESPECIFICOS.cathrin(m, cliente, nombreMolde);

  // 3. Faldas y Vestidos
  if (id === 'penelope') return GENERADORES_ESPECIFICOS.penelope(m, cliente, nombreMolde);
  if (id === 'sandy') return GENERADORES_ESPECIFICOS.sandy(m, cliente, nombreMolde);
  if (id === 'lucy') return GENERADORES_ESPECIFICOS.penelope(m, cliente, nombreMolde);
  if (id === 'tiberius') return GENERADORES_ESPECIFICOS.tiberius(m, cliente, nombreMolde);

  // 4. Pantalones y Shorts
  if (id === 'charlie' || id === 'titan' || id === 'cornelius') return GENERADORES_ESPECIFICOS.charlie(m, cliente, nombreMolde);
  if (id === 'paco') return GENERADORES_ESPECIFICOS.paco(m, cliente, nombreMolde);
  if (id === 'waralee') return GENERADORES_ESPECIFICOS.waralee(m, cliente, nombreMolde);

  // 5. Buzos, Abrigos y Chaquetas
  if (id === 'huey' || id === 'hugo' || id === 'sven' || id === 'yuri') return GENERADORES_ESPECIFICOS.huey(m, cliente, nombreMolde);
  if (id === 'carlton' || id === 'carlita') return GENERADORES_ESPECIFICOS.carlton(m, cliente, nombreMolde);
  if (id === 'jaeger' || id === 'bent') return GENERADORES_ESPECIFICOS.jaeger(m, cliente, nombreMolde);
  if (id === 'wahid') return GENERADORES_ESPECIFICOS.wahid(m, cliente, nombreMolde);

  // 6. Camisas y Tops
  if (id === 'simon' || id === 'simone') return GENERADORES_ESPECIFICOS.simon(m, cliente, nombreMolde);
  if (id === 'aaron') return GENERADORES_ESPECIFICOS.aaron(m, cliente, nombreMolde);
  if (id === 'diana') return GENERADORES_ESPECIFICOS.diana(m, cliente, nombreMolde);
  if (id === 'tamiko') return GENERADORES_ESPECIFICOS.tamiko(m, cliente, nombreMolde);
  if (id === 'bella' || id === 'breanna' || id === 'brian') return GENERADORES_ESPECIFICOS.teagan(m, cliente, nombreMolde);

  // Fallback seguro
  return GENERADORES_ESPECIFICOS.teagan(m, cliente, nombreMolde);
}
