/**
 * Diccionario de traducción de nombres técnicos de FreeSewing (Inglés) a Español
 */
export const TRADUCCION_MEDIDAS_ES = {
  // Cuello y Torso
  neck: 'Contorno de Cuello',
  neckCircumference: 'Contorno de Cuello',
  chest: 'Contorno de Busto / Pecho',
  chestCircumference: 'Contorno de Busto / Pecho',
  highBust: 'Ancho de Pecho / Alto Busto',
  highBustFront: 'Ancho de Pecho Delantero',
  underbust: 'Bajo Busto (Contorno Torácico)',
  bustSpan: 'Separación de Busto',
  bustPointToUnderbust: 'Radio de Busto / Altura Bajo Busto',
  
  // Hombros y Espalda
  shoulderToShoulder: 'Ancho de Hombros',
  shoulderSlope: 'Inclinación de Hombro',
  hpsToBust: 'Altura de Busto (Hombro a Busto)',
  hpsToWaistBack: 'Largo de Espalda',
  hpsToWaistFront: 'Largo de Talle Delantero',
  hpsToHips: 'Altura Hombro a Cadera',
  waistToArmpit: 'Cintura a Axila',

  // Cintura y Cadera
  waist: 'Contorno de Cintura',
  waistCircumference: 'Contorno de Cintura',
  hips: 'Contorno de Cadera',
  hipsCircumference: 'Contorno de Cadera',
  seat: 'Contorno de Cadera / Asiento',
  seatCircumference: 'Contorno de Cadera / Asiento',
  seatBack: 'Mitad Cadera Espalda',
  waistToHips: 'Altura de Cadera',
  waistToSeat: 'Altura de Cadera / Asiento',
  waistToUpperLeg: 'Altura de Tiro / Cintura a Muslo',

  // Brazos
  biceps: 'Contorno de Brazo',
  bicepsCircumference: 'Contorno de Brazo',
  wrist: 'Contorno de Muñeca',
  wristCircumference: 'Contorno de Muñeca',
  shoulderToElbow: 'Altura de Codo (Hombro a Codo)',
  shoulderToWrist: 'Largo de Manga',

  // Piernas e Inferior
  crotchDepth: 'Altura Tiro de Pantalón',
  crossSeam: 'Tiro Total (Delantero a Trasero)',
  crossSeamFront: 'Tiro Delantero',
  waistToFloor: 'Largo de Pantalón (Cintura al Suelo)',
  waistToKnee: 'Altura de Rodilla',
  inseam: 'Largo de Entrepierna',
  knee: 'Contorno de Rodilla',
  kneeCircumference: 'Contorno de Rodilla',
  upperLeg: 'Contorno de Muslo',
  upperLegCircumference: 'Contorno de Muslo',
  ankle: 'Contorno de Tobillo',
  ankleCircumference: 'Contorno de Tobillo',
  heel: 'Contorno de Talón',

  // Cabeza y Otros
  head: 'Contorno de Cabeza',
  headCircumference: 'Contorno de Cabeza'
};

/**
 * Traduce el nombre técnico en inglés a un nombre amigable en español
 */
export function getNombreMedidaEs(nombreEn) {
  if (TRADUCCION_MEDIDAS_ES[nombreEn]) {
    return TRADUCCION_MEDIDAS_ES[nombreEn];
  }
  // Si no está en el diccionario, separar camelCase
  return nombreEn
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

/**
 * Parsea un valor numérico seguro en centímetros
 */
function numCm(val, fallback = 0) {
  if (val === undefined || val === null || val === '') return fallback;
  const limpio = String(val).replace(',', '.').replace(/[^0-9.]/g, '');
  const num = parseFloat(limpio);
  return isNaN(num) ? fallback : num;
}

/**
 * Adaptador Universal de Medidas:
 * Convierte el objeto de medidas del cliente (en cm) al estándar de FreeSewing en milímetros (mm).
 * Incluye derivaciones inteligentes para medidas secundarias basadas en proporciones anatómicas.
 */
export function adaptarMedidasCliente(medidasCliente = {}) {
  const c = {};
  // Extraer valores limpios en centímetros
  const cuelloCm = numCm(medidasCliente['Contorno de Cuello']);
  const pechoCm = numCm(medidasCliente['Ancho de Pecho']);
  const bustoCm = numCm(medidasCliente['Contorno de Busto']);
  const altBustoCm = numCm(medidasCliente['Altura de Busto']);
  const sepBustoCm = numCm(medidasCliente['Separación de Busto']);
  const radioCm = numCm(medidasCliente['Radio']);

  const hombrosCm = numCm(medidasCliente['Ancho de Hombros']);
  const espaldaCm = numCm(medidasCliente['Ancho de Espalda']);
  const largoEspaldaCm = numCm(medidasCliente['Largo de Espalda']);

  const cinturaCm = numCm(medidasCliente['Contorno de Cintura']);
  const caderaCm = numCm(medidasCliente['Contorno de Cadera']);
  const altCaderaCm = numCm(medidasCliente['Altura de Cadera']);

  const brazoCm = numCm(medidasCliente['Contorno de Brazo']);
  const munecaCm = numCm(medidasCliente['Contorno de Muñeca']);
  const mangaCm = numCm(medidasCliente['Largo de Manga']);
  const codoCm = numCm(medidasCliente['Altura de Codo']);

  const tiroCm = numCm(medidasCliente['Altura Tiro de Pantalón']);
  const pantalonCm = numCm(medidasCliente['Largo de Pantalón']);
  const rodillaCm = numCm(medidasCliente['Altura de Rodilla']);

  // Convertir a milímetros (cm * 10)
  if (cuelloCm > 0) {
    c.neck = cuelloCm * 10;
    c.neckCircumference = cuelloCm * 10;
  }

  // Pecho / Busto
  const principalBusto = bustoCm || pechoCm;
  if (principalBusto > 0) {
    c.chest = principalBusto * 10;
    c.chestCircumference = principalBusto * 10;
  }

  if (pechoCm > 0) {
    c.highBust = pechoCm * 10;
    c.highBustFront = (pechoCm * 10) * 0.48;
  } else if (bustoCm > 0) {
    c.highBust = (bustoCm * 0.96) * 10;
    c.highBustFront = (bustoCm * 0.46) * 10;
  }

  if (radioCm > 0 && bustoCm > 0) {
    c.underbust = (bustoCm - (radioCm * 2)) * 10;
    c.bustPointToUnderbust = radioCm * 10;
  } else if (bustoCm > 0) {
    c.underbust = (bustoCm * 0.85) * 10;
    c.bustPointToUnderbust = 85; // 8.5 cm default
  }

  if (sepBustoCm > 0) {
    c.bustSpan = sepBustoCm * 10;
  } else if (bustoCm > 0) {
    c.bustSpan = (bustoCm * 0.2) * 10;
  }

  if (altBustoCm > 0) {
    c.hpsToBust = altBustoCm * 10;
  } else if (largoEspaldaCm > 0) {
    c.hpsToBust = (largoEspaldaCm * 0.6) * 10;
  }

  // Hombros y Espalda
  const hombrosEfectivo = hombrosCm || espaldaCm;
  if (hombrosEfectivo > 0) {
    c.shoulderToShoulder = hombrosEfectivo * 10;
    c.shoulderSlope = 45; // Ángulo estándar en mm de caída
  }

  if (largoEspaldaCm > 0) {
    c.hpsToWaistBack = largoEspaldaCm * 10;
    c.hpsToWaistFront = (largoEspaldaCm + 2) * 10; // Proporción delantera estándar
    c.waistToArmpit = (largoEspaldaCm * 0.48) * 10;
    if (altCaderaCm > 0) {
      c.hpsToHips = (largoEspaldaCm + altCaderaCm) * 10;
    } else {
      c.hpsToHips = (largoEspaldaCm + 20) * 10;
    }
  }

  // Cintura
  if (cinturaCm > 0) {
    c.waist = cinturaCm * 10;
    c.waistCircumference = cinturaCm * 10;
  }

  // Cadera
  if (caderaCm > 0) {
    c.hips = caderaCm * 10;
    c.hipsCircumference = caderaCm * 10;
    c.seat = caderaCm * 10;
    c.seatCircumference = caderaCm * 10;
    c.seatBack = (caderaCm * 0.52) * 10;
  }

  if (altCaderaCm > 0) {
    c.waistToHips = altCaderaCm * 10;
    c.waistToSeat = altCaderaCm * 10;
  } else {
    c.waistToHips = 200; // 20 cm
    c.waistToSeat = 200;
  }

  // Brazos
  if (brazoCm > 0) {
    c.biceps = brazoCm * 10;
    c.bicepsCircumference = brazoCm * 10;
  }
  if (munecaCm > 0) {
    c.wrist = munecaCm * 10;
    c.wristCircumference = munecaCm * 10;
  }
  if (mangaCm > 0) {
    c.shoulderToWrist = mangaCm * 10;
  }
  if (codoCm > 0) {
    c.shoulderToElbow = codoCm * 10;
  } else if (mangaCm > 0) {
    c.shoulderToElbow = (mangaCm * 0.55) * 10;
  }

  // Inferior / Pantalón
  if (tiroCm > 0) {
    c.crotchDepth = tiroCm * 10;
    c.waistToUpperLeg = tiroCm * 10;
    c.crossSeam = (tiroCm * 2.3) * 10;
    c.crossSeamFront = (tiroCm * 1.1) * 10;
  }

  if (pantalonCm > 0) {
    c.waistToFloor = pantalonCm * 10;
    if (tiroCm > 0) {
      c.inseam = (pantalonCm - tiroCm) * 10;
    } else {
      c.inseam = (pantalonCm * 0.72) * 10;
    }
  }

  if (rodillaCm > 0) {
    c.waistToKnee = rodillaCm * 10;
    c.knee = 380; // 38 cm estándar
    c.kneeCircumference = 380;
  } else if (pantalonCm > 0) {
    c.waistToKnee = (pantalonCm * 0.54) * 10;
    c.knee = 380;
    c.kneeCircumference = 380;
  }

  // Derivaciones adicionales comunes
  if (caderaCm > 0) {
    c.upperLeg = (caderaCm * 0.58) * 10;
    c.upperLegCircumference = (caderaCm * 0.58) * 10;
    c.ankle = 240; // 24 cm
    c.ankleCircumference = 240;
    c.heel = 320; // 32 cm
  }

  // Cabeza estándar
  c.head = 570; // 57 cm
  c.headCircumference = 570;

  return c;
}

/**
 * Obtiene las medidas requeridas por un patrón de FreeSewing
 */
export function obtenerMedidasRequeridas(DesignPattern) {
  if (!DesignPattern) return [];
  try {
    if (DesignPattern.patternConfig?.measurements) {
      return DesignPattern.patternConfig.measurements;
    }
    const instance = new DesignPattern();
    const config = instance.getConfig();
    return config?.measurements || [];
  } catch (err) {
    console.warn("No se pudo obtener config estática del molde:", err);
    return [];
  }
}

/**
 * Valida si el conjunto de medidas adaptadas contiene todas las requeridas por el patrón
 */
export function validarMedidasMolde(DesignPattern, medidasAdaptadas = {}) {
  const requeridas = obtenerMedidasRequeridas(DesignPattern);
  const faltantes = [];

  for (const req of requeridas) {
    if (!medidasAdaptadas[req] || medidasAdaptadas[req] <= 0) {
      faltantes.push({
        clave: req,
        nombreEs: getNombreMedidaEs(req)
      });
    }
  }

  return {
    esValido: faltantes.length === 0,
    requeridasTotal: requeridas.length,
    faltantes
  };
}

/**
 * Traza y genera el SVG del molde utilizando FreeSewing
 */
export function trazarMolde(DesignPattern, medidasAdaptadas = {}, opciones = {}) {
  if (!DesignPattern) {
    throw new Error('No se ha proporcionado un diseño de patrón válido.');
  }

  // Instanciar patrón con las medidas y opciones
  const pattern = new DesignPattern({
    measurements: medidasAdaptadas,
    options: {
      ...opciones,
      paperless: opciones.paperless ?? true, // Incluir cotas y medidas
      sa: opciones.sa ?? 10 // Margen de costura en mm (1 cm)
    }
  });

  // Trazar
  pattern.draft();

  // Renderizar a SVG
  const svg = pattern.render();
  return {
    svg,
    pattern
  };
}
