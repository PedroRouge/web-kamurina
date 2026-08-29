import React, { useState, useEffect, useRef, Suspense } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

import { db, auth, googleProvider } from './services/firebase';
import { subirACloudinary } from './services/cloudinary';
import { encolarFoto, iniciarProcesadorDeFotos, suscribirEstadoCola, sincronizarFotosManualmente } from './services/offlinePhotos';
import { MEDIDAS_LISTA } from './constants/medidas';
import { handleKeyDownEnter, generarIdPedido, parseNumero, formatearMoneda, validarTelefono } from './utils/helpers';
import { buscarClienteCoincidente, sonNombresEquivalentes, coincidenTelefonos } from './utils/clienteMatcher';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';
import FloatingMenu from './components/FloatingMenu';

import ModalConfirm from './components/modals/ModalConfirm';
import ModalRechazo from './components/modals/ModalRechazo';
import ModalPago from './components/modals/ModalPago';
import ModalAlias from './components/modals/ModalAlias';
import ModalFotoAmpliada from './components/modals/ModalFotoAmpliada';

import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SolicitudesView from './views/SolicitudesView';
import DetallePedidoView from './views/DetallePedidoView';
import NuevoPedidoView from './views/NuevoPedidoView';
import ClientesView from './views/ClientesView';
import NuevoClienteView from './views/NuevoClienteView';
import EditarClienteView from './views/EditarClienteView';
import DetalleClienteView from './views/DetalleClienteView';
import CatalogoTelasView from './views/CatalogoTelasView';
import NuevaTelaView from './views/NuevaTelaView';
import EditarTelaView from './views/EditarTelaView';
import DetalleTelaView from './views/DetalleTelaView';
import CatalogoAviosView from './views/CatalogoAviosView';
import NuevoAvioView from './views/NuevoAvioView';
import EditarAvioView from './views/EditarAvioView';
import DetalleAvioView from './views/DetalleAvioView';
import CalculadoraView from './views/CalculadoraView';
import GananciasView from './views/GananciasView';
import MolderiaView from './views/MolderiaView';

const ViewLoadingFallback = () => (
  <div className="py-20 flex justify-center items-center text-stone-500 text-sm italic">
    Cargando sección...
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [loadingRol, setLoadingRol] = useState(true);

  const [vista, setVista] = useState('dashboard');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaTelas, setBusquedaTelas] = useState('');
  const [busquedaAvios, setBusquedaAvios] = useState('');
  const [error, setError] = useState('');
  
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [isLoginView, setIsLoginView] = useState(true); 
  const [authLoading, setAuthLoading] = useState(true); 

  const [busquedaDashboard, setBusquedaDashboard] = useState('');
  const [filtroEstadoDashboard] = useState('TODOS');

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [telaSeleccionada, setTelaSeleccionada] = useState(null);
  const [avioSeleccionado, setAvioSeleccionado] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [fotosPendientesCount, setFotosPendientesCount] = useState(0);

  const formRef = useRef(null);
  const [formDirty, setFormDirty] = useState(false);
  const formDirtyRef = useRef(false);

  const setFormDirtyState = (val) => {
    formDirtyRef.current = Boolean(val);
    setFormDirty(Boolean(val));
  };

  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [modalConfirm, setModalConfirm] = useState({ isOpen: false, text: '', action: null, buttons: null });
  const [modalRechazo, setModalRechazo] = useState({ isOpen: false, pedidoId: null, motivo: '' });
  const [modalPago, setModalPago] = useState({ isOpen: false, pedidoId: null });
  const [montoPagoInput, setMontoPagoInput] = useState('');
  const [metodoPagoInput, setMetodoPagoInput] = useState('Efectivo');
  const [modalAlias, setModalAlias] = useState({ isOpen: false, pedido: null });

  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [telas, setTelas] = useState([]);
  const [avios, setAvios] = useState([]);

  const [calc, setCalc] = useState({ cm: 0, costoMetro: 0, avios: 0, horas: 0, valorHora: 0, margen: 0, precioPersonalizado: 0 });

  const clienteActual = React.useMemo(() => {
    if (!user) return null;
    return buscarClienteCoincidente(clientes, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      telefono: user.phoneNumber
    });
  }, [clientes, user]);

  useEffect(() => {
    if (user && clienteActual && !esAdmin) {
      if (!clienteActual.authUid || !clienteActual.email) {
        const actualizacion = {};
        if (!clienteActual.authUid) actualizacion.authUid = user.uid;
        if (!clienteActual.email && user.email) actualizacion.email = user.email;
        setDoc(doc(db, "clientes", String(clienteActual.id)), actualizacion, { merge: true }).catch(err => {
          console.warn("No se pudo autovincular authUid del cliente:", err);
        });
      }
    }
  }, [user, clienteActual, esAdmin]);

  const mostrarToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const subirOEncolarFoto = async (archivo, destino) => {
    if (!archivo || archivo.size === 0) return '';
    if (!navigator.onLine) {
      await encolarFoto({ archivo, ...destino });
      return '';
    }

    try {
      return await subirACloudinary(archivo);
    } catch (err) {
      if (err instanceof TypeError || !navigator.onLine) {
        await encolarFoto({ archivo, ...destino });
        return '';
      }
      throw err;
    }
  };

  useEffect(() => {
    const unsubCola = suscribirEstadoCola((cant) => setFotosPendientesCount(cant));
    const unsubProcesador = iniciarProcesadorDeFotos((cant) => {
      mostrarToast(`¡${cant} foto(s) sincronizada(s) con la nube!`);
    });
    return () => {
      unsubCola();
      unsubProcesador();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingRol(true);
        try {
          const ADMIN_EMAILS = ['pedrorouge2022@gmail.com'];
          const esAdminEmail = currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase());

          const docRef = doc(db, "usuarios_roles", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (esAdminEmail) {
            setEsAdmin(true);
            if (!docSnap.exists() || docSnap.data().rol !== 'admin') {
              try {
                await setDoc(docRef, { rol: 'admin', email: currentUser.email }, { merge: true });
              } catch (e) {
                console.warn("No se pudo escribir en usuarios_roles:", e);
              }
            }
          } else if (docSnap.exists() && docSnap.data().rol === 'admin') {
            setEsAdmin(true);
          } else {
            setEsAdmin(false);
          }
        } catch (err) {
          console.error("Error consultando rol:", err);
          const ADMIN_EMAILS = ['pedrorouge2022@gmail.com'];
          setEsAdmin(currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()));
        }
        setLoadingRol(false);
        window.history.replaceState({ vista: 'dashboard' }, '');
      } else {
        setEsAdmin(false);
        setLoadingRol(false);
        setClientes([]);
        setPedidos([]);
        setTelas([]);
        setAvios([]);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const handlePopState = (event) => {
      if (fotoAmpliada) {
        setFotoAmpliada(null);
        window.history.pushState({ vista }, '');
        return;
      }
      if (modalConfirm.isOpen) {
        setModalConfirm({ isOpen: false, text: '', action: null, buttons: null });
        window.history.pushState({ vista }, '');
        return;
      }
      if (modalRechazo.isOpen) {
        setModalRechazo({ isOpen: false, pedidoId: null, motivo: '' });
        window.history.pushState({ vista }, '');
        return;
      }
      if (modalPago.isOpen) {
        setModalPago({ isOpen: false, pedidoId: null });
        window.history.pushState({ vista }, '');
        return;
      }
      if (modalAlias.isOpen) {
        setModalAlias({ isOpen: false, pedido: null });
        window.history.pushState({ vista }, '');
        return;
      }
      if (menuAbierto) {
        setMenuAbierto(false);
        window.history.pushState({ vista }, '');
        return;
      }

      const targetVista = event.state?.vista || 'dashboard';

      if ((vista === 'nuevo-cliente' || vista === 'editar-cliente') && formDirtyRef.current) {
        window.history.pushState({ vista }, ''); 
        setModalConfirm({
          isOpen: true,
          text: "⚠️ Tienes información sin guardar. ¿Qué deseas hacer?",
          buttons: [
            { 
              text: "Salir sin guardar", 
              action: () => { 
                formDirtyRef.current = false; 
                setFormDirty(false); 
                window.history.pushState({ vista: targetVista }, ''); 
                setVista(targetVista); 
              }, 
              style: "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40" 
            },
            { 
              text: "Guardar ahora", 
              action: () => { 
                if (formRef.current) formRef.current.requestSubmit(); 
              }, 
              style: "bg-white text-stone-950 hover:bg-stone-200" 
            }
          ]
        });
        return;
      }

      if (event.state && event.state.vista) {
        setVista(event.state.vista);
      } else {
        setVista('dashboard');
      }
      formDirtyRef.current = false;
      setFormDirty(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, fotoAmpliada, modalConfirm.isOpen, modalRechazo.isOpen, modalPago.isOpen, modalAlias.isOpen, menuAbierto, vista, formDirty]);

  const cambiarVista = (nuevaVista, force = false) => {
    if (!force && (vista === 'nuevo-cliente' || vista === 'editar-cliente') && formDirtyRef.current) {
      setModalConfirm({
        isOpen: true,
        text: "⚠️ Tienes información sin guardar. ¿Qué deseas hacer?",
        buttons: [
          { 
            text: "Salir sin guardar", 
            action: () => { 
              formDirtyRef.current = false; 
              setFormDirty(false); 
              window.history.pushState({ vista: nuevaVista }, ''); 
              setVista(nuevaVista); 
              setMenuAbierto(false); 
            }, 
            style: "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40" 
          },
          { 
            text: "Guardar ahora", 
            action: () => { 
              if (formRef.current) formRef.current.requestSubmit(); 
            }, 
            style: "bg-white text-stone-950 hover:bg-stone-200" 
          }
        ]
      });
      return;
    }

    formDirtyRef.current = false;
    setFormDirty(false);
    window.history.pushState({ vista: nuevaVista }, '');
    setVista(nuevaVista);
    setMenuAbierto(false);
  };

  useEffect(() => {
    if (!user || loadingRol) return;
    
    let unsubClientes = () => {};
    let unsubPedidos = () => {};
    let unsubTelas = () => {};
    let unsubAvios = () => {};

    if (esAdmin) {
      unsubClientes = onSnapshot(collection(db, "clientes"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setClientes(list);
      }, (err) => {
        console.error("Error leyendo clientes:", err);
        mostrarToast("Error de conexión al cargar clientes");
      });

      unsubPedidos = onSnapshot(collection(db, "pedidos"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPedidos(list);
      }, (err) => {
        console.error("Error leyendo pedidos:", err);
        mostrarToast("Error de conexión al cargar pedidos");
      });

      unsubTelas = onSnapshot(collection(db, "telas"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTelas(list);
      }, (err) => {
        console.error("Error leyendo telas:", err);
        mostrarToast("Error de conexión al cargar telas");
      });

      unsubAvios = onSnapshot(collection(db, "avios"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAvios(list);
      }, (err) => {
        console.error("Error leyendo avios:", err);
        mostrarToast("Error de conexión al cargar avíos");
      });
    } else {
      unsubClientes = onSnapshot(collection(db, "clientes"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setClientes(list);
      }, (err) => {
        console.error("Error leyendo clientes:", err);
      });

      unsubPedidos = onSnapshot(collection(db, "pedidos"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPedidos(list);
      }, (err) => console.error("Error leyendo pedidos del cliente:", err));

      setTelas([]);
      setAvios([]);
    }

    return () => {
      unsubClientes();
      unsubPedidos();
      unsubTelas();
      unsubAvios();
    };
  }, [user, esAdmin, loadingRol]);

  const metrosCalculados = parseNumero(calc.cm, 0) / 100;
  const costoMetroSanitizado = parseNumero(calc.costoMetro, 0);
  const aviosSanitizados = parseNumero(calc.avios, 0);
  const horasSanitizadas = parseNumero(calc.horas, 0);
  const valorHoraSanitizado = parseNumero(calc.valorHora, 0);
  const margenSanitizado = parseNumero(calc.margen, 0);
  const precioPersonalizadoSanitizado = parseNumero(calc.precioPersonalizado, 0);

  const materiales = (metrosCalculados * costoMetroSanitizado) + aviosSanitizados;
  const manoObra = horasSanitizadas * valorHoraSanitizado;
  const costoTotal = materiales + manoObra;
  const calculoNormal = costoTotal * (1 + margenSanitizado / 100);
  const precioFinal = precioPersonalizadoSanitizado > 0 ? precioPersonalizadoSanitizado : calculoNormal;
  const gananciaNeta = manoObra + (precioFinal - costoTotal);

  const borrarCliente = async (id) => {
    try {
      const clienteABorrar = clientes.find(c => c.id === id);
      if (clienteABorrar) {
        const nombreCliente = clienteABorrar.nombre ? clienteABorrar.nombre.toLowerCase() : '';
        const pedidosDelCliente = pedidos.filter(p => (p.clienteId && p.clienteId === id) || (p.cliente && p.cliente.toLowerCase() === nombreCliente));
        const promesasDeBorrado = pedidosDelCliente.map(p => deleteDoc(doc(db, "pedidos", String(p.id))));
        await Promise.all(promesasDeBorrado);
      }
      await deleteDoc(doc(db, "clientes", String(id)));
      if (clienteSeleccionado?.id === id) cambiarVista('clientes');
      mostrarToast("Cliente eliminado con éxito");
    } catch (err) {
      console.error("Error al borrar cliente:", err);
      mostrarToast("Error al eliminar cliente");
    }
  };
  
  const borrarTela = async (id) => {
    try {
      await deleteDoc(doc(db, "telas", String(id)));
      if (telaSeleccionada?.id === id) cambiarVista('catalogo');
      mostrarToast("Tela eliminada con éxito");
    } catch (err) {
      console.error("Error al borrar tela:", err);
      mostrarToast("Error al eliminar tela");
    }
  };

  const borrarAvio = async (id) => {
    try {
      await deleteDoc(doc(db, "avios", String(id)));
      if (avioSeleccionado?.id === id) cambiarVista('catalogo-avios');
      mostrarToast("Avío eliminado con éxito");
    } catch (err) {
      console.error("Error al borrar avío:", err);
      mostrarToast("Error al eliminar avío");
    }
  };

  const actualizarStock = async (id, nuevoStock) => {
    try {
      const tela = telas.find(t => t.id === id);
      if (tela) {
        await setDoc(doc(db, "telas", String(id)), { ...tela, stock: String(nuevoStock) }, { merge: true });
      }
    } catch (err) {
      console.error("Error stock:", err);
      mostrarToast("Error al actualizar stock");
    }
  };

  const actualizarCantidadAvio = async (id, nuevaCantidad) => {
    try {
      const avio = avios.find(a => a.id === id);
      if (avio) {
        await setDoc(doc(db, "avios", String(id)), { ...avio, cantidad: String(nuevaCantidad) }, { merge: true });
      }
    } catch (err) {
      console.error("Error cantidad avio:", err);
      mostrarToast("Error al actualizar cantidad");
    }
  };

  const actualizarPrecioAvio = async (id, nuevoPrecio) => {
    try {
      const avio = avios.find(a => a.id === id);
      if (avio) {
        const precioSanitizado = parseNumero(nuevoPrecio, 0);
        await setDoc(doc(db, "avios", String(id)), { ...avio, precio: precioSanitizado }, { merge: true });
      }
    } catch (err) {
      console.error("Error precio avio:", err);
      mostrarToast("Error al actualizar precio");
    }
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    const fd = new FormData(e.target);
    const telefono = (fd.get('telefono') || '').trim();
    if (!validarTelefono(telefono)) {
      mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
      return;
    }
    
    formDirtyRef.current = false;
    setFormDirty(false);
    setIsSaving(true);
    
    try {
      const medidas = {};
      MEDIDAS_LISTA.forEach(m => medidas[m] = fd.get(m));
      const id = crypto.randomUUID();
      const nuevo = { id, nombre: fd.get('nombre'), telefono, medidas };
      await setDoc(doc(db, "clientes", String(id)), nuevo);
      
      mostrarToast("Cliente guardado con éxito");
      cambiarVista('clientes', true);
    } catch (err) {
      console.error("Error guardar cliente:", err);
      mostrarToast("Error al guardar cliente");
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarCliente = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    const fd = new FormData(e.target);
    const telefono = (fd.get('telefono') || '').trim();
    if (!validarTelefono(telefono)) {
      mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
      return;
    }
    
    formDirtyRef.current = false;
    setFormDirty(false);
    setIsSaving(true);

    try {
      const nuevoNombre = (fd.get('nombre') || '').trim();
      const antiguoNombre = clienteSeleccionado.nombre;
      const medidas = {};
      MEDIDAS_LISTA.forEach(m => medidas[m] = fd.get(m));
      const actualizado = { ...clienteSeleccionado, nombre: nuevoNombre, telefono, medidas };
      await setDoc(doc(db, "clientes", String(clienteSeleccionado.id)), actualizado);
      setClienteSeleccionado(actualizado);

      // Sincronizar pedidos vinculados para que mantengan el nombre oficial editado por el admin
      if (antiguoNombre && nuevoNombre && antiguoNombre !== nuevoNombre) {
        const pedidosAActualizar = pedidos.filter(p => 
          (p.clienteId && (p.clienteId === clienteSeleccionado.id || p.clienteId === clienteSeleccionado.authUid)) ||
          (p.cliente && sonNombresEquivalentes(p.cliente, antiguoNombre)) ||
          (p.telefono && coincidenTelefonos(p.telefono, clienteSeleccionado.telefono))
        );

        for (const ped of pedidosAActualizar) {
          if (ped.cliente !== nuevoNombre) {
            try {
              await setDoc(doc(db, "pedidos", String(ped.id)), { 
                ...ped,
                cliente: nuevoNombre,
                clienteId: ped.clienteId || clienteSeleccionado.authUid || clienteSeleccionado.id
              }, { merge: true });
            } catch (errPed) {
              console.warn("No se pudo actualizar pedido:", ped.id, errPed);
            }
          }
        }
      }
      
      mostrarToast("Cliente y pedidos sincronizados con éxito");
      cambiarVista('clientes', true);
    } catch (err) {
      console.error("Error actualizar cliente:", err);
      mostrarToast("Error al actualizar cliente");
    } finally {
      setIsSaving(false);
    }
  };

  const guardarTela = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const fd = new FormData(e.target);
    const precio = parseNumero(fd.get('precio'), 0);
    try {
      const archivoFoto = fd.get('fotoArchivo');
      const id = crypto.randomUUID();
      const urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'telas', documentoId: id });
      const nueva = { 
        id, 
        nombre: fd.get('nombre'), 
        descripcion: fd.get('desc'), 
        uso: fd.get('uso'), 
        stock: fd.get('stock'), 
        precio: precio,
        foto: urlFoto 
      };
      await setDoc(doc(db, "telas", String(id)), nueva);
      mostrarToast("Tela guardada con éxito");
      cambiarVista('catalogo');
    } catch (err) {
      console.error("Error guardar tela:", err);
      mostrarToast("Error al guardar tela");
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarTelaEditada = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const fd = new FormData(e.target);
    const precio = parseNumero(fd.get('precio'), 0);
    try {
      const archivoFoto = fd.get('fotoArchivo');
      const urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'telas', documentoId: telaSeleccionada.id });

      const actualizada = { 
        ...telaSeleccionada, 
        nombre: fd.get('nombre'), 
        descripcion: fd.get('desc'), 
        uso: fd.get('uso'), 
        stock: fd.get('stock'), 
        precio: precio,
        foto: urlFoto || telaSeleccionada.foto
      };
      await setDoc(doc(db, "telas", String(telaSeleccionada.id)), actualizada);
      setTelaSeleccionada(actualizada);
      mostrarToast("Tela actualizada con éxito");
      cambiarVista('detalle-tela');
    } catch (err) {
      console.error("Error actualizar tela:", err);
      mostrarToast("Error al actualizar tela");
    } finally {
      setIsSaving(false);
    }
  };

  const guardarAvio = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const fd = new FormData(e.target);
    const precio = parseNumero(fd.get('precio'), 0);
    try {
      const archivoFoto = fd.get('fotoArchivo');
      const id = crypto.randomUUID();
      const urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'avios', documentoId: id });
      const nuevo = { 
        id, 
        nombre: fd.get('nombre'), 
        tipo: fd.get('tipo'), 
        centimetros: fd.get('centimetros'), 
        cantidad: fd.get('cantidad'), 
        precio: precio,
        foto: urlFoto 
      };
      await setDoc(doc(db, "avios", String(id)), nuevo);
      mostrarToast("Avío guardado con éxito");
      cambiarVista('catalogo-avios');
    } catch (err) {
      console.error("Error guardar avio:", err);
      mostrarToast("Error al guardar avío");
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarAvioEditado = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const fd = new FormData(e.target);
    const precio = parseNumero(fd.get('precio'), 0);
    try {
      const archivoFoto = fd.get('fotoArchivo');
      const urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'avios', documentoId: avioSeleccionado.id });

      const actualizado = { 
        ...avioSeleccionado, 
        nombre: fd.get('nombre'), 
        tipo: fd.get('tipo'), 
        centimetros: fd.get('centimetros'), 
        cantidad: fd.get('cantidad'), 
        precio: precio,
        foto: urlFoto || avioSeleccionado.foto
      };
      await setDoc(doc(db, "avios", String(avioSeleccionado.id)), actualizado);
      setAvioSeleccionado(actualizado);
      mostrarToast("Avío actualizado con éxito");
      cambiarVista('detalle-avio');
    } catch (err) {
      console.error("Error actualizar avio:", err);
      mostrarToast("Error al actualizar avío");
    } finally {
      setIsSaving(false);
    }
  };

  const crearPedido = async (e) => {
    e.preventDefault();
    if (isSaving) return; 
    setIsSaving(true);
    try {
      const fd = new FormData(e.target);
      let telefonoCliente = esAdmin ? '' : (fd.get('telefono') || '').trim();

      const timestamp = Date.now();
      const id = generarIdPedido(pedidos, esAdmin);

      const archivoFoto = fd.get('fotoArchivo');
      const urlFoto = await subirOEncolarFoto(archivoFoto, { coleccion: 'pedidos', documentoId: id, campo: 'fotos', agregar: true });

      let clienteId = '';
      let nombreCliente = '';

      if (esAdmin) {
        const clienteIdSeleccionado = fd.get('clienteId');
        const clienteObj = clientes.find(c => c.id === clienteIdSeleccionado);
        clienteId = clienteObj?.authUid || clienteIdSeleccionado || '';
        nombreCliente = clienteObj ? clienteObj.nombre : (fd.get('clienteNombre') || '');
      } else {
        clienteId = user?.uid || '';
        
        // Detectar si el usuario ya tiene ficha registrada (ej: editada por el admin como "Agustina Lederos")
        const clienteEncontrado = clienteActual || buscarClienteCoincidente(clientes, {
          uid: user?.uid,
          email: user?.email,
          displayName: user?.displayName,
          telefono: telefonoCliente
        });

        if (clienteEncontrado) {
          nombreCliente = clienteEncontrado.nombre || user?.displayName || user?.email || 'Cliente';
          if (!telefonoCliente && clienteEncontrado.telefono) {
            telefonoCliente = clienteEncontrado.telefono;
          }
        } else {
          nombreCliente = user?.displayName || user?.email || 'Cliente';
        }

        if (!telefonoCliente || !validarTelefono(telefonoCliente)) {
          mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
          setIsSaving(false);
          return;
        }
      }

      const descripcionDetalle = esAdmin ? '' : (fd.get('descripcionDetalle') || '');
      const estadoInicial = esAdmin ? 'Eligiendo telas' : 'Pendiente de Aprobación';

      const nuevo = { 
          id,
          createdAt: timestamp,
          clienteId,
          cliente: nombreCliente, 
          telefono: telefonoCliente,
          prenda: fd.get('prenda'), 
          estado: estadoInicial, 
          entrega: '', 
          descripcionDetalle: descripcionDetalle,
          precio: 0, 
          pagado: false,
          pagos: [], 
          tela: fd.get('tela') || '',
          foto: urlFoto || '',
          fotos: urlFoto ? [urlFoto] : [],
          ocultoDashboard: false,
          materialesCosto: 0,
          manoObraCosto: 0,
          gastos: 0,
          motivoRechazo: ''
      };

      await setDoc(doc(db, "pedidos", String(id)), nuevo);
      mostrarToast(esAdmin ? "¡Pedido creado con éxito!" : "¡Solicitud enviada con éxito!");

      if (!esAdmin) {
        const clienteEncontrado = clienteActual || buscarClienteCoincidente(clientes, {
          uid: user?.uid,
          email: user?.email,
          displayName: user?.displayName,
          telefono: telefonoCliente
        });

        if (!clienteEncontrado) {
          const nuevoClienteId = user?.uid || crypto.randomUUID();
          const medidasVacias = {};
          MEDIDAS_LISTA.forEach(m => medidasVacias[m] = '');
          const fichaCliente = {
            id: nuevoClienteId,
            authUid: user?.uid || '',
            email: user?.email || '',
            nombre: nombreCliente,
            telefono: telefonoCliente,
            medidas: medidasVacias
          };
          await setDoc(doc(db, "clientes", String(nuevoClienteId)), fichaCliente);
        } else {
          // Si ya existe la ficha, vinculamos authUid/email/telefono sin sobreescribir el nombre oficial
          const actualizacion = {};
          if (!clienteEncontrado.authUid && user?.uid) actualizacion.authUid = user.uid;
          if (!clienteEncontrado.email && user?.email) actualizacion.email = user.email;
          if (!clienteEncontrado.telefono && telefonoCliente) actualizacion.telefono = telefonoCliente;

          if (Object.keys(actualizacion).length > 0) {
            await setDoc(doc(db, "clientes", String(clienteEncontrado.id)), actualizacion, { merge: true });
          }
        }
      }

      cambiarVista('dashboard');
    } catch (err) {
      console.error("Error crear pedido:", err);
      mostrarToast("Error al crear pedido");
    } finally {
      setIsSaving(false);
    }
  };

  const asignarPrecioAPedido = async (e) => {
    e.preventDefault();
    if (precioFinal < 0) {
      mostrarToast("⚠️ El precio no puede ser negativo");
      return;
    }
    try {
      const fd = new FormData(e.target);
      const pedidoId = fd.get('pedidoId');
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (pedido) {
        const actualizado = { 
          ...pedido, 
          precio: parseNumero(precioFinal, 0),
          materialesCosto: parseNumero(materiales, 0),
          manoObraCosto: parseNumero(manoObra, 0),
          gastos: parseNumero(materiales, 0)
        };
        await setDoc(doc(db, "pedidos", String(pedidoId)), actualizado, { merge: true });
        mostrarToast("Precio asignado correctamente");
      }
      cambiarVista('dashboard');
    } catch (err) {
      console.error("Error asignar precio:", err);
      mostrarToast("Error al asignar precio");
    }
  };

  const ocultarPedidoDashboard = async (id) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(id)), { ...pedido, ocultoDashboard: true }, { merge: true });
        mostrarToast("Pedido quitado del dashboard (conservado en el historial del cliente)");
      }
    } catch (err) {
      console.error("Error ocultar pedido:", err);
      mostrarToast("Error al ocultar pedido");
    }
  };

  const restaurarPedidoDashboard = async (id) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(id)), { ...pedido, ocultoDashboard: false }, { merge: true });
        mostrarToast("Pedido restaurado al dashboard");
      }
    } catch (err) {
      console.error("Error restaurar pedido:", err);
      mostrarToast("Error al restaurar pedido");
    }
  };

const borrarPedidoDefinitivo = async (idOrObj) => {
    // 1. Limpiamos y extraemos el ID sea como sea que llegue
    let idDef = '';
    if (typeof idOrObj === 'object' && idOrObj !== null) {
      idDef = idOrObj.id || idOrObj._id || idOrObj.pedidoId;
    } else {
      idDef = idOrObj;
    }

    const idString = String(idDef).trim();

    // 2. Filtro de seguridad por si llega vacío o como '[object Object]'
    if (!idString || idString === 'undefined' || idString === '[object Object]') {
      mostrarToast("⚠️ Error interno: El ID llegó vacío al confirmarse.");
      console.error("ID corrupto:", idOrObj);
      return;
    }

    try {
      // 3. Borrado optimista (lo quitamos de tu pantalla al instante para que no parpadee)
      setPedidos(prev => prev.filter(p => String(p.id).trim() !== idString));
      
      if (pedidoSeleccionado && String(pedidoSeleccionado.id).trim() === idString) {
        setPedidoSeleccionado(null);
      }

      // 4. El hachazo final en Firebase
      await deleteDoc(doc(db, "pedidos", idString));
      
      cambiarVista('dashboard', true);
      mostrarToast("¡Pedido eliminado definitivamente!");
      
    } catch (err) {
      // Si Firebase lo rechaza, ahora SÍ te vas a enterar del porqué
      console.error("Error al borrar pedido en Firebase:", err);
      mostrarToast("⚠️ Firebase bloqueó el borrado. Revisa la consola.");
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(id)), { ...pedido, estado: nuevoEstado, motivoRechazo: nuevoEstado === 'Rechazado' ? pedido.motivoRechazo : '' }, { merge: true });
        if (pedidoSeleccionado?.id === id) {
          setPedidoSeleccionado(prev => ({ ...prev, estado: nuevoEstado }));
        }
        mostrarToast("Estado actualizado");
      }
    } catch (err) {
      console.error("Error actualizar estado:", err);
      mostrarToast("Error al actualizar estado");
    }
  };

  const aceptarSolicitud = async (id) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(id)), { ...pedido, estado: 'Eligiendo telas', motivoRechazo: '' }, { merge: true });
        mostrarToast("Solicitud aceptada");
      }
    } catch (err) {
      console.error("Error aceptar solicitud:", err);
      mostrarToast("Error al aceptar solicitud");
    }
  };

  const registrarPagoParcial = async () => {
    if (!modalPago.pedidoId) return;
    const monto = parseNumero(montoPagoInput, 0);
    if (!monto || monto <= 0) {
      mostrarToast("⚠️ Ingresa un monto válido mayor a 0");
      return;
    }

    const pedido = pedidos.find(p => p.id === modalPago.pedidoId);
    if (!pedido) return;

    const pagosActuales = pedido.pagos || [];
    const totalAbonadoPrevio = pagosActuales.reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
    const precioTotal = parseNumero(pedido.precio, 0);
    const saldoPendiente = Math.max(0, precioTotal - totalAbonadoPrevio);

    if (monto > saldoPendiente && saldoPendiente > 0) {
      mostrarToast(`⚠️ El monto excede el saldo pendiente (${formatearMoneda(saldoPendiente)})`);
      return;
    }

    try {
      const nuevoPago = {
        id: crypto.randomUUID(),
        monto,
        metodo: metodoPagoInput || 'Efectivo',
        fecha: new Date().toLocaleDateString('es-AR')
      };
      const listaActualizada = [...pagosActuales, nuevoPago];
      const totalAbonado = listaActualizada.reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
      const estaPagado = precioTotal > 0 && totalAbonado >= precioTotal;

      const actualizado = {
        ...pedido,
        pagos: listaActualizada,
        pagado: estaPagado
      };

      await setDoc(doc(db, "pedidos", String(pedido.id)), actualizado, { merge: true });
      if (pedidoSeleccionado?.id === pedido.id) {
        setPedidoSeleccionado(actualizado);
      }
      setModalPago({ isOpen: false, pedidoId: null });
      setMontoPagoInput('');
      mostrarToast("Pago registrado con éxito");
    } catch (err) {
      console.error("Error registrar pago:", err);
      mostrarToast("Error al registrar pago");
    }
  };

  const eliminarPagoParcial = async (pagoId) => {
    if (!pedidoSeleccionado) return;
    try {
      const pagosActuales = pedidoSeleccionado.pagos || [];
      const listaActualizada = pagosActuales.filter(p => p.id !== pagoId);
      const totalAbonado = listaActualizada.reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
      const precioTotal = parseNumero(pedidoSeleccionado.precio, 0);
      const estaPagado = precioTotal > 0 && totalAbonado >= precioTotal;

      const actualizado = {
        ...pedidoSeleccionado,
        pagos: listaActualizada,
        pagado: estaPagado
      };

      await setDoc(doc(db, "pedidos", String(pedidoSeleccionado.id)), actualizado, { merge: true });
      setPedidoSeleccionado(actualizado);
      mostrarToast("Pago eliminado");
    } catch (err) {
      console.error("Error eliminar pago:", err);
      mostrarToast("Error al eliminar pago");
    }
  };

  const confirmarRechazoAdmin = async () => {
    if (!modalRechazo.pedidoId) return;
    try {
      const pedido = pedidos.find(p => p.id === modalRechazo.pedidoId);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(modalRechazo.pedidoId)), { 
          ...pedido, 
          estado: 'Rechazado', 
          motivoRechazo: modalRechazo.motivo?.trim() || 'No disponible para confeccionar en este momento.',
          ocultoDashboard: false 
        }, { merge: true });
      }
      setModalRechazo({ isOpen: false, pedidoId: null, motivo: '' });
      mostrarToast("Pedido rechazado y guardado en el historial");
    } catch (err) {
      console.error("Error rechazar pedido:", err);
      mostrarToast("Error al rechazar pedido");
    }
  };

  const exportarReportePDF = () => {
    window.print();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, loginUser, loginPass);
      } else {
        await createUserWithEmailAndPassword(auth, loginUser, loginPass);
      }
    } catch (err) {
      if (err.code === 'auth/invalid-credential') setError('Correo o contraseña incorrectos');
      else if (err.code === 'auth/email-already-in-use') setError('El correo ya está registrado');
      else if (err.code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres');
      else setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al salir:", err);
    }
  };

  const pedidosVisibles = pedidos.filter(p => {
    if (!esAdmin) {
      const nombreUsuario = clienteActual?.nombre || user?.displayName || user?.email;
      const userUid = user?.uid;
      const coincideUsuario = (p.clienteId && (p.clienteId === userUid || (clienteActual && (p.clienteId === clienteActual.id || p.clienteId === clienteActual.authUid)))) || 
        (p.cliente && nombreUsuario && sonNombresEquivalentes(p.cliente, nombreUsuario)) ||
        (p.telefono && clienteActual?.telefono && coincidenTelefonos(p.telefono, clienteActual.telefono));
      if (!coincideUsuario) return false;
    } else {
      if (p.estado === 'Pendiente de Aprobación') return false;
    }

    const textoBusqueda = busquedaDashboard.trim().toLowerCase();
    const coincideBusqueda = !textoBusqueda || 
      (p.cliente && p.cliente.toLowerCase().includes(textoBusqueda)) || 
      (p.prenda && p.prenda.toLowerCase().includes(textoBusqueda)) ||
      (p.id && p.id.toLowerCase().includes(textoBusqueda));
    return coincideBusqueda;
  }).sort((a, b) => {
    const timeA = Number(a.createdAt) || Number(a.id.replace('PED-', '')) || 0;
    const timeB = Number(b.createdAt) || Number(b.id.replace('PED-', '')) || 0;
    return timeB - timeA;
  });

  const solicitudesPendientesAdmin = pedidos.filter(p => {
    if (p.ocultoDashboard) return false;
    return p.estado === 'Pendiente de Aprobación';
  }).sort((a, b) => {
    const timeA = Number(a.createdAt) || Number(a.id.replace('PED-', '')) || 0;
    const timeB = Number(b.createdAt) || Number(b.id.replace('PED-', '')) || 0;
    return timeB - timeA;
  });

  const pedidosParaCalculadora = pedidos.filter(p => !p.ocultoDashboard).sort((a, b) => {
    const timeA = Number(a.createdAt) || Number(a.id.replace('PED-', '')) || 0;
    const timeB = Number(b.createdAt) || Number(b.id.replace('PED-', '')) || 0;
    return timeB - timeA;
  });

  const totalPedidosActivos = pedidos.filter(p => !p.ocultoDashboard && p.estado !== 'Rechazado' && p.estado !== 'Pendiente de Aprobación' && p.estado !== 'Entregado con éxito').length;
  const ingresosDelMes = pedidos.reduce((acc, p) => {
    if (p.ocultoDashboard || !p.precio || parseNumero(p.precio, 0) <= 0) return acc;
    const sumaPagos = (p.pagos || []).reduce((sub, pay) => sub + parseNumero(pay.monto, 0), 0);
    return acc + (sumaPagos > 0 ? sumaPagos : 0);
  }, 0);

  const clientesFiltrados = clientes.filter(c => c.nombre && c.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const telasFiltradas = telas.filter(t => {
    const texto = busquedaTelas.toLowerCase();
    return (
      (t.nombre && t.nombre.toLowerCase().includes(texto)) ||
      (t.descripcion && t.descripcion.toLowerCase().includes(texto)) ||
      (t.uso && t.uso.toLowerCase().includes(texto)) ||
      (t.precio && String(t.precio).includes(texto))
    );
  });

  const aviosFiltrados = avios.filter(a => {
    const texto = busquedaAvios.toLowerCase();
    return (
      (a.nombre && a.nombre.toLowerCase().includes(texto)) ||
      (a.tipo && a.tipo.toLowerCase().includes(texto)) ||
      (a.precio && String(a.precio).includes(texto))
    );
  });

  const gananciasPorMes = pedidos.reduce((acc, p) => {
    const precio = parseNumero(p.precio, 0);
    if (precio <= 0) return acc;
    const mesAnio = p.entrega ? p.entrega.slice(0, 7) : new Date(p.createdAt || Date.now()).toISOString().slice(0, 7);
    const gastos = parseNumero(p.gastos, 0);
    const gananciaPedido = precio - gastos;
    
    if (!acc[mesAnio]) {
      acc[mesAnio] = { ingresos: 0, ganancia: 0, cantidad: 0, pedidos: [] };
    }
    acc[mesAnio].ingresos += precio;
    acc[mesAnio].ganancia += gananciaPedido;
    acc[mesAnio].cantidad += 1;
    acc[mesAnio].pedidos.push({ ...p, precio, gastos, gananciaPedido });
    return acc;
  }, {});

  const saldoPendienteModalPago = (() => {
    if (!modalPago.isOpen || !modalPago.pedidoId) return 0;
    const p = pedidos.find(item => item.id === modalPago.pedidoId);
    if (!p) return 0;
    const precioTotal = parseNumero(p.precio, 0);
    const totalAbonado = (p.pagos || []).reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
    return Math.max(0, precioTotal - totalAbonado);
  })();

  const iniciarBorradoCliente = (cliente) => {
    const nombreCliente = cliente.nombre ? cliente.nombre.toLowerCase() : '';
    const pedidosCliente = pedidos.filter(p => (p.clienteId && p.clienteId === cliente.id) || (p.cliente && p.cliente.toLowerCase() === nombreCliente));
    const pedidosActivos = pedidosCliente.filter(p => p.estado !== 'Entregado con éxito' && p.estado !== 'Rechazado');

    let advertencia = `¿Estás segura de que deseas eliminar al cliente "${cliente.nombre}"?`;
    if (pedidosActivos.length > 0) {
      advertencia = `⚠️ Atención: Este cliente tiene ${pedidosActivos.length} pedido(s) en curso (en taller / confección / pendientes). Al eliminarlo se borrarán también todos sus pedidos e historiales asociados. ¿Deseas continuar?`;
    } else if (pedidosCliente.length > 0) {
      advertencia = `Este cliente tiene ${pedidosCliente.length} pedido(s) archivados/entregados. Al eliminarlo se borrarán también dichos pedidos. ¿Deseas continuar?`;
    }

    setModalConfirm({
      isOpen: true,
      text: advertencia,
      action: () => borrarCliente(cliente.id)
    });
  };

  const iniciarBorradoTela = (tela) => {
    const pedidosConEstaTela = pedidos.filter(p => p.tela && p.tela.toLowerCase() === (tela.nombre || '').toLowerCase() && p.estado !== 'Entregado con éxito' && p.estado !== 'Rechazado');
    let advertencia = `¿Estás segura de que quieres eliminar la tela "${tela.nombre}" del catálogo?`;
    if (pedidosConEstaTela.length > 0) {
      advertencia = `⚠️ La tela "${tela.nombre}" está asignada a ${pedidosConEstaTela.length} pedido(s) activo(s). Los pedidos conservarán el nombre de la tela como texto histórico. ¿Deseas eliminarla del catálogo?`;
    }

    setModalConfirm({
      isOpen: true,
      text: advertencia,
      action: () => borrarTela(tela.id)
    });
  };

  const iniciarBorradoPedidoDefinitivo = (pedidoOrId) => {
    const pedido = typeof pedidoOrId === 'object' && pedidoOrId !== null
      ? pedidoOrId 
      : pedidos.find(p => p.id === pedidoOrId);

    if (!pedido) {
      if (typeof pedidoOrId === 'string') borrarPedidoDefinitivo(pedidoOrId);
      return;
    }

    const pagos = pedido.pagos || [];
    const totalAbonado = pagos.reduce((acc, curr) => acc + parseNumero(curr.monto, 0), 0);
    let advertencia = `¿Estás segura de eliminar definitivamente el pedido "${pedido.prenda || 'Sin prenda'}" (${pedido.id})?`;
    if (totalAbonado > 0) {
      advertencia = `⚠️ Este pedido tiene ${formatearMoneda(totalAbonado)} abonados en pagos registrados. Al eliminarlo definitivamente se borrará de todo el sistema y del historial contable. ¿Deseas continuar?`;
    }

    setModalConfirm({
      isOpen: true,
      text: advertencia,
      action: () => borrarPedidoDefinitivo(pedido.id)
    });
  };

  if (authLoading || loadingRol) {
    return <div className="min-h-screen bg-stone-950 flex justify-center items-center text-stone-400">Cargando aplicación...</div>;
  }

  if (!user) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-stone-950 flex justify-center items-center text-stone-400">Cargando...</div>}>
        <LoginView 
          isLoginView={isLoginView}
          setIsLoginView={setIsLoginView}
          loginUser={loginUser}
          setLoginUser={setLoginUser}
          loginPass={loginPass}
          setLoginPass={setLoginPass}
          error={error}
          handleEmailAuth={handleEmailAuth}
          handleGoogleLogin={handleGoogleLogin}
          handleKeyDownEnter={handleKeyDownEnter}
        />
      </Suspense>
    );
  }

  return (
    <div translate="no" className="notranslate min-h-screen bg-stone-950 text-white p-4 md:p-8 font-sans selection:bg-white selection:text-stone-950">
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')] bg-cover bg-center" />

      <Toast message={toastMessage} />
      <LoadingOverlay isSaving={isSaving} />

      {fotosPendientesCount > 0 && (
        <div className="relative z-20 max-w-6xl mx-auto mb-4 bg-amber-950/70 border border-amber-800/80 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-200 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span>📷</span>
            <span>Tienes <strong>{fotosPendientesCount}</strong> foto(s) guardada(s) localmente en cola. Se subirán automáticamente al recuperar conexión.</span>
          </div>
          {navigator.onLine && (
            <button 
              onClick={async () => {
                mostrarToast("Sincronizando fotos pendientes...");
                const total = await sincronizarFotosManualmente();
                if (total > 0) mostrarToast(`¡${total} foto(s) sincronizada(s) con éxito!`);
              }}
              className="bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-xl hover:bg-amber-300 transition-colors whitespace-nowrap ml-2"
            >
              Subir ahora
            </button>
          )}
        </div>
      )}

      <Navbar 
        esAdmin={esAdmin}
        vista={vista}
        cambiarVista={cambiarVista}
        totalPedidosActivos={totalPedidosActivos}
        ingresosDelMes={ingresosDelMes}
        solicitudesPendientesAdmin={solicitudesPendientesAdmin}
        handleLogout={handleLogout}
      />

      <main className="relative z-10 max-w-6xl mx-auto">
        <Suspense fallback={<ViewLoadingFallback />}>
          {vista === 'dashboard' && (
            <DashboardView 
              esAdmin={esAdmin}
              totalPedidosActivos={totalPedidosActivos}
              ingresosDelMes={ingresosDelMes}
              solicitudesPendientesAdmin={solicitudesPendientesAdmin}
              cambiarVista={cambiarVista}
              busquedaDashboard={busquedaDashboard}
              setBusquedaDashboard={setBusquedaDashboard}
              pedidosVisibles={pedidosVisibles}
              setPedidoSeleccionado={setPedidoSeleccionado}
              setModalConfirm={setModalConfirm}
              ocultarPedidoDashboard={ocultarPedidoDashboard}
              restaurarPedidoDashboard={restaurarPedidoDashboard}
              borrarPedidoDefinitivo={borrarPedidoDefinitivo} // <--- SOLUCIÓN
              actualizarEstado={actualizarEstado}
              setFotoAmpliada={setFotoAmpliada}
              setModalPago={setModalPago}
              setModalAlias={setModalAlias}
              clientes={clientes}
            />
          )}

          {esAdmin && vista === 'solicitudes' && (
            <SolicitudesView 
              solicitudesPendientesAdmin={solicitudesPendientesAdmin}
              setModalRechazo={setModalRechazo}
              aceptarSolicitud={aceptarSolicitud}
            />
          )}

          {vista === 'detalle-pedido' && (
            <DetallePedidoView 
              pedidoSeleccionado={pedidoSeleccionado}
              setPedidoSeleccionado={setPedidoSeleccionado}
              esAdmin={esAdmin}
              telas={telas}
              clientes={clientes}
              cambiarVista={cambiarVista}
              mostrarToast={mostrarToast}
              setModalPago={setModalPago}
              setModalAlias={setModalAlias}
              setModalConfirm={setModalConfirm}
              setFotoAmpliada={setFotoAmpliada}
              eliminarPagoParcial={eliminarPagoParcial}
              handleKeyDownEnter={handleKeyDownEnter}
              setIsSaving={setIsSaving}
              subirOEncolarFoto={subirOEncolarFoto}
              borrarPedidoDefinitivo={borrarPedidoDefinitivo}
              ocultarPedidoDashboard={ocultarPedidoDashboard}
            />
          )}

          {vista === 'nuevo-pedido' && (
            <NuevoPedidoView 
              crearPedido={crearPedido}
              handleKeyDownEnter={handleKeyDownEnter}
              esAdmin={esAdmin}
              clientes={clientes}
              user={user}
              clienteActual={clienteActual}
              telas={telas}
              cambiarVista={cambiarVista}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'nuevo-cliente' && (
            <NuevoClienteView 
              formRef={formRef}
              setFormDirty={setFormDirtyState}
              guardarCliente={guardarCliente}
              handleKeyDownEnter={handleKeyDownEnter}
              cambiarVista={cambiarVista}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'editar-cliente' && (
            <EditarClienteView 
              clienteSeleccionado={clienteSeleccionado}
              formRef={formRef}
              setFormDirty={setFormDirtyState}
              actualizarCliente={actualizarCliente}
              handleKeyDownEnter={handleKeyDownEnter}
              cambiarVista={cambiarVista}
            />
          )}

          {esAdmin && vista === 'nueva-tela' && (
            <NuevaTelaView 
              guardarTela={guardarTela}
              handleKeyDownEnter={handleKeyDownEnter}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'nuevo-avio' && (
            <NuevoAvioView 
              guardarAvio={guardarAvio}
              handleKeyDownEnter={handleKeyDownEnter}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'editar-tela' && (
            <EditarTelaView 
              telaSeleccionada={telaSeleccionada}
              actualizarTelaEditada={actualizarTelaEditada}
              handleKeyDownEnter={handleKeyDownEnter}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'editar-avio' && (
            <EditarAvioView 
              avioSeleccionado={avioSeleccionado}
              actualizarAvioEditado={actualizarAvioEditado}
              handleKeyDownEnter={handleKeyDownEnter}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'catalogo' && (
            <CatalogoTelasView 
              telasFiltradas={telasFiltradas}
              busquedaTelas={busquedaTelas}
              setBusquedaTelas={setBusquedaTelas}
              setTelaSeleccionada={setTelaSeleccionada}
              cambiarVista={cambiarVista}
              setModalConfirm={setModalConfirm}
              borrarTela={iniciarBorradoTela}
              actualizarStock={actualizarStock}
            />
          )}

          {esAdmin && vista === 'catalogo-avios' && (
            <CatalogoAviosView 
              aviosFiltrados={aviosFiltrados}
              busquedaAvios={busquedaAvios}
              setBusquedaAvios={setBusquedaAvios}
              setAvioSeleccionado={setAvioSeleccionado}
              cambiarVista={cambiarVista}
              setModalConfirm={setModalConfirm}
              borrarAvio={borrarAvio}
              actualizarCantidadAvio={actualizarCantidadAvio}
              actualizarPrecioAvio={actualizarPrecioAvio}
            />
          )}

          {esAdmin && vista === 'detalle-tela' && (
            <DetalleTelaView 
              telaSeleccionada={telaSeleccionada}
              cambiarVista={cambiarVista}
            />
          )}

          {esAdmin && vista === 'detalle-avio' && (
            <DetalleAvioView 
              avioSeleccionado={avioSeleccionado}
              cambiarVista={cambiarVista}
            />
          )}

          {esAdmin && vista === 'clientes' && (
            <ClientesView 
              clientesFiltrados={clientesFiltrados}
              setBusqueda={setBusqueda}
              setClienteSeleccionado={setClienteSeleccionado}
              cambiarVista={cambiarVista}
              setModalConfirm={setModalConfirm}
              borrarCliente={iniciarBorradoCliente}
            />
          )}

          {esAdmin && vista === 'detalle-cliente' && (
            <DetalleClienteView 
              clienteSeleccionado={clienteSeleccionado}
              cambiarVista={cambiarVista}
              setModalConfirm={setModalConfirm}
              borrarCliente={iniciarBorradoCliente}
              pedidos={pedidos}
              borrarPedidoDefinitivo={borrarPedidoDefinitivo}
              restaurarPedidoDashboard={restaurarPedidoDashboard}
              ocultarPedidoDashboard={ocultarPedidoDashboard}
              setFotoAmpliada={setFotoAmpliada}
              setIsSaving={setIsSaving}
              mostrarToast={mostrarToast}
              handleKeyDownEnter={handleKeyDownEnter}
              subirOEncolarFoto={subirOEncolarFoto}
            />
          )}

          {esAdmin && vista === 'calculadora' && (
            <CalculadoraView 
              calc={calc}
              setCalc={setCalc}
              telas={telas}
              precioFinal={precioFinal}
              materiales={materiales}
              manoObra={manoObra}
              costoTotal={costoTotal}
              gananciaNeta={gananciaNeta}
              pedidosParaCalculadora={pedidosParaCalculadora}
              asignarPrecioAPedido={asignarPrecioAPedido}
              handleKeyDownEnter={handleKeyDownEnter}
            />
          )}

          {esAdmin && vista === 'ganancias' && (
            <GananciasView 
              exportarReportePDF={exportarReportePDF}
              gananciasPorMes={gananciasPorMes}
              setPedidoSeleccionado={setPedidoSeleccionado}
              cambiarVista={cambiarVista}
            />
          )}

          {esAdmin && vista === 'molderia' && (
            <MolderiaView 
              clientes={clientes}
              clienteInicial={clienteSeleccionado}
              cambiarVista={cambiarVista}
              setClienteSeleccionado={setClienteSeleccionado}
              mostrarToast={mostrarToast}
            />
          )}
        </Suspense>
      </main>

      <FloatingMenu 
        esAdmin={esAdmin}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        cambiarVista={cambiarVista}
      />

      <ModalAlias 
        modalAlias={modalAlias}
        setModalAlias={setModalAlias}
        mostrarToast={mostrarToast}
      />

      <ModalPago 
        modalPago={modalPago}
        setModalPago={setModalPago}
        montoPagoInput={montoPagoInput}
        setMontoPagoInput={setMontoPagoInput}
        metodoPagoInput={metodoPagoInput}
        setMetodoPagoInput={setMetodoPagoInput}
        registrarPagoParcial={registrarPagoParcial}
        saldoPendiente={saldoPendienteModalPago}
      />

      <ModalRechazo 
        modalRechazo={modalRechazo}
        setModalRechazo={setModalRechazo}
        confirmarRechazoAdmin={confirmarRechazoAdmin}
      />

      <ModalFotoAmpliada 
        fotoAmpliada={fotoAmpliada}
        setFotoAmpliada={setFotoAmpliada}
      />

      <ModalConfirm 
        modalConfirm={modalConfirm}
        setModalConfirm={setModalConfirm}
      />
    </div>
  ); 
}
