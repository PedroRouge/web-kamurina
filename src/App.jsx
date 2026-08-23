import React, { useState, useEffect, useRef, Suspense } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

import { db, auth, googleProvider } from './services/firebase';
import { subirACloudinary } from './services/cloudinary';
import { MEDIDAS_LISTA } from './constants/medidas';
import { handleKeyDownEnter, generarIdPedido } from './utils/helpers';

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

  const formRef = useRef(null);
  const [formDirty, setFormDirty] = useState(false);

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

  const mostrarToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoadingRol(true);
        try {
          const docRef = doc(db, "usuarios_roles", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().rol === 'admin') {
            setEsAdmin(true);
          } else {
            setEsAdmin(false);
          }
        } catch (err) {
          console.error("Error consultando rol:", err);
          setEsAdmin(false);
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

      if ((vista === 'nuevo-cliente' || vista === 'editar-cliente') && formDirty) {
        window.history.pushState({ vista }, ''); 
        setModalConfirm({
          isOpen: true,
          text: "⚠️ Tienes información sin guardar. ¿Qué deseas hacer?",
          buttons: [
            { text: "Salir sin guardar", action: () => { setFormDirty(false); window.history.pushState({ vista: targetVista }, ''); setVista(targetVista); }, style: "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40" },
            { text: "Guardar ahora", action: () => { if(formRef.current) formRef.current.requestSubmit(); }, style: "bg-white text-stone-950 hover:bg-stone-200" }
          ]
        });
        return;
      }

      if (event.state && event.state.vista) {
        setVista(event.state.vista);
      } else {
        setVista('dashboard');
      }
      setFormDirty(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, fotoAmpliada, modalConfirm.isOpen, modalRechazo.isOpen, modalPago.isOpen, modalAlias.isOpen, menuAbierto, vista, formDirty]);

  const cambiarVista = (nuevaVista) => {
    if ((vista === 'nuevo-cliente' || vista === 'editar-cliente') && formDirty) {
      setModalConfirm({
        isOpen: true,
        text: "⚠️ Tienes información sin guardar. ¿Qué deseas hacer?",
        buttons: [
          { text: "Salir sin guardar", action: () => { setFormDirty(false); window.history.pushState({ vista: nuevaVista }, ''); setVista(nuevaVista); setMenuAbierto(false); }, style: "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/40" },
          { text: "Guardar ahora", action: () => { if(formRef.current) formRef.current.requestSubmit(); }, style: "bg-white text-stone-950 hover:bg-stone-200" }
        ]
      });
      return;
    }

    window.history.pushState({ vista: nuevaVista }, '');
    setVista(nuevaVista);
    setMenuAbierto(false);
    setFormDirty(false);
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
      }, (err) => console.error("Error leyendo clientes:", err));

      unsubPedidos = onSnapshot(collection(db, "pedidos"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPedidos(list);
      }, (err) => console.error("Error leyendo pedidos:", err));

      unsubTelas = onSnapshot(collection(db, "telas"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTelas(list);
      }, (err) => console.error("Error leyendo telas:", err));

      unsubAvios = onSnapshot(collection(db, "avios"), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAvios(list);
      }, (err) => console.error("Error leyendo avios:", err));
    } else {
      const userIdentifier = user.displayName || user.email;
      if (userIdentifier) {
        const qPedidos = query(collection(db, "pedidos"), where("cliente", "==", userIdentifier));
        unsubPedidos = onSnapshot(qPedidos, (snapshot) => {
          const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setPedidos(list);
        }, (err) => console.error("Error leyendo pedidos del cliente:", err));

        const qClientes = query(collection(db, "clientes"), where("nombre", "==", userIdentifier));
        unsubClientes = onSnapshot(qClientes, (snapshot) => {
          const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setClientes(list);
        }, (err) => console.error("Error leyendo ficha del cliente:", err));
      }
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

  const metrosCalculados = calc.cm / 100;
  const materiales = (metrosCalculados * calc.costoMetro) + calc.avios;
  const manoObra = calc.horas * calc.valorHora;
  const costoTotal = materiales + manoObra;
  const calculoNormal = costoTotal * (1 + calc.margen / 100);
  const precioFinal = calc.precioPersonalizado > 0 ? calc.precioPersonalizado : calculoNormal;
  const gananciaNeta = manoObra + (precioFinal - costoTotal);

  const borrarCliente = async (id) => {
    try {
      const clienteABorrar = clientes.find(c => c.id === id);
      if (clienteABorrar) {
        const pedidosDelCliente = pedidos.filter(p => (p.clienteId && p.clienteId === id) || (p.cliente && p.cliente.toLowerCase() === clienteABorrar.nombre.toLowerCase()));
        const promesasDeBorrado = pedidosDelCliente.map(p => deleteDoc(doc(db, "pedidos", String(p.id))));
        await Promise.all(promesasDeBorrado);
      }
      await deleteDoc(doc(db, "clientes", String(id)));
      if (clienteSeleccionado?.id === id) cambiarVista('clientes');
      mostrarToast("Cliente eliminado con éxito");
    } catch (err) {
      mostrarToast("Error al eliminar cliente");
    }
  };
  
  const borrarTela = async (id) => {
    try {
      await deleteDoc(doc(db, "telas", String(id)));
      if (telaSeleccionada?.id === id) cambiarVista('catalogo');
      mostrarToast("Tela eliminada con éxito");
    } catch (err) {
      mostrarToast("Error al eliminar tela");
    }
  };

  const borrarAvio = async (id) => {
    try {
      await deleteDoc(doc(db, "avios", String(id)));
      if (avioSeleccionado?.id === id) cambiarVista('catalogo-avios');
      mostrarToast("Avío eliminado con éxito");
    } catch (err) {
      mostrarToast("Error al eliminar avío");
    }
  };

  const actualizarStock = async (id, nuevoStock) => {
    try {
      const tela = telas.find(t => t.id === id);
      if (tela) {
        await setDoc(doc(db, "telas", String(id)), { ...tela, stock: nuevoStock }, { merge: true });
      }
    } catch (err) {
      console.error("Error stock:", err);
    }
  };

  const actualizarCantidadAvio = async (id, nuevaCantidad) => {
    try {
      const avio = avios.find(a => a.id === id);
      if (avio) {
        await setDoc(doc(db, "avios", String(id)), { ...avio, cantidad: nuevaCantidad }, { merge: true });
      }
    } catch (err) {
      console.error("Error cantidad avio:", err);
    }
  };

  const actualizarPrecioAvio = async (id, nuevoPrecio) => {
    try {
      const avio = avios.find(a => a.id === id);
      if (avio) {
        await setDoc(doc(db, "avios", String(id)), { ...avio, precio: Number(nuevoPrecio) || 0 }, { merge: true });
      }
    } catch (err) {
      console.error("Error precio avio:", err);
    }
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    const fd = new FormData(e.target);
    const telefono = fd.get('telefono').trim();
    if (!/^\d{6,15}$/.test(telefono)) {
      mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
      return;
    }
    
    setFormDirty(false);
    setIsSaving(true);
    
    try {
      const medidas = {};
      MEDIDAS_LISTA.forEach(m => medidas[m] = fd.get(m));
      const id = crypto.randomUUID();
      const nuevo = { id, nombre: fd.get('nombre'), telefono, medidas };
      await setDoc(doc(db, "clientes", String(id)), nuevo);
      
      mostrarToast("Cliente guardado con éxito");
      cambiarVista('clientes');
    } catch (err) {
      mostrarToast("Error al guardar cliente");
    } finally {
      setIsSaving(false);
    }
  };

  const actualizarCliente = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const telefono = fd.get('telefono').trim();
    if (!/^\d{6,15}$/.test(telefono)) {
      mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
      return;
    }
    
    setFormDirty(false);

    try {
      const medidas = {};
      MEDIDAS_LISTA.forEach(m => medidas[m] = fd.get(m));
      const actualizado = { ...clienteSeleccionado, nombre: fd.get('nombre'), telefono, medidas };
      await setDoc(doc(db, "clientes", String(clienteSeleccionado.id)), actualizado);
      setClienteSeleccionado(actualizado);
      
      mostrarToast("Cliente actualizado con éxito");
      cambiarVista('detalle-cliente');
    } catch (err) {
      mostrarToast("Error al actualizar cliente");
    }
  };

  const guardarTela = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    const fd = new FormData(e.target);
    const precio = Number(fd.get('precio'));
    if (precio < 0) {
      mostrarToast("⚠️ El precio no puede ser negativo");
      setIsSaving(false);
      return;
    }
    try {
      const archivoFoto = fd.get('fotoArchivo');
      let urlFoto = "";
      if (archivoFoto && archivoFoto.size > 0) {
        urlFoto = await subirACloudinary(archivoFoto);
      }

      const id = crypto.randomUUID();
      const nueva = { 
        id, 
        nombre: fd.get('nombre'), 
        descripcion: fd.get('desc'), 
        uso: fd.get('uso'), 
        stock: fd.get('stock'), 
        precio: precio || 0,
        foto: urlFoto 
      };
      await setDoc(doc(db, "telas", String(id)), nueva);
      mostrarToast("Tela guardada con éxito");
      cambiarVista('catalogo');
    } catch (err) {
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
    const precio = Number(fd.get('precio'));
    if (precio < 0) {
      mostrarToast("⚠️ El precio no puede ser negativo");
      setIsSaving(false);
      return;
    }
    try {
      const archivoFoto = fd.get('fotoArchivo');
      let urlFoto = telaSeleccionada.foto;
      if (archivoFoto && archivoFoto.size > 0) {
        urlFoto = await subirACloudinary(archivoFoto);
      }

      const actualizada = { 
        ...telaSeleccionada, 
        nombre: fd.get('nombre'), 
        descripcion: fd.get('desc'), 
        uso: fd.get('uso'), 
        stock: fd.get('stock'), 
        precio: precio || 0,
        foto: urlFoto 
      };
      await setDoc(doc(db, "telas", String(telaSeleccionada.id)), actualizada);
      setTelaSeleccionada(actualizada);
      mostrarToast("Tela actualizada con éxito");
      cambiarVista('detalle-tela');
    } catch (err) {
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
    const precio = Number(fd.get('precio'));
    if (precio < 0) {
      mostrarToast("⚠️ El precio no puede ser negativo");
      setIsSaving(false);
      return;
    }
    try {
      const archivoFoto = fd.get('fotoArchivo');
      let urlFoto = "";
      if (archivoFoto && archivoFoto.size > 0) {
        urlFoto = await subirACloudinary(archivoFoto);
      }

      const id = crypto.randomUUID();
      const nuevo = { 
        id, 
        nombre: fd.get('nombre'), 
        tipo: fd.get('tipo'), 
        centimetros: fd.get('centimetros'), 
        cantidad: fd.get('cantidad'), 
        precio: precio || 0,
        foto: urlFoto 
      };
      await setDoc(doc(db, "avios", String(id)), nuevo);
      mostrarToast("Avío guardado con éxito");
      cambiarVista('catalogo-avios');
    } catch (err) {
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
    const precio = Number(fd.get('precio'));
    if (precio < 0) {
      mostrarToast("⚠️ El precio no puede ser negativo");
      setIsSaving(false);
      return;
    }
    try {
      const archivoFoto = fd.get('fotoArchivo');
      let urlFoto = avioSeleccionado.foto;
      if (archivoFoto && archivoFoto.size > 0) {
        urlFoto = await subirACloudinary(archivoFoto);
      }

      const actualizado = { 
        ...avioSeleccionado, 
        nombre: fd.get('nombre'), 
        tipo: fd.get('tipo'), 
        centimetros: fd.get('centimetros'), 
        cantidad: fd.get('cantidad'), 
        precio: precio || 0,
        foto: urlFoto 
      };
      await setDoc(doc(db, "avios", String(avioSeleccionado.id)), actualizado);
      setAvioSeleccionado(actualizado);
      mostrarToast("Avío actualizado con éxito");
      cambiarVista('detalle-avio');
    } catch (err) {
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
      const telefonoCliente = esAdmin ? '' : (fd.get('telefono') || '').trim();
      if (!esAdmin && !/^\d{6,15}$/.test(telefonoCliente)) {
        mostrarToast("⚠️ El teléfono debe contener solo números (6 a 15 dígitos)");
        setIsSaving(false);
        return;
      }

      const archivoFoto = fd.get('fotoArchivo');
      let urlFoto = "";
      if (archivoFoto && archivoFoto.size > 0) {
        urlFoto = await subirACloudinary(archivoFoto);
      }

      const timestamp = Date.now();
      const id = generarIdPedido(pedidos, esAdmin);

      let clienteId = '';
      let nombreCliente = '';

      if (esAdmin) {
        clienteId = fd.get('clienteId');
        const clienteObj = clientes.find(c => c.id === clienteId);
        nombreCliente = clienteObj ? clienteObj.nombre : (fd.get('clienteNombre') || '');
      } else {
        clienteId = user?.uid || '';
        nombreCliente = user?.displayName || user?.email || 'Cliente';
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
        const nombreBuscado = nombreCliente.toLowerCase();
        const telefonoBuscado = telefonoCliente.trim();

        const clienteEncontrado = clientes.find(c => {
          const coincideId = c.id === clienteId;
          const coincideNombre = c.nombre && c.nombre.toLowerCase() === nombreBuscado;
          const coincideTelefono = telefonoBuscado && c.telefono && c.telefono.trim() === telefonoBuscado;
          return coincideId || coincideNombre || coincideTelefono;
        });

        if (!clienteEncontrado) {
          const nuevoClienteId = clienteId || crypto.randomUUID();
          const medidasVacias = {};
          MEDIDAS_LISTA.forEach(m => medidasVacias[m] = '');
          const fichaCliente = {
            id: nuevoClienteId,
            nombre: nombreCliente,
            telefono: telefonoBuscado,
            medidas: medidasVacias
          };
          await setDoc(doc(db, "clientes", String(nuevoClienteId)), fichaCliente);
        } else if (!clienteEncontrado.telefono && telefonoBuscado) {
          const clienteActualizado = {
            ...clienteEncontrado,
            telefono: telefonoBuscado
          };
          await setDoc(doc(db, "clientes", String(clienteEncontrado.id)), clienteActualizado);
        }
      }

      cambiarVista('dashboard');
    } catch (err) {
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
          precio: precioFinal,
          materialesCosto: materiales,
          manoObraCosto: manoObra,
          gastos: materiales
        };
        await setDoc(doc(db, "pedidos", String(pedidoId)), actualizado, { merge: true });
        mostrarToast("Precio asignado correctamente");
      }
      cambiarVista('dashboard');
    } catch (err) {
      mostrarToast("Error al asignar precio");
    }
  };

  const ocultarPedidoDashboard = async (id) => {
    try {
      const pedido = pedidos.find(p => p.id === id);
      if (pedido) {
        await setDoc(doc(db, "pedidos", String(id)), { ...pedido, ocultoDashboard: true }, { merge: true });
        mostrarToast("Pedido removido del dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const borrarPedidoDefinitivo = async (id) => {
    try {
      await deleteDoc(doc(db, "pedidos", String(id)));
      if (pedidoSeleccionado?.id === id) {
        setPedidoSeleccionado(null);
      }
      cambiarVista('dashboard');
      mostrarToast("Pedido eliminado definitivamente");
    } catch (err) {
      mostrarToast("Error al borrar pedido");
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
      console.error(err);
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
      console.error(err);
    }
  };

  const registrarPagoParcial = async () => {
    if (!modalPago.pedidoId) return;
    const monto = Number(montoPagoInput);
    if (!monto || monto <= 0) {
      mostrarToast("⚠️ Ingresa un monto válido mayor a 0");
      return;
    }

    const pedido = pedidos.find(p => p.id === modalPago.pedidoId);
    if (!pedido) return;

    const pagosActuales = pedido.pagos || [];
    const totalAbonadoPrevio = pagosActuales.reduce((acc, curr) => acc + curr.monto, 0);
    const precioTotal = pedido.precio || 0;
    const saldoPendiente = Math.max(0, precioTotal - totalAbonadoPrevio);

    if (monto > saldoPendiente) {
      mostrarToast(`⚠️ El monto excede el saldo pendiente ($${saldoPendiente.toLocaleString()})`);
      return;
    }

    try {
      const nuevoPago = {
        id: crypto.randomUUID(),
        monto,
        metodo: metodoPagoInput,
        fecha: new Date().toLocaleDateString()
      };
      const listaActualizada = [...pagosActuales, nuevoPago];
      const totalAbonado = listaActualizada.reduce((acc, curr) => acc + curr.monto, 0);
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
      mostrarToast("Error al registrar pago");
    }
  };

  const eliminarPagoParcial = async (pagoId) => {
    if (!pedidoSeleccionado) return;
    try {
      const pagosActuales = pedidoSeleccionado.pagos || [];
      const listaActualizada = pagosActuales.filter(p => p.id !== pagoId);
      const totalAbonado = listaActualizada.reduce((acc, curr) => acc + curr.monto, 0);
      const estaPagado = pedidoSeleccionado.precio > 0 && totalAbonado >= pedidoSeleccionado.precio;

      const actualizado = {
        ...pedidoSeleccionado,
        pagos: listaActualizada,
        pagado: estaPagado
      };

      await setDoc(doc(db, "pedidos", String(pedidoSeleccionado.id)), actualizado, { merge: true });
      setPedidoSeleccionado(actualizado);
      mostrarToast("Pago eliminado");
    } catch (err) {
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
          motivoRechazo: modalRechazo.motivo,
          ocultoDashboard: true 
        }, { merge: true });
      }
      setModalRechazo({ isOpen: false, pedidoId: null, motivo: '' });
      mostrarToast("Pedido rechazado");
    } catch (err) {
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
    if (p.ocultoDashboard) return false;
    
    if (!esAdmin) {
      const nombreUsuario = user?.displayName || user?.email;
      const userUid = user?.uid;
      const coincideUsuario = (p.clienteId && p.clienteId === userUid) || (p.cliente === nombreUsuario);
      if (!coincideUsuario) return false;
    } else {
      if (p.estado === 'Pendiente de Aprobación' || p.estado === 'Rechazado') return false;
    }

    const coincideFiltro = filtroEstadoDashboard === 'TODOS' || p.estado === filtroEstadoDashboard;
    const textoBusqueda = busquedaDashboard.trim().toLowerCase();
    const coincideBusqueda = !textoBusqueda || 
      (p.cliente && p.cliente.toLowerCase().includes(textoBusqueda)) || 
      (p.prenda && p.prenda.toLowerCase().includes(textoBusqueda)) ||
      (p.id && p.id.toLowerCase().includes(textoBusqueda));
    return coincideFiltro && coincideBusqueda;
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
    if (p.ocultoDashboard || !p.precio || p.precio <= 0) return acc;
    const sumaPagos = (p.pagos || []).reduce((sub, pay) => sub + pay.monto, 0);
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
    if (p.precio <= 0) return acc;
    const mesAnio = p.entrega ? p.entrega.slice(0, 7) : new Date(p.createdAt || Date.now()).toISOString().slice(0, 7);
    const gastos = p.gastos || 0;
    const gananciaPedido = p.precio - gastos;
    
    if (!acc[mesAnio]) {
      acc[mesAnio] = { ingresos: 0, ganancia: 0, cantidad: 0, pedidos: [] };
    }
    acc[mesAnio].ingresos += p.precio;
    acc[mesAnio].ganancia += gananciaPedido;
    acc[mesAnio].cantidad += 1;
    acc[mesAnio].pedidos.push({ ...p, gananciaPedido });
    return acc;
  }, {});

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
              borrarPedidoDefinitivo={borrarPedidoDefinitivo}
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
            />
          )}

          {vista === 'nuevo-pedido' && (
            <NuevoPedidoView 
              crearPedido={crearPedido}
              handleKeyDownEnter={handleKeyDownEnter}
              esAdmin={esAdmin}
              clientes={clientes}
              user={user}
              telas={telas}
              cambiarVista={cambiarVista}
              isSaving={isSaving}
            />
          )}

          {esAdmin && vista === 'nuevo-cliente' && (
            <NuevoClienteView 
              formRef={formRef}
              setFormDirty={setFormDirty}
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
              setFormDirty={setFormDirty}
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
              borrarTela={borrarTela}
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
              borrarCliente={borrarCliente}
            />
          )}

          {esAdmin && vista === 'detalle-cliente' && (
            <DetalleClienteView 
              clienteSeleccionado={clienteSeleccionado}
              cambiarVista={cambiarVista}
              setModalConfirm={setModalConfirm}
              borrarCliente={borrarCliente}
              pedidos={pedidos}
              borrarPedidoDefinitivo={borrarPedidoDefinitivo}
              setFotoAmpliada={setFotoAmpliada}
              setIsSaving={setIsSaving}
              mostrarToast={mostrarToast}
              handleKeyDownEnter={handleKeyDownEnter}
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