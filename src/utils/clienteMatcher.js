// Utilidades avanzadas para normalización y detección inteligente de clientes

const APODOS = {
  agus: ['agustina', 'agustin'],
  agustina: ['agus'],
  agustin: ['agus'],
  nacho: ['ignacio'],
  ignacio: ['nacho'],
  santi: ['santiago'],
  santiago: ['santi'],
  fran: ['francisco', 'franco'],
  francisco: ['fran', 'pancho'],
  franco: ['fran'],
  pancho: ['francisco'],
  nico: ['nicolas'],
  nicolas: ['nico'],
  mati: ['matias'],
  matias: ['mati'],
  gonza: ['gonzalo'],
  gonzalo: ['gonza'],
  facu: ['facundo'],
  facundo: ['facu'],
  manu: ['manuel', 'manuela'],
  manuel: ['manu'],
  manuela: ['manu'],
  caro: ['carolina'],
  carolina: ['caro'],
  sofi: ['sofia'],
  sofia: ['sofi'],
  cami: ['camila', 'camilo'],
  camila: ['cami'],
  camilo: ['cami'],
  flor: ['florencia'],
  florencia: ['flor'],
  lau: ['laura', 'lautaro'],
  laura: ['lau'],
  lautaro: ['lau'],
  lu: ['lucia', 'lucas', 'luciano', 'lujan'],
  lucia: ['lu', 'luchi'],
  luchi: ['lucia'],
  lucas: ['lu', 'luquitas'],
  luciano: ['lu', 'lucho'],
  vale: ['valentina', 'valentin', 'valeria'],
  valentina: ['vale', 'valu'],
  valentin: ['vale'],
  valeria: ['vale'],
  leo: ['leonardo', 'leonel'],
  leonardo: ['leo'],
  leonel: ['leo'],
  fede: ['federico'],
  federico: ['fede'],
  maxi: ['maximiliano'],
  maximiliano: ['maxi'],
  ale: ['alejandro', 'alejandra'],
  alejandro: ['ale'],
  alejandra: ['ale'],
  gabi: ['gabriel', 'gabriela'],
  gabriel: ['gabi'],
  gabriela: ['gabi'],
  juli: ['julian', 'julieta', 'julia'],
  julian: ['juli'],
  julieta: ['juli'],
  julia: ['juli'],
  juanma: ['juan manuel'],
  juani: ['juan ignacio'],
  luli: ['luciana', 'lourdes'],
  luciana: ['luli', 'lu'],
  lourdes: ['luli', 'lu'],
  rober: ['roberto'],
  roberto: ['rober'],
  seba: ['sebastian'],
  sebastian: ['seba'],
  eze: ['ezequiel'],
  ezequiel: ['eze'],
  guada: ['guadalupe'],
  guadalupe: ['guada'],
  dolo: ['dolores'],
  dolores: ['dolo', 'lola'],
  lola: ['dolores'],
  pili: ['pilar'],
  pilar: ['pili'],
  vicky: ['victoria'],
  victoria: ['vicky'],
  belu: ['belen'],
  belen: ['belu'],
  berni: ['bernardo', 'bernardita'],
  dani: ['daniel', 'daniela'],
  daniel: ['dani'],
  daniela: ['dani'],
  guille: ['guillermo', 'guillermina'],
  guillermo: ['guille'],
  guillermina: ['guille']
};

/**
 * Normaliza un texto removiendo acentos, puntuaciones (puntos, guiones, etc.) y mayúsculas
 */
export function normalizarTexto(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes y diacríticos
    .replace(/[^a-z0-9\s]/g, " ")     // Reemplazar puntos, guiones, símbolos por espacios
    .replace(/\s+/g, " ")             // Colapsar espacios múltiples
    .trim();
}

/**
 * Normaliza teléfonos dejando únicamente los dígitos relevantes
 */
export function normalizarTelefono(tel) {
  if (!tel || typeof tel !== 'string') return '';
  let digitos = tel.replace(/\D/g, ''); // Solo números

  // Quitar prefijos internacionales comunes de Argentina/Latam
  if (digitos.startsWith('549')) {
    digitos = digitos.substring(3);
  } else if (digitos.startsWith('54')) {
    digitos = digitos.substring(2);
  }

  // Quitar 0 inicial si existe (código de área con 0)
  if (digitos.startsWith('0')) {
    digitos = digitos.substring(1);
  }

  // Quitar 15 de celular si está después del código de área o al inicio
  if (digitos.startsWith('15') && digitos.length > 8) {
    digitos = digitos.substring(2);
  }

  return digitos;
}

/**
 * Compara si dos números de teléfono corresponden al mismo contacto
 */
export function coincidenTelefonos(tel1, tel2) {
  const norm1 = normalizarTelefono(tel1);
  const norm2 = normalizarTelefono(tel2);

  if (!norm1 || !norm2) return false;
  if (norm1.length < 6 || norm2.length < 6) return false;

  // Coincidencia exacta
  if (norm1 === norm2) return true;

  // Si uno contiene al otro en los últimos 7 a 10 dígitos
  if (norm1.length >= 7 && norm2.length >= 7) {
    if (norm1.endsWith(norm2) || norm2.endsWith(norm1)) return true;
    const ultimos7_1 = norm1.slice(-7);
    const ultimos7_2 = norm2.slice(-7);
    if (ultimos7_1 === ultimos7_2) return true;
  }

  return false;
}

/**
 * Comprueba si dos nombres corresponden a la misma persona (detecta apodos, faltas de ortografía menores, tildes, puntos)
 */
export function sonNombresEquivalentes(nom1, nom2) {
  const limpio1 = normalizarTexto(nom1);
  const limpio2 = normalizarTexto(nom2);

  if (!limpio1 || !limpio2) return false;
  if (limpio1 === limpio2) return true;

  const tokens1 = limpio1.split(' ').filter(Boolean);
  const tokens2 = limpio2.split(' ').filter(Boolean);

  if (tokens1.length === 0 || tokens2.length === 0) return false;

  // Si uno está contenido completamente en el otro
  if (limpio1.includes(limpio2) || limpio2.includes(limpio1)) return true;

  // Comparar primer nombre y apellido
  const primerNombre1 = tokens1[0];
  const primerNombre2 = tokens2[0];
  const apellido1 = tokens1.length > 1 ? tokens1[tokens1.length - 1] : '';
  const apellido2 = tokens2.length > 1 ? tokens2[tokens2.length - 1] : '';

  // Verificar si los apellidos coinciden
  const coincideApellido = apellido1 && apellido2 && (
    apellido1 === apellido2 || 
    apellido1.includes(apellido2) || 
    apellido2.includes(apellido1)
  );

  // Verificar si los primeros nombres son iguales o apodos
  const sonMismoPrimerNombre = (
    primerNombre1 === primerNombre2 ||
    (primerNombre1.length >= 3 && primerNombre2.startsWith(primerNombre1)) ||
    (primerNombre2.length >= 3 && primerNombre1.startsWith(primerNombre2)) ||
    (APODOS[primerNombre1] && APODOS[primerNombre1].includes(primerNombre2)) ||
    (APODOS[primerNombre2] && APODOS[primerNombre2].includes(primerNombre1))
  );

  if (coincideApellido && sonMismoPrimerNombre) {
    return true;
  }

  // Comprobar coincidencia de tokens en cualquier orden
  let coincidencias = 0;
  for (const t1 of tokens1) {
    for (const t2 of tokens2) {
      if (
        t1 === t2 ||
        (t1.length >= 3 && t2.startsWith(t1)) ||
        (t2.length >= 3 && t1.startsWith(t2)) ||
        (APODOS[t1] && APODOS[t1].includes(t2)) ||
        (APODOS[t2] && APODOS[t2].includes(t1))
      ) {
        coincidencias++;
        break;
      }
    }
  }

  const minTokens = Math.min(tokens1.length, tokens2.length);
  if (minTokens >= 2 && coincidencias >= 2) return true;
  if (minTokens === 1 && coincidencias === 1 && (tokens1.length === 1 || tokens2.length === 1)) return true;

  return false;
}

/**
 * Busca en la lista de clientes el que coincide con los datos del usuario actual
 */
export function buscarClienteCoincidente(listaClientes, { uid, email, displayName, telefono }) {
  if (!Array.isArray(listaClientes) || listaClientes.length === 0) return null;

  // 1. Coincidencia por UID / AuthUID
  if (uid) {
    const porUid = listaClientes.find(c => c.id === uid || c.authUid === uid || c.clienteId === uid);
    if (porUid) return porUid;
  }

  // 2. Coincidencia por Email exacto
  if (email) {
    const emailNorm = email.toLowerCase().trim();
    const porEmail = listaClientes.find(c => c.email && c.email.toLowerCase().trim() === emailNorm);
    if (porEmail) return porEmail;
  }

  // 3. Coincidencia por Teléfono
  if (telefono) {
    const porTelefono = listaClientes.find(c => c.telefono && coincidenTelefonos(c.telefono, telefono));
    if (porTelefono) return porTelefono;
  }

  // 4. Coincidencia por Nombre inteligente (displayName vs c.nombre)
  if (displayName) {
    const porNombre = listaClientes.find(c => c.nombre && sonNombresEquivalentes(c.nombre, displayName));
    if (porNombre) return porNombre;
  }

  // 5. Coincidencia secundaria: email contiene el nombre o viceversa
  if (email) {
    const usuarioEmail = email.split('@')[0].replace(/[^a-z0-9]/g, ' ').toLowerCase();
    const porEmailNombre = listaClientes.find(c => c.nombre && sonNombresEquivalentes(c.nombre, usuarioEmail));
    if (porEmailNombre) return porEmailNombre;
  }

  return null;
}

/**
 * Retorna el nombre oficial del cliente si existe en la base de datos, o el nombre de Google como fallback
 */
export function obtenerNombreOficialCliente(clienteObj, user) {
  if (clienteObj && clienteObj.nombre && clienteObj.nombre.trim()) {
    return clienteObj.nombre.trim();
  }
  return user?.displayName || user?.email || 'Cliente';
}
