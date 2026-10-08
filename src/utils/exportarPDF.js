import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Formatea un número como moneda argentina.
 */
function fmt(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

/**
 * Convierte "2024-03" → "Marzo 2024"
 */
function formatearMes(mesAnio) {
  try {
    const [anio, mes] = mesAnio.split('-');
    const fecha = new Date(Number(anio), Number(mes) - 1, 1);
    return fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  } catch {
    return mesAnio;
  }
}

/**
 * Genera y descarga el PDF de Ganancias de Kamurina.
 * @param {Object} gananciasPorMes - El objeto calculado en App.jsx
 */
export function exportarReportePDFNativo(gananciasPorMes) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = doc.internal.pageSize.getWidth();
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const fechaGeneracion = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── TOTALES GENERALES ──────────────────────────────────────────────
  const meses = Object.entries(gananciasPorMes).sort(([a], [b]) => b.localeCompare(a));
  const totalIngresos = meses.reduce((acc, [, d]) => acc + d.ingresos, 0);
  const totalGanancia = meses.reduce((acc, [, d]) => acc + d.ganancia, 0);
  const totalPedidos  = meses.reduce((acc, [, d]) => acc + d.cantidad, 0);

  // ── ENCABEZADO ────────────────────────────────────────────────────
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, PAGE_W, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 15, 15);
  doc.text('KAMURINA', MARGIN, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Atelier & Gestion de Confecciones', MARGIN, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 15, 15);
  doc.text('REPORTE DE GANANCIAS', PAGE_W - MARGIN, 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(`Generado el ${fechaGeneracion}`, PAGE_W - MARGIN, 21, { align: 'right' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, 28, PAGE_W - MARGIN, 28);

  // ── RESUMEN GENERAL (KPIs) ────────────────────────────────────────
  let cursorY = 36;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('RESUMEN GENERAL', MARGIN, cursorY);

  cursorY += 5;

  const kpiW = CONTENT_W / 3;
  const kpis = [
    { label: 'Total de Pedidos', value: String(totalPedidos) },
    { label: 'Ingresos Totales', value: fmt(totalIngresos) },
    { label: 'Ganancia Neta Total', value: fmt(totalGanancia) },
  ];

  kpis.forEach((kpi, i) => {
    const x = MARGIN + kpiW * i;
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, cursorY, kpiW - 3, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.label.toUpperCase(), x + (kpiW - 3) / 2, cursorY + 6, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 15, 15);
    doc.text(kpi.value, x + (kpiW - 3) / 2, cursorY + 14, { align: 'center' });
  });

  cursorY += 26;

  // ── DETALLE POR MES ───────────────────────────────────────────────
  for (const [mesAnio, datos] of meses) {
    const espacioRestante = doc.internal.pageSize.getHeight() - cursorY - 20;
    if (espacioRestante < 40) {
      doc.addPage();
      cursorY = 20;
    }

    // Header del mes
    doc.setFillColor(30, 30, 30);
    doc.rect(MARGIN, cursorY, CONTENT_W, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(formatearMes(mesAnio).toUpperCase(), MARGIN + 4, cursorY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(
      `${datos.cantidad} item(s)  |  Ingresos: ${fmt(datos.ingresos)}  |  Ganancia: ${fmt(datos.ganancia)}`,
      PAGE_W - MARGIN - 4,
      cursorY + 5.5,
      { align: 'right' }
    );

    cursorY += 8;

    // Tabla de pedidos del mes
    const filas = datos.pedidos.map((p) => [
      p._tipo === 'arreglo' ? '✂ Arreglo' : p.id,
      p.cliente || '-',
      p.prenda || '-',
      p._tipo === 'arreglo'
        ? (p.pagado ? 'Entregado' : 'Activo')
        : (p.pagado ? 'Pagado' : 'Pendiente'),
      p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-AR') : '-',
      fmt(p.precio),
      fmt(p.gastos),
      fmt(p.gananciaPedido),
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: MARGIN, right: MARGIN },
      head: [['ID / Tipo', 'Cliente', 'Detalle', 'Estado', 'Fecha', 'Precio', 'Gastos', 'Ganancia']],
      body: filas,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 7.5,
        textColor: [30, 30, 30],
        cellPadding: { top: 2.5, bottom: 2.5, left: 3, right: 3 },
        lineColor: [210, 210, 210],
        lineWidth: 0.15,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [80, 80, 80],
        fontStyle: 'bold',
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 30 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 22, halign: 'center' },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 18, halign: 'right' },
        7: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
      },
      didParseCell(data) {
        if (data.column.index === 0 && typeof data.cell.raw === 'string' && data.cell.raw.startsWith('✂')) {
          data.cell.styles.textColor = [120, 80, 180];
        }
        if (data.column.index === 3 && data.cell.raw === 'Pagado') {
          data.cell.styles.textColor = [40, 40, 40];
          data.cell.styles.fontStyle = 'bold';
        }
        if (data.column.index === 3 && data.cell.raw === 'Pendiente') {
          data.cell.styles.textColor = [130, 130, 130];
        }
      },
    });

    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ── PIE DE PAGINA ─────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, h - 12, PAGE_W - MARGIN, h - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text('Kamurina — Reporte de Ganancias (Uso interno)', MARGIN, h - 7);
    doc.text(`Pag. ${i} / ${totalPages}`, PAGE_W - MARGIN, h - 7, { align: 'right' });

    doc.setFillColor(20, 20, 20);
    doc.rect(0, h - 2, PAGE_W, 2, 'F');
  }

  // ── DESCARGA ──────────────────────────────────────────────────────
  const nombreArchivo = `Kamurina_Ganancias_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nombreArchivo);
}
