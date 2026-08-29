/**
 * Catálogo Maestro de Moldería y Patrones Paramétricos
 * 40 patrones profesionales con graduación y trazado a medida
 */

export const CATALOGO_MOLDES = [
  // --- TOPS, REMERAS Y BLUSAS ---
  {
    id: 'aaron',
    nombre: 'Musculosa Básica / Remera sin Mangas',
    categoria: 'Tops, Remeras y Blusas',
    icono: '🎽',
    descripcion: 'Musculosa entallada clásica con ribetes de sisa y cuello.',
    genero: 'Unisex / Mujer / Hombre',
    piezas: ['Delantero (1x al doblez)', 'Espalda (1x al doblez)', 'Ribete Cuello (1x)', 'Ribete Sisa (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cuello', 'Ancho de Espalda', 'Largo de Talle']
  },
  {
    id: 'teagan',
    nombre: 'Remera Básica Clásica (T-Shirt)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👕',
    descripcion: 'Remera de manga corta con cuello redondo elástico.',
    genero: 'Unisex',
    piezas: ['Delantero (1x al doblez)', 'Espalda (1x al doblez)', 'Manga Corta (2x)', 'Ribete Cuello (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cuello', 'Ancho de Espalda', 'Largo de Talle', 'Contorno de Brazo']
  },
  {
    id: 'diana',
    nombre: 'Blusa Drapeada con Escote al Cuello',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👚',
    descripcion: 'Elegante blusa femenina con cuello drapeado en cascada.',
    genero: 'Mujer',
    piezas: ['Delantero Drapeado (1x)', 'Espalda (1x)', 'Banda de Cuello (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Largo de Talle', 'Altura de Busto']
  },
  {
    id: 'tamiko',
    nombre: 'Top Kimono Envolvente Geométrico',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👘',
    descripcion: 'Top de confección geométrica con cruce frontal estilo kimono.',
    genero: 'Mujer',
    piezas: ['Cuerpo Kimono (1x)', 'Cinturón Ajuste (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Largo de Talle']
  },
  {
    id: 'brian',
    nombre: 'Bloque Superior Base (Unisex / Hombre)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '📐',
    descripcion: 'Patrón base de cuerpo superior sin pinzas para transformaciones.',
    genero: 'Unisex',
    piezas: ['Delantero Base (1x)', 'Espalda Base (1x)', 'Manga Larga Base (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cuello', 'Ancho de Espalda', 'Largo de Talle']
  },
  {
    id: 'breanna',
    nombre: 'Bloque Superior con Pinzas (Mujer)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '📐',
    descripcion: 'Patrón base femenino con pinzas de busto y entalle.',
    genero: 'Mujer',
    piezas: ['Delantero con Pinzas (1x)', 'Espalda con Pinzas (1x)', 'Manga Base (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Separación de Busto', 'Altura de Busto', 'Largo de Talle']
  },
  {
    id: 'bella',
    nombre: 'Bloque Base de Vestido / Blusa Femenina',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👗',
    descripcion: 'Cuerpo base femenino con pinzas laterales y entalle anatómico.',
    genero: 'Mujer',
    piezas: ['Delantero Entallado (1x)', 'Espalda Entallada (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Contorno de Cadera', 'Altura de Busto']
  },

  // --- CAMISAS Y SASTRERÍA ---
  {
    id: 'simon',
    nombre: 'Camisa Clásica de Vestir (Hombre)',
    categoria: 'Camisas y Sastrería',
    icono: '👔',
    descripcion: 'Camisa formal con cuello camisero, cartera de botones y puños.',
    genero: 'Hombre / Unisex',
    piezas: ['Delantero con Cartera (2x)', 'Espalda con Tabla (1x)', 'Canesú (2x)', 'Manga con Abertura (2x)', 'Cuello (2x)', 'Pie de Cuello (2x)', 'Puños (4x)'],
    medidasRequeridas: ['Contorno de Cuello', 'Ancho de Pecho', 'Ancho de Espalda', 'Largo de Manga', 'Contorno de Muñeca']
  },
  {
    id: 'simone',
    nombre: 'Camisa Entallada de Vestir (Mujer)',
    categoria: 'Camisas y Sastrería',
    icono: '👚',
    descripcion: 'Camisa femenina con pinzas de busto y entalle en cintura.',
    genero: 'Mujer',
    piezas: ['Delantero Entallado (2x)', 'Espalda (1x)', 'Canesú (2x)', 'Cuello y Pie (4x)', 'Mangas y Puños (6x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Contorno de Cuello', 'Largo de Manga']
  },
  {
    id: 'wahid',
    nombre: 'Chaleco de Vestir / Sastrería',
    categoria: 'Camisas y Sastrería',
    icono: '🤵',
    descripcion: 'Chaleco formal con bolsillos ojal y martillo trasero regulable.',
    genero: 'Hombre / Unisex',
    piezas: ['Delantero Sastre (2x)', 'Espalda en Forrería (1x)', 'Bolsillo Ojal (2x)', 'Tiras de Ajuste (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Largo de Talle', 'Ancho de Espalda']
  },
  {
    id: 'jaeger',
    nombre: 'Blazer / Saco Sastre Femenino',
    categoria: 'Camisas y Sastrería',
    icono: '🧥',
    descripcion: 'Saco entallado de sastrería con solapa clásica y forrería.',
    genero: 'Mujer',
    piezas: ['Delantero con Solapa (2x)', 'Costadillo Delantero (2x)', 'Espalda (2x)', 'Costadillo Espalda (2x)', 'Cuello Solapa (2x)', 'Manga Sastre 2 Hojas (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Contorno de Cadera', 'Ancho de Espalda', 'Largo de Manga']
  },
  {
    id: 'bent',
    nombre: 'Bloque Base de Saco / Chaqueta',
    categoria: 'Camisas y Sastrería',
    icono: '📐',
    descripcion: 'Molde base para trajes, chaquetas y sacos estructurados.',
    genero: 'Unisex',
    piezas: ['Delantero Estructurado (2x)', 'Espalda Estructurada (2x)', 'Manga Sastre (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Ancho de Espalda', 'Largo de Manga', 'Contorno de Cintura']
  },
  {
    id: 'trayvon',
    nombre: 'Corbata Clásica de Seda',
    categoria: 'Camisas y Sastrería',
    icono: '👔',
    descripcion: 'Corbata tradicional de tres piezas con forro y alma.',
    genero: 'Unisex',
    piezas: ['Pala Delantera (1x)', 'Pala Trasera (1x)', 'Cuello Central (1x)', 'Puntera Forro (2x)'],
    medidasRequeridas: ['Contorno de Cuello']
  },

  // --- BUZOS, ABRIGOS Y CHAQUETAS ---
  {
    id: 'huey',
    nombre: 'Buzo Canguro con Capucha (Hoodie)',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    descripcion: 'Buzo urbano amplio con capucha forrada y bolsillo delantero.',
    genero: 'Unisex',
    piezas: ['Delantero (1x)', 'Espalda (1x)', 'Capucha (4x)', 'Bolsillo Canguro (1x)', 'Manga Larga (2x)', 'Puños y Cintura Rib (3x)'],
    medidasRequeridas: ['Contorno de Busto', 'Ancho de Espalda', 'Largo de Manga', 'Contorno de Cuello']
  },
  {
    id: 'hugo',
    nombre: 'Buzo Clásico Cuello Redondo',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧶',
    descripcion: 'Sweater / buzo clásico con cuello, puños y cintura de rib.',
    genero: 'Unisex',
    piezas: ['Delantero (1x)', 'Espalda (1x)', 'Manga (2x)', 'Rib Cuello/Puños/Cintura (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Ancho de Espalda', 'Largo de Manga']
  },
  {
    id: 'sven',
    nombre: 'Sweater / Buzo Escote en V',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧶',
    descripcion: 'Buzo casual con cuello en V limpio y mangas clásicas.',
    genero: 'Unisex',
    piezas: ['Delantero Escote V (1x)', 'Espalda (1x)', 'Manga (2x)', 'Ribete V (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Ancho de Espalda', 'Largo de Manga']
  },
  {
    id: 'yuri',
    nombre: 'Buzo Deportivo con Cierre y Capucha',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🏃',
    descripcion: 'Campera deportiva con cierre central y bolsillos laterales.',
    genero: 'Unisex',
    piezas: ['Delantero Abierto (2x)', 'Espalda (1x)', 'Capucha (4x)', 'Manga (2x)', 'Bolsillos (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Largo de Talle', 'Largo de Manga']
  },
  {
    id: 'carlton',
    nombre: 'Abrigo Largo de Invierno con Solapa',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    descripcion: 'Abrigo clásico masculino/unisex con cruce y solapa ancha.',
    genero: 'Unisex',
    piezas: ['Delantero Cruzado (2x)', 'Espalda (2x)', 'Cuello y Solapa (2x)', 'Manga Abrigo (4x)', 'Bolsillos Vivos (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cadera', 'Ancho de Espalda', 'Largo de Manga']
  },
  {
    id: 'carlita',
    nombre: 'Trench / Abrigo Entallado Femenino',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    descripcion: 'Trench coat femenino con cinturón de ajuste y solapas de lluvia.',
    genero: 'Mujer',
    piezas: ['Delantero Trench (2x)', 'Espalda con Vuelo (2x)', 'Capelinas (2x)', 'Cinturón (1x)', 'Manga (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Contorno de Cadera', 'Largo de Manga']
  },

  // --- PANTALONES, BERMUDAS Y SHORTS ---
  {
    id: 'charlie',
    nombre: 'Pantalón Chino / Vestir (Hombre)',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '👖',
    descripcion: 'Pantalón entallado con bolsillos franceses y pretina sastre.',
    genero: 'Hombre / Unisex',
    piezas: ['Delantero Pantalón (2x)', 'Trasero Pantalón (2x)', 'Fondo Bolsillo (4x)', 'Pretina (2x)', 'Pasacintos (1x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Pantalón', 'Altura de Tiro']
  },
  {
    id: 'titan',
    nombre: 'Bloque Base Pantalón Unisex',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '📐',
    descripcion: 'Molde base para cualquier desarrollo de pantalón a medida.',
    genero: 'Unisex',
    piezas: ['Delantero Base (2x)', 'Trasero Base (2x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Pantalón', 'Altura de Tiro']
  },
  {
    id: 'paco',
    nombre: 'Pantalón Jogger / Cargo Urbano',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '👖',
    descripcion: 'Pantalón deportivo con elástico en tobillos y cintura con cordón.',
    genero: 'Unisex',
    piezas: ['Delantero Jogger (2x)', 'Trasero Jogger (2x)', 'Bolsillos Cargo (2x)', 'Puños Tobillo (2x)', 'Pretina Elástica (1x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Pantalón']
  },
  {
    id: 'waralee',
    nombre: 'Pantalón Envolvente Tailandés (Wrap Pants)',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '🩳',
    descripcion: 'Pantalón envolvente ultra confortable de confección minimalista.',
    genero: 'Unisex',
    piezas: ['Pata Envolvente (2x)', 'Lazos de Amarre (2x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Pantalón']
  },
  {
    id: 'cornelius',
    nombre: 'Pantalón Clásico Bombacho / Ciclista',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '🚴',
    descripcion: 'Pantalón de época con ajuste bajo rodilla y refuerzo.',
    genero: 'Unisex',
    piezas: ['Delantero Bombacho (2x)', 'Trasero Bombacho (2x)', 'Ajustadores Rodilla (2x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Pantalón']
  },
  {
    id: 'bruce',
    nombre: 'Bóxer / Calzoncillo Anatómico',
    categoria: 'Pantalones, Bermudas y Shorts',
    icono: '🩲',
    descripcion: 'Bóxer elastizado con refuerzo central ergonómico.',
    genero: 'Hombre',
    piezas: ['Lateral Bóxer (2x)', 'Copas Frontales (2x)', 'Refuerzo Entrepierna (1x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera']
  },

  // --- FALDAS, VESTIDOS Y CORSETS ---
  {
    id: 'penelope',
    nombre: 'Falda Tubo / Lápiz Clásica',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '👗',
    descripcion: 'Falda entallada hasta la rodilla con tajo trasero y pinzas.',
    genero: 'Mujer',
    piezas: ['Delantero Tubo (1x al doblez)', 'Espalda con Tajo (2x)', 'Pretina Recta (1x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Altura de Cadera', 'Largo de Falda']
  },
  {
    id: 'sandy',
    nombre: 'Falda Evasé Acampanada',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '👗',
    descripcion: 'Falda fluida con vuelo evasé y caída en línea A.',
    genero: 'Mujer',
    piezas: ['Delantero Evasé (1x al doblez)', 'Espalda Evasé (2x)', 'Vista Cintura (2x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Falda']
  },
  {
    id: 'lucy',
    nombre: 'Falda Recta con Bolsillos Ocultos',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '👗',
    descripcion: 'Falda moderna con bolsillos en costura lateral.',
    genero: 'Mujer',
    piezas: ['Delantero (1x)', 'Espalda (2x)', 'Bolsillos Laterales (4x)'],
    medidasRequeridas: ['Contorno de Cintura', 'Contorno de Cadera', 'Largo de Falda']
  },
  {
    id: 'cathrin',
    nombre: 'Corset Sastre con Ballenas Tradicional',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '🩱',
    descripcion: 'Corset victoriano estructurado con múltiples paneles y canales de ballena.',
    genero: 'Mujer',
    piezas: ['Panel 1 Centro Delantero (2x)', 'Panel 2 Lateral Delantero (2x)', 'Panel 3 Lateral Espalda (2x)', 'Panel 4 Centro Espalda (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Bajo Busto', 'Altura de Busto']
  },
  {
    id: 'lumina',
    nombre: 'Bustier Moderno con Copas',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '👙',
    descripcion: 'Top bustier contemporáneo con copas moldeadas y espalda elastizada.',
    genero: 'Mujer',
    piezas: ['Copa Superior (2x)', 'Copa Inferior (2x)', 'Cuerpo Frontal (1x)', 'Espalda (2x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Separación de Busto', 'Altura de Busto']
  },
  {
    id: 'bee',
    nombre: 'Bikini / Top Triángulo y Colaless',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '👙',
    descripcion: 'Conjunto de traje de baño de dos piezas elastizado.',
    genero: 'Mujer',
    piezas: ['Triángulos Busto (4x)', 'Delantero Bikini (2x)', 'Trasero Bikini (2x)', 'Tiras Amarre (4x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cadera']
  },
  {
    id: 'tiberius',
    nombre: 'Túnica / Vestido Imperial Romano',
    categoria: 'Faldas, Vestidos y Corsets',
    icono: '🏛️',
    descripcion: 'Túnica drapeada elegante con caída continua de hombros.',
    genero: 'Unisex',
    piezas: ['Túnica Frontal (1x)', 'Túnica Trasera (1x)', 'Cinto Ribete (1x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cadera', 'Largo de Talle']
  },

  // --- ACCESORIOS, GORROS Y COMPLEMENTOS ---
  {
    id: 'bob',
    nombre: 'Gorra Piluso / Bucket Hat',
    categoria: 'Accesorios y Complementos',
    icono: '👒',
    descripcion: 'Sombrero pescador moderno de tres piezas con ala pespunteada.',
    genero: 'Unisex',
    piezas: ['Corona Superior (1x)', 'Pared Lateral (2x)', 'Ala Pescador (2x)'],
    medidasRequeridas: ['Contorno de Cabeza']
  },
  {
    id: 'holmes',
    nombre: 'Gorra Deerstalker / Sherlock Holmes',
    categoria: 'Accesorios y Complementos',
    icono: '🕵️',
    descripcion: 'Gorra clásica con doble visera y orejeras abatibles.',
    genero: 'Unisex',
    piezas: ['Gajos Corona (6x)', 'Viseras Frontal/Trasera (4x)', 'Orejeras (4x)'],
    medidasRequeridas: ['Contorno de Cabeza']
  },
  {
    id: 'albert',
    nombre: 'Delantal de Cocina / Taller Gastronómico',
    categoria: 'Accesorios y Complementos',
    icono: '🧑‍🍳',
    descripcion: 'Delantal profesional con pechera, bolsillos divididos y cintas cruzadas.',
    genero: 'Unisex',
    piezas: ['Cuerpo Delantal (1x)', 'Pechera (1x)', 'Bolsillo Compartimentado (1x)', 'Cintas Cuello/Cintura (3x)'],
    medidasRequeridas: ['Contorno de Busto', 'Contorno de Cintura', 'Largo de Talle']
  },
  {
    id: 'hi',
    nombre: 'Tiburón de Peluche Artesanal',
    categoria: 'Accesorios y Complementos',
    icono: '🦈',
    descripcion: 'Muñeco de peluche anatómico con aletas y cuerpo volumétrico.',
    genero: 'Unisex',
    piezas: ['Cuerpo Superior (2x)', 'Panza Inferior (1x)', 'Aleta Dorsal (2x)', 'Aletas Laterales (4x)', 'Cola (2x)'],
    medidasRequeridas: []
  },
  {
    id: 'florence',
    nombre: 'Máscara / Antifaz Facial Anatómico',
    categoria: 'Accesorios y Complementos',
    icono: '🎭',
    descripcion: 'Máscara ergonómica de tela con ajuste nasal y mentonera.',
    genero: 'Unisex',
    piezas: ['Panel Lateral (4x)', 'Puente Nariz (2x)'],
    medidasRequeridas: ['Contorno de Cabeza']
  },
  {
    id: 'florent',
    nombre: 'Gorra Boina Plana Clásica (Flat Cap)',
    categoria: 'Accesorios y Complementos',
    icono: '🧢',
    descripcion: 'Boina tradicional con visera curva oculta y forro.',
    genero: 'Unisex',
    piezas: ['Tapa Superior (1x)', 'Laterales (2x)', 'Visera (2x)'],
    medidasRequeridas: ['Contorno de Cabeza']
  },
  {
    id: 'shin',
    nombre: 'Polainas / Calentadores de Tobillo',
    categoria: 'Accesorios y Complementos',
    icono: '🧦',
    descripcion: 'Protector de pierna y calzado con elásticos y cierres.',
    genero: 'Unisex',
    piezas: ['Cuerpo Polaina (2x)', 'Refuerzo Empeine (2x)', 'Correa Base (2x)'],
    medidasRequeridas: ['Contorno de Tobillo']
  }
];
