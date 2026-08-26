import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { subirACloudinary } from './cloudinary';

const DB_NAME = 'atelier-offline-db';
const STORE_NAME = 'pending-photos';
const MAX_REINTENTOS = 5;

const listenersCola = new Set();

export const suscribirEstadoCola = (callback) => {
  listenersCola.add(callback);
  obtenerCantidadFotosPendientes().then(callback).catch(() => {});
  return () => listenersCola.delete(callback);
};

const notificarCambioCola = async () => {
  try {
    const cant = await obtenerCantidadFotosPendientes();
    listenersCola.forEach(cb => {
      try { cb(cant); } catch (e) { console.error(e); }
    });
  } catch (err) {
    console.error("Error notificando estado de cola:", err);
  }
};

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export const obtenerCantidadFotosPendientes = async () => {
  try {
    const database = await openDatabase();
    return new Promise((resolve) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).count();
      request.onsuccess = () => resolve(request.result || 0);
      request.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
};

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
    request.onsuccess = () => {
      resolve();
      notificarCambioCola();
    };
    request.onerror = () => reject(request.error);
  });
};

const updatePendingPhoto = async (photo) => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(photo);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const encolarFoto = async ({ archivo, coleccion, documentoId, campo = 'foto', agregar = false }) => {
  if (!archivo) return;
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put({
      id: crypto.randomUUID(),
      archivo,
      coleccion,
      documentoId,
      campo,
      agregar,
      reintentos: 0,
      timestamp: Date.now()
    });
    request.onsuccess = () => {
      resolve();
      notificarCambioCola();
    };
    request.onerror = () => reject(request.error);
  });
};

export const procesarColaFotos = async () => {
  if (!navigator.onLine) return 0;

  let procesadasExitosamente = 0;
  try {
    const fotosPendientes = await readPendingPhotos();
    for (const foto of fotosPendientes) {
      try {
        if (foto.reintentos >= MAX_REINTENTOS) {
          console.warn(`Foto ${foto.id} descartada por exceder el límite de ${MAX_REINTENTOS} reintentos.`);
          await removePendingPhoto(foto.id);
          continue;
        }

        const url = foto.urlSubida || await subirACloudinary(foto.archivo);
        if (!foto.urlSubida) {
          await updatePendingPhoto({ ...foto, urlSubida: url });
        }
        
        const referencia = doc(db, foto.coleccion, String(foto.documentoId));
        const snapshot = await getDoc(referencia);
        if (!snapshot.exists()) {
          await removePendingPhoto(foto.id);
          continue;
        }

        const datosActuales = snapshot.data();
        const fotosActuales = Array.isArray(datosActuales[foto.campo]) ? datosActuales[foto.campo] : (datosActuales[foto.campo] ? [datosActuales[foto.campo]] : []);
        const valorActualizado = foto.agregar
          ? (fotosActuales.includes(url) ? fotosActuales : [...fotosActuales, url])
          : url;
          
        await setDoc(referencia, { [foto.campo]: valorActualizado }, { merge: true });
        if (foto.agregar && foto.campo === 'fotos' && !datosActuales.foto) {
          await setDoc(referencia, { foto: url }, { merge: true });
        }
        
        await removePendingPhoto(foto.id);
        procesadasExitosamente++;
      } catch (error) {
        console.error('Error procesando foto pendiente:', error);
        await updatePendingPhoto({ ...foto, reintentos: (foto.reintentos || 0) + 1 });
      }
    }
  } catch (err) {
    console.error('Error al procesar cola de fotos:', err);
  }
  return procesadasExitosamente;
};

export const sincronizarFotosManualmente = async () => {
  return await procesarColaFotos();
};

export const iniciarProcesadorDeFotos = (onFotosSincronizadas) => {
  const procesar = async () => {
    const count = await procesarColaFotos();
    if (count > 0 && typeof onFotosSincronizadas === 'function') {
      onFotosSincronizadas(count);
    }
  };

  window.addEventListener('online', procesar);
  procesar();
  return () => window.removeEventListener('online', procesar);
};

