# Atelier Kamurina

Aplicacion web para gestionar un atelier de indumentaria desde un solo lugar.

Atelier Kamurina centraliza clientes, medidas, pedidos, telas, avios, pagos y ganancias, con una experiencia pensada para el trabajo diario del taller.

## Que incluye

- **Panel de pedidos:** seguimiento del estado, entregas, pagos y fotos.
- **Clientes y medidas:** fichas personales e historial de pedidos.
- **Catalogos:** telas y avios con stock, precios e imagenes.
- **Calculadora:** costos de materiales, mano de obra, margen y precio final.
- **Ganancias:** resumen mensual y exportacion para imprimir.
- **Acceso por roles:** vistas y permisos diferenciados para administradores y clientes.
- **Modo offline:** datos de Firestore persistidos localmente y sincronizados al recuperar conexion.
- **Fotos pendientes:** las imagenes pueden quedar en cola local y subirse automaticamente al volver Internet.

## Stack

`React` · `Vite` · `Tailwind CSS` · `Firebase Auth` · `Cloud Firestore` · `Cloudinary`

## Puesta en marcha

Requisitos: Node.js 18 o superior.

```bash
npm install
```

Copiar `.env.example` como `.env` y completar las credenciales de Firebase y Cloudinary.

```bash
npm run dev
```

La aplicacion quedara disponible en la URL local que indique Vite.

## Comandos

```bash
npm run dev       # Desarrollo con recarga automatica
npm run build     # Build de produccion
npm run preview   # Vista previa del build
npm run lint      # Revision estatica del codigo
```

## Seguridad

Las reglas de Firestore se encuentran en [`firestore.rules`](firestore.rules). Antes de publicar, aplicarlas en el proyecto de Firebase y verificar que el primer usuario administrador tenga su documento en `usuarios_roles` con `rol: "admin"`.

Las variables de entorno no deben subirse al repositorio. Usar `.env.example` como referencia.

## Offline, en la practica

La app necesita una primera visita con conexion para descargar sus recursos y una primera autenticacion. Luego puede abrirse sin Wi-Fi con los datos previamente sincronizados. Las operaciones pendientes se envian cuando vuelve Internet.

La subida definitiva a Cloudinary requiere conexion, aunque la foto queda guardada localmente hasta poder sincronizarla.

## Estructura principal

```text
src/
  components/   Interfaz compartida y modales
  constants/    Configuracion y medidas
  services/     Firebase, Cloudinary y cola offline
  utils/        Helpers y compresion de imagenes
  views/        Pantallas de la aplicacion
public/         Manifest y service worker
```

## Release actual

Version estable: `v1.4.0`
