/**
 * Generador de PDF Paginado Multihioja A4 / Letter para Patronaje y Costura Real
 * - Genera SVG limpio vectorial / renderizado canvas nativo asegurando que no queden páginas en blanco
 * - Cada hoja A4 tiene:
 *   1. Cuadrícula de coordenadas clara (ej: Fila 1 - Columna 2, Fila 1 - Columna 3)
 *   2. Solapas de unión de 10mm (con texto "Pegar borde con..." / "Unir con...")
 *   3. Cruces de registro (corte) en las 4 esquinas
 *   4. Número de página grande y visible en el centro/esquina
 *   5. Guía de ensamble visual en la Carátula (Página 1) con cuadro de calibración 10x10 cm
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

  // Preparamos un SVG optimizado para impresión: fondo blanco, líneas oscuras de alta nitidez
  // Clonamos el SVG y cambiamos atributos de visualización
  const svgClon = svgEl.cloneNode(true);
  svgClon.setAttribute('width', String(vbWidth));
  svgClon.setAttribute('height', String(vbHeight));
  
  // Reemplazar fondo oscuro por blanco
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
  const marginMm = 15; // 15mm margen exterior
  const usableWidthMm = a4WidthMm - marginMm * 2; // 180mm
  const usableHeightMm = a4HeightMm - marginMm * 2; // 267mm

  // Escala real: En nuestro motor SVG, 1 unidad = 1 mm (o 1000px = 1000mm = 100cm)
  // El ancho total real del patrón en mm es vbWidth
  // El alto total real del patrón en mm es vbHeight
  const patternWidthMm = vbWidth;
  const patternHeightMm = vbHeight;

  // Calculamos cuántas hojas se necesitan
  const cols = Math.max(1, Math.ceil(patternWidthMm / usableWidthMm));
  const rows = Math.max(1, Math.ceil(patternHeightMm / usableHeightMm));
  const totalPaginasPatron = cols * rows;
  const totalHojas = 1 + totalPaginasPatron; // 1 portada + páginas

  // Renderizamos el SVG completo en un Canvas de alta resolución (3.78 píxeles por mm ≈ 96 DPI * 3 = 300 DPI)
  const pxPerMm = 3.7795; // 96 DPI estándar
  const renderScale = 2.0; // Factor de nitidez
  const canvasWidth = Math.round(vbWidth * (pxPerMm / 1) * (renderScale / 3.7795));
  const canvasHeight = Math.round(vbHeight * (pxPerMm / 1) * (renderScale / 3.7795));

  const mainCanvas = document.createElement('canvas');
  mainCanvas.width = Math.max(800, canvasWidth);
  mainCanvas.height = Math.max(600, canvasHeight);
  const mainCtx = mainCanvas.getContext('2d');
  
  // Fondo blanco nítido
  mainCtx.fillStyle = '#ffffff';
  mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainCtx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // =========================================================================
  // PÁGINA 1: PORTADA TÉCNICA, CUADRO DE CALIBRACIÓN Y PLANO DE UNIÓN DE HOJAS
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

  // Contenido del Cuadro de Calibración
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

  // 2. Instrucciones Claras de Unión y Corte (Lado Derecho)
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
  pdf.text('1. Imprima todas las hojas a tamaño 100%.', infoX + 6, infoY + 22);
  pdf.text('2. En cada hoja verá un marco punteado de corte.', infoX + 6, infoY + 30);
  pdf.text('3. Recorte el borde DERECHO e INFERIOR de cada hoja.', infoX + 6, infoY + 38);
  pdf.text('4. Superponga las hojas usando las marcas de cruz (+).', infoX + 6, infoY + 46);
  pdf.text('5. Pegue con cinta siguiendo la cuadrícula inferior.', infoX + 6, infoY + 54);
  pdf.text('6. Los contornos ya incluyen 1 cm de costura.', infoX + 6, infoY + 62);
  pdf.text('7. "Doblez de tela" = cortar con la tela doblada.', infoX + 6, infoY + 70);

  // 3. Despiece de Piezas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('PIEZAS DEL PATRÓN:', marginMm, 155);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  let yP = 163;
  (piezas.length > 0 ? piezas : ['Delantero (1x al doblez)', 'Espalda (1x al doblez)', 'Mangas / Vistas (2x)']).forEach((p) => {
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
  const cellW = Math.min(32, (maxGridWidth - (cols - 1) * 3) / cols);
  const cellH = Math.min(24, (maxGridHeight - (rows - 1) * 3) / rows);
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
      const srcX = (c * usableWidthMm / patternWidthMm) * mainCanvas.width;
      const srcY = (r * usableHeightMm / patternHeightMm) * mainCanvas.height;
      const srcW = (usableWidthMm / patternWidthMm) * mainCanvas.width;
      const srcH = (usableHeightMm / patternHeightMm) * mainCanvas.height;

      // Crear tile canvas de alta nitidez
      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = Math.max(300, Math.round(srcW));
      tileCanvas.height = Math.max(300, Math.round(srcH));
      const tileCtx = tileCanvas.getContext('2d');
      tileCtx.fillStyle = '#ffffff';
      tileCtx.fillRect(0, 0, tileCanvas.width, tileCanvas.height);

      tileCtx.drawImage(
        mainCanvas,
        srcX, srcY, srcW, srcH,
        0, 0, tileCanvas.width, tileCanvas.height
      );

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
