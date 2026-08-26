import { comprimirImagen } from '../utils/imageCompressor';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "t3cunnct";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "atelier_preset_2026_2026";

/**
 * Sube una imagen a Cloudinary con compresión previa, validación de tipo y timeout.
 * @param {File|Blob} archivo - Archivo de imagen a subir
 * @param {number} timeoutMs - Tiempo máximo de espera en ms (default 25s)
 * @returns {Promise<string>} URL segura de la imagen
 */
export const subirACloudinary = async (archivo, timeoutMs = 25000) => {
  if (!archivo) return "";

  // Validar que sea un archivo de tipo imagen válido
  if (archivo.type && !archivo.type.startsWith('image/')) {
    throw new Error("El archivo seleccionado no es una imagen válida");
  }

  // Comprimir imagen antes de la subida para acelerar la transferencia y ahorrar datos
  const archivoOptimizado = await comprimirImagen(archivo);

  const formData = new FormData();
  formData.append("file", archivoOptimizado);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const mensaje = errorData?.error?.message || `Error del servidor de imágenes (código ${response.status})`;
      throw new Error(mensaje);
    }

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Respuesta inválida del servicio de imágenes");
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Tiempo de espera agotado al subir la imagen", { cause: error });
    }
    console.error("Error en subida a Cloudinary:", error);
    throw error;
  }
};

