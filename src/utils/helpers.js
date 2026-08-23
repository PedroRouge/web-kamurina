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
