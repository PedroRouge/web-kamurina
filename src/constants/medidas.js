export const MEDIDAS_LISTA = [
  'Contorno cuello',
  'Contorno cintura',
  'Contorno cadera',
  'Largo de espalda',
  'Ancho de espalda',
  'Ancho de hombros',
  'Ancho de pecho',
  'Altura de busto',
  'Separación de busto',
  'Radio',
  'Contorno de brazo',
  'Contorno de muñeca',
  'Largo de manga',
  'Altura de codo',
  'Altura de cadera',
  'Altura de rodilla',
  'Largo de falda',
  'Largo pantalón',
];

const mitadMedidas = Math.ceil(MEDIDAS_LISTA.length / 2);
export const MEDIDAS_COL_IZQ = MEDIDAS_LISTA.slice(0, mitadMedidas);
export const MEDIDAS_COL_DER = MEDIDAS_LISTA.slice(mitadMedidas);

export const ALIASES_MEDIDAS = {
  'Contorno cuello': ['Contorno cuello', 'Contorno de Cuello', 'Contorno de cuello', 'Cuello'],
  'Contorno cintura': ['Contorno cintura', 'Contorno de Cintura', 'Contorno de cintura', 'Cintura'],
  'Contorno cadera': ['Contorno cadera', 'Contorno de Cadera', 'Contorno de cadera', 'Cadera'],
  'Largo de espalda': ['Largo de espalda', 'Largo de Espalda', 'Largo de Talle', 'Largo espalda'],
  'Ancho de espalda': ['Ancho de espalda', 'Ancho de Espalda', 'Ancho espalda'],
  'Ancho de hombros': ['Ancho de hombros', 'Ancho de Hombros', 'Ancho hombros'],
  'Ancho de pecho': ['Ancho de pecho', 'Ancho de Pecho', 'Contorno de Busto', 'Pecho', 'Busto'],
  'Altura de busto': ['Altura de busto', 'Altura de Busto', 'Alto busto'],
  'Separación de busto': ['Separación de busto', 'Separación de Busto', 'Separacion de busto'],
  'Radio': ['Radio', 'Radio de busto'],
  'Contorno de brazo': ['Contorno de brazo', 'Contorno de Brazo', 'Brazo'],
  'Contorno de muñeca': ['Contorno de muñeca', 'Contorno de Muñeca', 'Muñeca', 'Muneca'],
  'Largo de manga': ['Largo de manga', 'Largo de Manga', 'Largo manga'],
  'Altura de codo': ['Altura de codo', 'Altura de Codo', 'Alto codo'],
  'Altura de cadera': ['Altura de cadera', 'Altura de Cadera', 'Alto cadera'],
  'Altura de rodilla': ['Altura de rodilla', 'Altura de Rodilla', 'Alto rodilla'],
  'Largo de falda': ['Largo de falda', 'Largo de Falda', 'Largo falda'],
  'Largo pantalón': ['Largo pantalón', 'Largo de Pantalón', 'Largo Pantalón', 'Largo de pantalon', 'Largo pantalon'],
  'Tiro de pantalón': ['Tiro de pantalón', 'Altura Tiro de Pantalón', 'Altura de Tiro', 'Tiro de Pantalón', 'Tiro pantalon', 'Tiro']
};

/**
 * Obtiene el valor de una medida desde el objeto medidas de un cliente,
 * soportando nombres nuevos y alias antiguos para no perder datos históricos.
 */
export function obtenerMedida(medidas = {}, nombreMedida) {
  if (!medidas || typeof medidas !== 'object') return '';
  if (medidas[nombreMedida] !== undefined && medidas[nombreMedida] !== null && String(medidas[nombreMedida]).trim() !== '') {
    return String(medidas[nombreMedida]);
  }
  const aliases = ALIASES_MEDIDAS[nombreMedida];
  if (aliases) {
    for (const alias of aliases) {
      if (medidas[alias] !== undefined && medidas[alias] !== null && String(medidas[alias]).trim() !== '') {
        return String(medidas[alias]);
      }
    }
  }
  return '';
}

export const MEDIDAS_GRUPOS = [
  { label: 'Medidas', medidas: MEDIDAS_LISTA }
];

