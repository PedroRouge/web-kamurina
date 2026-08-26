export const handleKeyDownEnter = (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
    e.preventDefault();
    const form = e.target.form;
    if (form) {
      const index = Array.prototype.indexOf.call(form, e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  }
};

/**
 * Parsea de manera segura cualquier entrada a un número válido.
 * Maneja cadenas con comas, puntos, espacios y símbolos de moneda.
 * @param {any} valor - El valor a parsear (string, number, etc.)
 * @param {number} fallback - Valor devuelto si el número es inválido (default: 0)
 * @param {boolean} permitirNegativo - Si se admiten números negativos (default: false)
 * @returns {number} Número sanitizado
 */
export const parseNumero = (valor, fallback = 0, permitirNegativo = false) => {
  if (valor === null || valor === undefined || valor === '') return fallback;
  
  if (typeof valor === 'number') {
    if (isNaN(valor) || !isFinite(valor)) return fallback;
    return !permitirNegativo && valor < 0 ? 0 : valor;
  }

  if (typeof valor === 'string') {
    let limpio = valor.trim().replace(/[$€\s]/g, '');
    
    // Si contiene puntos y comas (ej. 1.250,50 o 1,250.50)
    if (limpio.includes('.') && limpio.includes(',')) {
      if (limpio.lastIndexOf(',') > limpio.lastIndexOf('.')) {
        // Formato europeo / latino: 1.250,50 -> 1250.50
        limpio = limpio.replace(/\./g, '').replace(',', '.');
      } else {
        // Formato anglosajón: 1,250.50 -> 1250.50
        limpio = limpio.replace(/,/g, '');
      }
    } else if (limpio.includes(',')) {
      // Solo coma: 15,50 -> 15.50
      limpio = limpio.replace(',', '.');
    }

    const parsed = parseFloat(limpio);
    if (isNaN(parsed) || !isFinite(parsed)) return fallback;
    return !permitirNegativo && parsed < 0 ? 0 : parsed;
  }

  return fallback;
};

/**
 * Formatea un número como moneda de forma segura ($15.000).
 * @param {any} valor 
 * @returns {string} Moneda formateada
 */
export const formatearMoneda = (valor) => {
  const num = parseNumero(valor, 0);
  return `$${num.toLocaleString('es-AR')}`;
};

/**
 * Valida formato de teléfono (solo números, entre 6 y 15 dígitos).
 * @param {string} tel 
 * @returns {boolean}
 */
export const validarTelefono = (tel) => {
  if (!tel || typeof tel !== 'string') return false;
  return /^\d{6,15}$/.test(tel.trim());
};

export const generarIdPedido = (pedidos = [], esAdmin = true) => {
  if (esAdmin && pedidos.length > 0) {
    const maxNum = pedidos.reduce((max, p) => {
      const match = (p.id || '').match(/^PED-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    if (maxNum > 0) {
      return `PED-${String(maxNum + 1).padStart(3, '0')}`;
    }
  }
  
  const now = new Date();
  const anio = String(now.getFullYear()).slice(-2);
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const dia = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `PED-${anio}${mes}${dia}-${randomSuffix}`;
};

