/**
 * Comprime y redimensiona una imagen en el navegador antes de subirla a la nube.
 * @param {File|Blob} archivo - Archivo de imagen original
 * @param {number} maxWidth - Ancho máximo permitido (default: 1600px)
 * @param {number} maxHeight - Alto máximo permitido (default: 1600px)
 * @param {number} quality - Calidad de compresión JPEG (0 a 1, default: 0.82)
 * @returns {Promise<File|Blob>} Archivo optimizado
 */
export const comprimirImagen = async (archivo, maxWidth = 1600, maxHeight = 1600, quality = 0.82) => {
  if (!archivo || !(archivo instanceof Blob)) return archivo;
  if (!archivo.type.startsWith('image/')) return archivo;
  if (archivo.type === 'image/svg+xml' || archivo.type === 'image/gif') return archivo;
  
  // Si la imagen ya es pequeña (< 200 KB), no hace falta comprimir
  if (archivo.size < 200 * 1024) return archivo;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(archivo);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(archivo);
              return;
            }
            // Retorna un objeto File con el nombre original si aplica
            const nombreArchivo = archivo.name ? archivo.name.replace(/\.[^/.]+$/, ".jpg") : "imagen_optimizada.jpg";
            const archivoComprimido = new File([blob], nombreArchivo, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(archivoComprimido);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(archivo);
    };

    reader.onerror = () => resolve(archivo);
  });
};
