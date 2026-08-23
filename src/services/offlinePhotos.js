import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { subirACloudinary } from './cloudinary';

const DB_NAME = 'atelier-offline-db';
const STORE_NAME = 'pending-photos';

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const readPendingPhotos = async () => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const removePendingPhoto = async (id) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const encolarFoto = async ({ archivo, coleccion, documentoId, campo = 'foto', agregar = false }) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put({
      id: crypto.randomUUID(),
      archivo,
      coleccion,
      documentoId,
      campo,
      agregar
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const procesarColaFotos = async () => {
  if (!navigator.onLine) return;

  const fotosPendientes = await readPendingPhotos();
  for (const foto of fotosPendientes) {
    try {
      const url = await subirACloudinary(foto.archivo);
      const referencia = doc(db, foto.coleccion, String(foto.documentoId));
      const snapshot = await getDoc(referencia);
      if (!snapshot.exists()) {
        await removePendingPhoto(foto.id);
        continue;
      }

      const datosActuales = snapshot.data();
      const valorActualizado = foto.agregar
        ? [...(datosActuales[foto.campo] || []), url]
        : url;
      await setDoc(referencia, { [foto.campo]: valorActualizado }, { merge: true });
      if (foto.agregar && foto.campo === 'fotos' && !datosActuales.foto) {
        await setDoc(referencia, { foto: url }, { merge: true });
      }
      await removePendingPhoto(foto.id);
    } catch (error) {
      console.error('Error procesando foto pendiente:', error);
    }
  }
};

export const iniciarProcesadorDeFotos = () => {
  const procesar = () => procesarColaFotos();
  window.addEventListener('online', procesar);
  procesar();
  return () => window.removeEventListener('online', procesar);
};
