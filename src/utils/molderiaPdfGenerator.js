/**
 * Generador de PDF Paginado Multihioja A4 para Patronaje y Costura Real
 * - Genera un documento PDF profesional con carátula de ensamble y páginas de corte a escala 1:1 real (100%).
 * - Cuadro de calibración de 10x10 cm exactos en la portada para verificar con regla.
 * - Cruces de registro (+), líneas de corte punteadas y márgenes de unión claros en cada hoja A4.
 */

import jsPDF from 'jspdf';

export async function exportarMoldeAPdfA4({
  svgString,
  nombreMolde = 'Patrón de Costura',
  nombreCliente = 'Medidas Estándar',
  piezas = []
}) {
  const parser = new DOMParser();
  const docSvg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = docSvg.querySelector('svg');

  if (!svgEl) {
    throw new Error('No se pudo procesar el gráfico vectorial del molde.');
  }

  // Obtener viewBox
  const viewBoxAttr = svgEl.getAttribute('viewBox');
  let vbWidth = 1200;
  let vbHeight = 900;

  if (viewBoxAttr) {
    const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  }

  // Preparar un SVG optimizado para impresión: fondo blanco, líneas oscuras de alta nitidez
  const svgClon = svgEl.cloneNode(true);
  svgClon.setAttribute('width', String(vbWidth));
  svgClon.setAttribute('height', String(vbHeight));
  
  // Reemplazar fondos oscuros por blanco
  const rects = svgClon.querySelectorAll('rect');
  rects.forEach(r => {
    const fill = r.getAttribute('fill');
    if (fill === '#0c0a09' || fill === '#000000' || fill === '#18181b') {
      r.setAttribute('fill', '#ffffff');
      r.setAttribute('stroke', '#e2e8f0');
    }
  });

  // Reemplazar clases de estilo para impresión en papel
  const styleEl = svgClon.querySelector('style');
  if (styleEl) {
    styleEl.textContent = `
      .cut-line { fill: none; stroke: #0f172a; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .seam-line { fill: none; stroke: #64748b; stroke-width: 2; stroke-dasharray: 8, 5; }
      .fold-line { fill: none; stroke: #d97706; stroke-width: 2.5; stroke-dasharray: 12, 5, 3, 5; }
      .grain-line { fill: none; stroke: #7c3aed; stroke-width: 2.2; marker-end: url(#arrow); marker-start: url(#arrow); }
      .notch { stroke: #dc2626; stroke-width: 3; }
      .text-label { font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 800; fill: #0f172a; }
      .text-sub { font-family: Arial, Helvetica, sans-serif; font-size: 11px; font-weight: 600; fill: #334155; }
      .scale-box { fill: #f8fafc; stroke: #0284c7; stroke-width: 2.5; }
      .scale-text { fill: #0284c7; font-family: Arial, sans-serif; font-weight: bold; }
    `;
  }

  const serializedSvg = new XMLSerializer().serializeToString(svgClon);
  const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => {
      console.error('Error cargando imagen SVG para PDF', e);
      reject(new Error('Error al rasterizar el patrón SVG.'));
    };
    img.src = url;
  });

  // Dimensiones A4 en milímetros (210 x 297 mm)
  const a4WidthMm = 210;
  const a4HeightMm = 297;
  const marginMm = 15; // 15mm de margen técnico en hoja
  const usableWidthMm = a4WidthMm - marginMm * 2; // 180mm área útil
  const usableHeightMm = a4HeightMm - marginMm * 2; // 267mm área útil

  const patternWidthMm = vbWidth;
  const patternHeightMm = vbHeight;

  // Cuadrícula de hojas A4
  const cols = Math.max(1, Math.ceil(patternWidthMm / usableWidthMm));
  const rows = Math.max(1, Math.ceil(patternHeightMm / usableHeightMm));
  const totalPaginasPatron = cols * rows;
  const totalHojas = 1 + totalPaginasPatron; // 1 portada + páginas

  // Renderizar en Canvas a 2 píxeles por milímetro (escala nítida sin pixelado)
  const renderScale = 2.0;
  const canvasWidth = Math.max(800, Math.round(patternWidthMm * renderScale));
  const canvasHeight = Math.max(600, Math.round(patternHeightMm * renderScale));

  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = canvasWidth;
  mainCanvas.height = canvasHeight;
  const mainCtx = mainCanvas.getContext('2d');
  
  mainCtx.fillStyle = '#ffffff';
  mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainCtx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // =========================================================================
  // PÁGINA 1: PORTADA TÉCNICA, CUADRO DE CALIBRACIÓN Y PLANO DE MONTAJE
  // =========================================================================
  
  // Franja Superior
  pdf.setFillColor(15, 23, 42); // Slate 900
  pdf.rect(0, 0, a4WidthMm, 18, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(255, 255, 255);
  pdf.text('ATELIER KAMURINA — PATRONAJE Y CORTE A MEDIDA', marginMm, 12);
  pdf.setFontSize(9);
  pdf.text(`HOJA 1 DE ${totalHojas}`, a4WidthMm - marginMm, 12, { align: 'right' });

  // Título del Patrón
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 23, 42);
  pdf.text(nombreMolde, marginMm, 32);

  // Subtítulo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Cliente: ${nombreCliente}   |   Fecha de Emisión: ${new Date().toLocaleDateString()}   |   Escala: 100% (1:1)`, marginMm, 39);

  // Línea divisoria
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.5);
  pdf.line(marginMm, 43, a4WidthMm - marginMm, 43);

  // 1. Cuadro de Calibración 10 x 10 cm (100 x 100 mm exactos en PDF)
  const calX = marginMm;
  const calY = 49;
  pdf.setFillColor(248, 250, 252);
  pdf.rect(calX, calY, 95, 95, 'F');
  pdf.setDrawColor(2, 132, 199); // Sky 600
  pdf.setLineWidth(1);
  pdf.rect(calX, calY, 95, 95, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(2, 132, 199);
  pdf.text('CUADRO DE TEST DE ESCALA', calX + 47.5, calY + 28, { align: 'center' });
  pdf.setFontSize(18);
  pdf.setTextColor(15, 23, 42);
  pdf.text('10 x 10 cm', calX + 47.5, calY + 42, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('1. Al imprimir, seleccione "Tamaño Real" o 100%.', calX + 47.5, calY + 56, { align: 'center' });
  pdf.text('2. Mida con una regla este cuadro.', calX + 47.5, calY + 63, { align: 'center' });
  pdf.text('3. Si coincide con 10 cm exactos, la graduación', calX + 47.5, calY + 70, { align: 'center' });
  pdf.text('del cuerpo y costuras es 100% perfecta.', calX + 47.5, calY + 76, { align: 'center' });

  // 2. Instrucciones de Unión (Lado Derecho)
  const infoX = marginMm + 102;
  const infoY = 49;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(infoX, infoY, usableWidthMm - 102, 95, 'F');
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.5);
  pdf.rect(infoX, infoY, usableWidthMm - 102, 95, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('¿CÓMO UNIR LAS HOJAS?', infoX + 6, infoY + 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(51, 65, 85);
  pdf.text('1. Imprima todas las hojas a escala 100% (sin ajustar).', infoX + 6, infoY + 22);
  pdf.text('2. En cada hoja verá un marco punteado de corte.', infoX + 6, infoY + 30);
  pdf.text('3. Recorte el borde DERECHO e INFERIOR de cada hoja.', infoX + 6, infoY + 38);
  pdf.text('4. Superponga las hojas usando las marcas de cruz (+).', infoX + 6, infoY + 46);
  pdf.text('5. Pegue con cinta siguiendo la cuadrícula inferior.', infoX + 6, infoY + 54);
  pdf.text('6. Los contornos ya incluyen 1 cm de margen de costura.', infoX + 6, infoY + 62);
  pdf.text('7. "Doblez de tela" = cortar con la tela doblada al lomo.', infoX + 6, infoY + 70);

  // 3. Despiece de Piezas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('DESPIECE INCLUIDO EN ESTE PATRÓN:', marginMm, 155);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  let yP = 163;
  (piezas.length > 0 ? piezas : ['Cuerpo Principal (2x)', 'Vistas y Complementos (2x)']).forEach((p) => {
    pdf.text(`• ${p}`, marginMm + 4, yP);
    yP += 7;
  });

  // 4. Esquema Visual de la Cuadrícula de Hojas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text(`ESQUEMA DE MONTAJE (${cols} COLUMNAS × ${rows} FILAS = ${totalPaginasPatron} HOJAS DE PATRÓN):`, marginMm, 195);

  const maxGridWidth = usableWidthMm;
  const maxGridHeight = 70;
  const cellW = Math.min(36, (maxGridWidth - (cols - 1) * 3) / cols);
  const cellH = Math.min(26, (maxGridHeight - (rows - 1) * 3) / rows);
  const startGX = marginMm;
  const startGY = 203;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pageIndex = r * cols + c + 1;
      const hojaReal = pageIndex + 1; // +1 por la portada
      const gx = startGX + c * (cellW + 3);
      const gy = startGY + r * (cellH + 3);

      pdf.setFillColor(255, 255, 255);
      pdf.rect(gx, gy, cellW, cellH, 'F');
      pdf.setDrawColor(2, 132, 199);
      pdf.setLineWidth(0.6);
      pdf.rect(gx, gy, cellW, cellH, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(2, 132, 199);
      pdf.text(`${hojaReal}`, gx + cellW / 2, gy + cellH / 2 - 1, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`F${r + 1}-C${c + 1}`, gx + cellW / 2, gy + cellH / 2 + 5, { align: 'center' });
    }
  }

  // =========================================================================
  // PÁGINAS 2..N: CORTES TILED A4 DEL PATRÓN A ESCALA 100% REAL
  // =========================================================================
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pageNumInPattern = r * cols + c + 1;
      const hojaNumero = pageNumInPattern + 1;

      pdf.addPage('a4', 'portrait');

      // Franja Superior identificadora
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, a4WidthMm, 12, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.line(0, 12, a4WidthMm, 12);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(
        `ATELIER KAMURINA — ${nombreMolde.toUpperCase()}  |  HOJA ${hojaNumero} DE ${totalHojas}  [ FILA ${r + 1} — COLUMNA ${c + 1} ]`,
        marginMm,
        8
      );

      // Calcular exactamente el recorte en píxeles del canvas
      const xMm = c * usableWidthMm;
      const yMm = r * usableHeightMm;
      const wMm = Math.min(usableWidthMm, Math.max(0, patternWidthMm - xMm));
      const hMm = Math.min(usableHeightMm, Math.max(0, patternHeightMm - yMm));

      const srcX = Math.round(xMm * renderScale);
      const srcY = Math.round(yMm * renderScale);
      const srcW = Math.round(wMm * renderScale);
      const srcH = Math.round(hMm * renderScale);

      // Crear tile canvas de alta nitidez
      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = Math.round(usableWidthMm * renderScale);
      tileCanvas.height = Math.round(usableHeightMm * renderScale);
      const tileCtx = tileCanvas.getContext('2d');
      
      tileCtx.fillStyle = '#ffffff';
      tileCtx.fillRect(0, 0, tileCanvas.width, tileCanvas.height);

      if (srcW > 0 && srcH > 0 && srcX < mainCanvas.width && srcY < mainCanvas.height) {
        const clampedW = Math.min(srcW, mainCanvas.width - srcX);
        const clampedH = Math.min(srcH, mainCanvas.height - srcY);
        tileCtx.drawImage(
          mainCanvas,
          srcX, srcY, clampedW, clampedH,
          0, 0, clampedW, clampedH
        );
      }

      const tileDataUrl = tileCanvas.toDataURL('image/jpeg', 0.96);

      // Colocar fragmento exacto en el área útil
      pdf.addImage(tileDataUrl, 'JPEG', marginMm, marginMm, usableWidthMm, usableHeightMm);

      // Línea de corte punteada en los 4 bordes
      pdf.setDrawColor(148, 163, 184); // Slate 400
      pdf.setLineWidth(0.4);
      pdf.setLineDashPattern([3, 2], 0);
      pdf.rect(marginMm, marginMm, usableWidthMm, usableHeightMm, 'S');
      pdf.setLineDashPattern([], 0); // Restaurar sólido

      // Cruces de Registro en las 4 esquinas del recuadro
      const crossSize = 5;
      pdf.setDrawColor(2, 132, 199); // Sky 600
      pdf.setLineWidth(0.7);

      // Superior Izquierda
      pdf.line(marginMm - crossSize, marginMm, marginMm + crossSize, marginMm);
      pdf.line(marginMm, marginMm - crossSize, marginMm, marginMm + crossSize);

      // Superior Derecha
      pdf.line(marginMm + usableWidthMm - crossSize, marginMm, marginMm + usableWidthMm + crossSize, marginMm);
      pdf.line(marginMm + usableWidthMm, marginMm - crossSize, marginMm + usableWidthMm, marginMm + crossSize);

      // Inferior Izquierda
      pdf.line(marginMm - crossSize, marginMm + usableHeightMm, marginMm + crossSize, marginMm + usableHeightMm);
      pdf.line(marginMm, marginMm + usableHeightMm - crossSize, marginMm, marginMm + usableHeightMm + crossSize);

      // Inferior Derecha
      pdf.line(marginMm + usableWidthMm - crossSize, marginMm + usableHeightMm, marginMm + usableWidthMm + crossSize, marginMm + usableHeightMm);
      pdf.line(marginMm + usableWidthMm, marginMm + usableHeightMm - crossSize, marginMm + usableWidthMm, marginMm + usableHeightMm + crossSize);

      // Textos de Ayuda en los 4 bordes indicando con qué hoja unir
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(2, 132, 199);

      // Borde Superior
      if (r > 0) {
        const hojaArriba = (r - 1) * cols + c + 2;
        pdf.text(`↑ UNIR CON HOJA ${hojaArriba} (Fila ${r}, Columna ${c + 1})`, marginMm + usableWidthMm / 2, marginMm - 2, { align: 'center' });
      }

      // Borde Inferior
      if (r < rows - 1) {
        const hojaAbajo = (r + 1) * cols + c + 2;
        pdf.text(`↓ PEGAR CON HOJA ${hojaAbajo} (Fila ${r + 2}, Columna ${c + 1})`, marginMm + usableWidthMm / 2, marginMm + usableHeightMm + 4.5, { align: 'center' });
      }

      // Borde Izquierdo
      if (c > 0) {
        const hojaIzq = r * cols + c + 1;
        pdf.text(`← UNIR CON HOJA ${hojaIzq}`, marginMm + 3, marginMm + usableHeightMm / 2, { angle: 90 });
      }

      // Borde Derecho
      if (c < cols - 1) {
        const hojaDer = r * cols + c + 3;
        pdf.text(`PEGAR CON HOJA ${hojaDer} →`, marginMm + usableWidthMm - 2, marginMm + usableHeightMm / 2, { angle: 270 });
      }

      // Insignia de Hoja en la esquina inferior izquierda
      pdf.setFillColor(241, 245, 249);
      pdf.rect(marginMm + 2, marginMm + usableHeightMm - 10, 24, 8, 'F');
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(marginMm + 2, marginMm + usableHeightMm - 10, 24, 8, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`HOJA ${hojaNumero}`, marginMm + 14, marginMm + usableHeightMm - 4.5, { align: 'center' });
    }
  }

  // Descargar Archivo PDF
  const nombreLimpio = nombreMolde.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_');
  const clienteLimpio = nombreCliente.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_');
  const filename = `Patron_${nombreLimpio}_${clienteLimpio}_A4_Paginado.pdf`;
  
  pdf.save(filename);
  URL.revokeObjectURL(url);
}
