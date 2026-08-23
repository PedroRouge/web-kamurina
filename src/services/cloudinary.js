import { comprimirImagen } from '../utils/imageCompressor';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "t3cunnct";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "atelier_preset_2026_2026";

export const subirACloudinary = async (archivo) => {
  if (!archivo) return "";

  // Comprimir imagen antes de la subida para acelerar la transferencia y ahorrar datos
  const archivoOptimizado = await comprimirImagen(archivo);

  const formData = new FormData();
  formData.append("file", archivoOptimizado);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Error al subir la imagen a Cloudinary");
    }
  } catch (error) {
    console.error("Error en subida:", error);
    throw error;
  }
};
