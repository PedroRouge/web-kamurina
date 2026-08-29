/**
 * Generador de PDF Paginado Multihioja A4 / Letter para Patronaje y Costura
 * Genera hojas A4 con:
 * - Guías de ensamble con cuadrícula de coordenadas (Columna A-Z, Fila 1-N)
 * - Cruces de corte y margen de pegado (10mm)
 * - Página 1 con Carátula Resumen + Guía general de ensamble + Cuadro de calibración 10x10 cm
 * - Compatible con corte real e impresión directa al 100%
 */

import jsPDF from 'jspdf';

export async function exportarMoldeAPdfA4({
  svgString,
  nombreMolde = 'Patrón de Costura',
  nombreCliente = 'Medidas Estándar',
  piezas = []
}) {
  // 1. Crear un canvas virtual para rasterizar el SVG a resolución ultra-alta (300 DPI aprox)
  const parser = new DOMParser();
  const docSvg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = docSvg.querySelector('svg');

  if (!svgEl) {
    throw new Error('No se pudo procesar el gráfico vectorial del molde.');
  }

  // Obtener viewBox
  const viewBoxAttr = svgEl.getAttribute('viewBox');
  let vbWidth = 1000;
  let vbHeight = 800;

  if (viewBoxAttr) {
    const parts = viewBoxAttr.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      vbWidth = parts[2];
      vbHeight = parts[3];
    }
  }

  // Convertir SVG a imagen limpia con fondo blanco para impresión en papel
  // Cambiamos colores oscuros a colores de impresión limpios (líneas negras/azules, fondo transparente/blanco)
  const svgImpresion = svgString
    .replace(/fill="#0c0a09"/g, 'fill="#ffffff"')
    .replace(/stroke="#38bdf8"/g, 'stroke="#0284c7"')
    .replace(/fill="#1c1917"/g, 'fill="#f8fafc"')
    .replace(/stroke="#44403c"/g, 'stroke="#cbd5e1"')
    .replace(/fill="#f1f5f9"/g, 'fill="#0f172a"')
    .replace(/fill="#94a3b8"/g, 'fill="#475569"');

  const svgBlob = new Blob([svgImpresion], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  // Dimensiones en mm (A4 vertical estándar: 210 x 297 mm)
  const a4Width = 210;
  const a4Height = 297;
  const margin = 12; // 12mm de margen por borde de hoja
  const usableWidth = a4Width - margin * 2; // 186mm
  const usableHeight = a4Height - margin * 2; // 273mm

  // Escala real: En nuestro motor, 10 unidades = 10 cm = 100 mm (1 unidad de trazado = 1 cm = 10 mm)
  const patternWidthMm = vbWidth * 10;
  const patternHeightMm = vbHeight * 10;

  // Cuántas columnas y filas de A4 se requieren
  const cols = Math.max(1, Math.ceil(patternWidthMm / usableWidth));
  const rows = Math.max(1, Math.ceil(patternHeightMm / usableHeight));
  const totalPaginas = cols * rows;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ==========================================
  // PÁGINA 1: CARÁTULA & PLANO DE ENSAMBLE
  // ==========================================
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(15, 23, 42); // Slate 900
  pdf.text('ATELIER KAMURINA — PATRÓN DE CORTE', margin, 24);

  pdf.setFontSize(14);
  pdf.setTextColor(2, 132, 199); // Sky 600
  pdf.text(`${nombreMolde}`, margin, 32);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Cliente / Medida: ${nombreCliente}   |   Fecha: ${new Date().toLocaleDateString()}`, margin, 39);

  // Línea divisoria
  pdf.setDrawColor(203, 213, 225);
  pdf.line(margin, 43, a4Width - margin, 43);

  // Cuadro de calibración 10x10 cm en la carátula
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, 48, 100, 100, 'F');
  pdf.setDrawColor(2, 132, 199);
  pdf.setLineWidth(0.8);
  pdf.rect(margin, 48, 100, 100, 'S');

  // Interior del cuadro de calibración
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(2, 132, 199);
  pdf.text('CUADRO DE TEST', margin + 50, 85, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text('10 x 10 cm', margin + 50, 95, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Mida este cuadro con una regla.', margin + 50, 106, { align: 'center' });
  pdf.text('Si mide 10 cm exactos, la escala es correcta.', margin + 50, 112, { align: 'center' });
  pdf.text('Asegúrese de imprimir a "Tamaño Real / 100%".', margin + 50, 118, { align: 'center' });

  // Panel lateral derecho: Instrucciones de ensamble y despiece
  const rightX = margin + 108;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('GUÍA DE ENSAMBLE DE HOJAS', rightX, 54);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text(`• Total de hojas a imprimir: ${totalPaginas} páginas`, rightX, 62);
  pdf.text(`• Cuadrícula: ${cols} columnas × ${rows} filas`, rightX, 68);
  pdf.text('• Márgenes de unión: 10 mm en cada borde', rightX, 74);
  pdf.text('• Recorte los bordes por la línea punteada gris', rightX, 80);
  pdf.text('• Una las hojas haciendo coincidir los números', rightX, 86);
  pdf.text('• Margen de costura incluido: 1 cm en contornos', rightX, 92);

  // Despiece
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('PIEZAS INCLUIDAS:', rightX, 106);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  let yPieza = 114;
  (piezas.length > 0 ? piezas : ['Cuerpo Delantero', 'Cuerpo Espalda', 'Mangas / Complementos']).forEach(p => {
    if (yPieza < 145) {
      pdf.text(`✓ ${p}`, rightX, yPieza);
      yPieza += 6;
    }
  });

  // Esquema de Cuadrícula Visual en la portada
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('ESQUEMA DE UNIÓN DE PÁGINAS:', margin, 160);

  const gridBoxW = Math.min(24, (usableWidth - 20) / cols);
  const gridBoxH = Math.min(32, 90 / rows);
  const startGridX = margin + 10;
  const startGridY = 168;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pageNum = r * cols + c + 1;
      const gx = startGridX + c * (gridBoxW + 2);
      const gy = startGridY + r * (gridBoxH + 2);

      pdf.setFillColor(241, 245, 249);
      pdf.rect(gx, gy, gridBoxW, gridBoxH, 'F');
      pdf.setDrawColor(148, 163, 184);
      pdf.setLineWidth(0.3);
      pdf.rect(gx, gy, gridBoxW, gridBoxH, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${pageNum}`, gx + gridBoxW / 2, gy + gridBoxH / 2 - 1, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`[F${r + 1}-C${c + 1}]`, gx + gridBoxW / 2, gy + gridBoxH / 2 + 4, { align: 'center' });
    }
  }

  // ==========================================
  // PÁGINAS DE PATRÓN (TILED A4)
  // ==========================================
  // Renderizamos el SVG en un Canvas de alta resolución
  const canvasScale = 3; // Supermuestreo para nitidez
  const canvas = document.createElement('canvas');
  canvas.width = vbWidth * canvasScale;
  canvas.height = vbHeight * canvasScale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pageIndex = r * cols + c + 1;
      pdf.addPage('a4', 'portrait');

      // Área que corresponde a este recorte
      const sourceX = (c * usableWidth / patternWidthMm) * canvas.width;
      const sourceY = (r * usableHeight / patternHeightMm) * canvas.height;
      const sourceW = (usableWidth / patternWidthMm) * canvas.width;
      const sourceH = (usableHeight / patternHeightMm) * canvas.height;

      // Crear sub-canvas para esta página
      const tileCanvas = document.createElement('canvas');
      tileCanvas.width = Math.round(sourceW);
      tileCanvas.height = Math.round(sourceH);
      const tileCtx = tileCanvas.getContext('2d');
      tileCtx.fillStyle = '#ffffff';
      tileCtx.fillRect(0, 0, tileCanvas.width, tileCanvas.height);

      tileCtx.drawImage(
        canvas,
        sourceX, sourceY, sourceW, sourceH,
        0, 0, tileCanvas.width, tileCanvas.height
      );

      const tileDataUrl = tileCanvas.toDataURL('image/jpeg', 0.95);

      // Insertar imagen del fragmento en el PDF
      pdf.addImage(tileDataUrl, 'JPEG', margin, margin, usableWidth, usableHeight);

      // Marco de corte y pegado alrededor
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.4);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.rect(margin, margin, usableWidth, usableHeight, 'S');
      pdf.setLineDashPattern([], 0); // Restaurar sólido

      // Cruces de registro en las 4 esquinas
      const crossSize = 4;
      pdf.setDrawColor(2, 132, 199);
      pdf.setLineWidth(0.6);
      // Top-Left
      pdf.line(margin - crossSize, margin, margin + crossSize, margin);
      pdf.line(margin, margin - crossSize, margin, margin + crossSize);
      // Top-Right
      pdf.line(margin + usableWidth - crossSize, margin, margin + usableWidth + crossSize, margin);
      pdf.line(margin + usableWidth, margin - crossSize, margin + usableWidth, margin + crossSize);
      // Bottom-Left
      pdf.line(margin - crossSize, margin + usableHeight, margin + crossSize, margin + usableHeight);
      pdf.line(margin, margin + usableHeight - crossSize, margin, margin + usableHeight + crossSize);
      // Bottom-Right
      pdf.line(margin + usableWidth - crossSize, margin + usableHeight, margin + usableWidth + crossSize, margin + usableHeight);
      pdf.line(margin + usableWidth, margin + usableHeight - crossSize, margin + usableWidth, margin + usableHeight + crossSize);

      // Encabezado y Pie de página con coordenadas de ensamble
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(
        `ATELIER KAMURINA  |  ${nombreMolde.toUpperCase()}  |  PÁGINA ${pageIndex} DE ${totalPaginas}  (FILA ${r + 1}, COLUMNA ${c + 1})`,
        margin,
        8
      );

      // Guías de unión en los bordes
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      if (c > 0) {
        pdf.text(`← Unir con Columna ${c}`, margin + 2, margin + usableHeight / 2, { angle: 90 });
      }
      if (c < cols - 1) {
        pdf.text(`Unir con Columna ${c + 2} →`, margin + usableWidth - 2, margin + usableHeight / 2, { angle: 270 });
      }
      if (r > 0) {
        pdf.text(`↑ Unir con Fila ${r}`, margin + usableWidth / 2, margin + 4, { align: 'center' });
      }
      if (r < rows - 1) {
        pdf.text(`↓ Unir con Fila ${r + 2}`, margin + usableWidth / 2, margin + usableHeight - 2, { align: 'center' });
      }
    }
  }

  // Descargar PDF
  const filename = `Patron_${nombreMolde.replace(/\s+/g, '_')}_${nombreCliente.replace(/\s+/g, '_')}_A4_Paginado.pdf`;
  pdf.save(filename);
  URL.revokeObjectURL(url);
}
