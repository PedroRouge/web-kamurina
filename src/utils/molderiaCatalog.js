import { Aaron } from '@freesewing/aaron';
import { Albert } from '@freesewing/albert';
import { Bee } from '@freesewing/bee';
import { Bella } from '@freesewing/bella';
import { Bent } from '@freesewing/bent';
import { Breanna } from '@freesewing/breanna';
import { Brian } from '@freesewing/brian';
import { Bruce } from '@freesewing/bruce';
import { Carlita } from '@freesewing/carlita';
import { Carlton } from '@freesewing/carlton';
import { Cathrin } from '@freesewing/cathrin';
import { Charlie } from '@freesewing/charlie';
import { Cornelius } from '@freesewing/cornelius';
import { Crux } from '@freesewing/crux';
import { Diana } from '@freesewing/diana';
import { Florence } from '@freesewing/florence';
import { Florent } from '@freesewing/florent';
import { Holmes } from '@freesewing/holmes';
import { Huey } from '@freesewing/huey';
import { Hugo } from '@freesewing/hugo';
import { Jaeger } from '@freesewing/jaeger';
import { Lucy } from '@freesewing/lucy';
import { Lumina } from '@freesewing/lumina';
import { Paco } from '@freesewing/paco';
import { Penelope } from '@freesewing/penelope';
import { Simon } from '@freesewing/simon';
import { Simone } from '@freesewing/simone';
import { Sven } from '@freesewing/sven';
import { Tamiko } from '@freesewing/tamiko';
import { Teagan } from '@freesewing/teagan';
import { Titan } from '@freesewing/titan';
import { Trayvon } from '@freesewing/trayvon';
import { Wahid } from '@freesewing/wahid';
import { Waralee } from '@freesewing/waralee';
import { Yuri } from '@freesewing/yuri';
import { Shin } from '@freesewing/shin';
import { Sandy } from '@freesewing/sandy';
import { Bob } from '@freesewing/bob';
import { Tiberius } from '@freesewing/tiberius';
import { Hi } from '@freesewing/hi';

export const CATALOGO_MOLDES = [
  // --- TOPS, REMERAS Y BLUSAS ---
  {
    id: 'aaron',
    nombre: 'Musculosa Básica / Remera sin Mangas',
    categoria: 'Tops, Remeras y Blusas',
    icono: '🎽',
    design: Aaron,
    descripcion: 'Musculosa entallada clásica con ribetes de sisa y cuello.',
    genero: 'Unisex / Mujer / Hombre'
  },
  {
    id: 'teagan',
    nombre: 'Remera Básica Clásica (T-Shirt)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👕',
    design: Teagan,
    descripcion: 'Remera de manga corta con cuello redondo elástico.',
    genero: 'Unisex'
  },
  {
    id: 'diana',
    nombre: 'Blusa Drapeada con Escote al Cuello',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👚',
    design: Diana,
    descripcion: 'Elegante blusa femenina con cuello drapeado en cascada.',
    genero: 'Mujer'
  },
  {
    id: 'tamiko',
    nombre: 'Top Kimono Envolvente Geométrico',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👘',
    design: Tamiko,
    descripcion: 'Top de confección geométrica con cruce frontal estilo kimono.',
    genero: 'Mujer'
  },
  {
    id: 'brian',
    nombre: 'Bloque Superior Base (Unisex / Hombre)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '📐',
    design: Brian,
    descripcion: 'Patrón base de cuerpo superior sin pinzas para transformaciones.',
    genero: 'Unisex'
  },
  {
    id: 'breanna',
    nombre: 'Bloque Superior con Pinzas (Mujer)',
    categoria: 'Tops, Remeras y Blusas',
    icono: '📐',
    design: Breanna,
    descripcion: 'Patrón base femenino con pinzas de busto y entalle.',
    genero: 'Mujer'
  },
  {
    id: 'bella',
    nombre: 'Bloque Base de Vestido / Blusa Femenina',
    categoria: 'Tops, Remeras y Blusas',
    icono: '👗',
    design: Bella,
    descripcion: 'Cuerpo base femenino con pinzas laterales y entalle anatómico.',
    genero: 'Mujer'
  },

  // --- CAMISAS Y SASTRERÍA ---
  {
    id: 'simon',
    nombre: 'Camisa Clásica de Vestir (Hombre)',
    categoria: 'Camisas y Sastrería',
    icono: '👔',
    design: Simon,
    descripcion: 'Camisa formal con cuello camisero, cartera de botones y puños.',
    genero: 'Hombre / Unisex'
  },
  {
    id: 'simone',
    nombre: 'Camisa Entallada de Vestir (Mujer)',
    categoria: 'Camisas y Sastrería',
    icono: '👚',
    design: Simone,
    descripcion: 'Camisa femenina con pinzas de busto y entalle en cintura.',
    genero: 'Mujer'
  },
  {
    id: 'wahid',
    nombre: 'Chaleco de Vestir / Sastrería',
    categoria: 'Camisas y Sastrería',
    icono: '🤵',
    design: Wahid,
    descripcion: 'Chaleco formal con bolsillos ojal y martillo trasero regulable.',
    genero: 'Hombre / Unisex'
  },
  {
    id: 'jaeger',
    nombre: 'Blazer / Saco Sastre Femenino',
    categoria: 'Camisas y Sastrería',
    icono: '🧥',
    design: Jaeger,
    descripcion: 'Saco entallado de sastrería con solapa clásica y forrería.',
    genero: 'Mujer'
  },
  {
    id: 'bent',
    nombre: 'Bloque Base de Saco / Chaqueta',
    categoria: 'Camisas y Sastrería',
    icono: '📐',
    design: Bent,
    descripcion: 'Molde base para trajes, chaquetas y sacos estructurados.',
    genero: 'Unisex'
  },
  {
    id: 'trayvon',
    nombre: 'Corbata Clásica de Seda',
    categoria: 'Camisas y Sastrería',
    icono: '👔',
    design: Trayvon,
    descripcion: 'Corbata tradicional de tres piezas con forro y alma.',
    genero: 'Unisex'
  },

  // --- BUZOS, ABRIGOS Y CHAQUETAS ---
  {
    id: 'huey',
    nombre: 'Buzo Canguro con Capucha (Hoodie)',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    design: Huey,
    descripcion: 'Buzo urbano amplio con capucha forrada y bolsillo delantero.',
    genero: 'Unisex'
  },
  {
    id: 'hugo',
    nombre: 'Buzo Clásico Cuello Redondo',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧶',
    design: Hugo,
    descripcion: 'Sweater / buzo clásico con cuello, puños y cintura de rib.',
    genero: 'Unisex'
  },
  {
    id: 'sven',
    nombre: 'Sweater / Buzo Escote en V',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧶',
    design: Sven,
    descripcion: 'Buzo casual con cuello en V limpio y mangas ranglan o clásicas.',
    genero: 'Unisex'
  },
  {
    id: 'yuri',
    nombre: 'Buzo Deportivo con Cierre y Capucha',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🏃',
    design: Yuri,
    descripcion: 'Campera deportiva con cierre central y bolsillos laterales.',
    genero: 'Unisex'
  },
  {
    id: 'lumina',
    nombre: 'Chaqueta Cortavientos Liviana',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    design: Lumina,
    descripcion: 'Chaqueta ligera para media estación con capucha y elásticos.',
    genero: 'Unisex'
  },
  {
    id: 'carlita',
    nombre: 'Abrigo Clásico Entallado (Mujer)',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    design: Carlita,
    descripcion: 'Tapado largo de paño con solapa ancha y corte estilizado.',
    genero: 'Mujer'
  },
  {
    id: 'carlton',
    nombre: 'Sobretodo / Abrigo Masculino',
    categoria: 'Buzos, Abrigos y Chaquetas',
    icono: '🧥',
    design: Carlton,
    descripcion: 'Tapado de abrigo cruzado o recto con solapa sastre.',
    genero: 'Hombre / Unisex'
  },

  // --- PANTALONES Y FALDAS ---
  {
    id: 'titan',
    nombre: 'Bloque Pantalón Base',
    categoria: 'Pantalones y Faldas',
    icono: '👖',
    design: Titan,
    descripcion: 'Patrón matriz para cualquier tipo de pantalón ajustado o recto.',
    genero: 'Unisex'
  },
  {
    id: 'charlie',
    nombre: 'Pantalón Chino Clásico',
    categoria: 'Pantalones y Faldas',
    icono: '👖',
    design: Charlie,
    descripcion: 'Pantalón casual de gabardina con bolsillos diagonales y traseros.',
    genero: 'Hombre / Unisex'
  },
  {
    id: 'paco',
    nombre: 'Pantalón Casual Jogging / Chándal',
    categoria: 'Pantalones y Faldas',
    icono: '👖',
    design: Paco,
    descripcion: 'Pantalón cómodo con cintura elastizada y puños en los tobillos.',
    genero: 'Unisex'
  },
  {
    id: 'cornelius',
    nombre: 'Bombacha de Campo / Bombacho',
    categoria: 'Pantalones y Faldas',
    icono: '🐎',
    design: Cornelius,
    descripcion: 'Pantalón tradicional amplio con pliegues y botamanga ajustada.',
    genero: 'Unisex'
  },
  {
    id: 'waralee',
    nombre: 'Pantalón Envolvente Thai',
    categoria: 'Pantalones y Faldas',
    icono: '🩳',
    design: Waralee,
    descripcion: 'Pantalón envolvente ultra confortable de lazo cruzado.',
    genero: 'Unisex'
  },
  {
    id: 'penelope',
    nombre: 'Falda Tubo / Lápiz Clásica',
    categoria: 'Pantalones y Faldas',
    icono: '👗',
    design: Penelope,
    descripcion: 'Falda entallada hasta la rodilla con tajo posterior y cierre invisible.',
    genero: 'Mujer'
  },
  {
    id: 'sandy',
    nombre: 'Falda Plato Acampanada',
    categoria: 'Pantalones y Faldas',
    icono: '👗',
    design: Sandy,
    descripcion: 'Falda circular con gran vuelo y caída fluida.',
    genero: 'Mujer'
  },

  // --- ROPA INTERIOR, BAÑO Y CORSETERÍA ---
  {
    id: 'cathrin',
    nombre: 'Corset Clásico con Ballenas',
    categoria: 'Ropa Interior, Baño y Corsetería',
    icono: '🩱',
    design: Cathrin,
    descripcion: 'Corset estructurado de varios paneles para reducción y modelado.',
    genero: 'Mujer'
  },
  {
    id: 'bee',
    nombre: 'Bikini / Top Triángulo Playero',
    categoria: 'Ropa Interior, Baño y Corsetería',
    icono: '👙',
    design: Bee,
    descripcion: 'Top de traje de baño con copas triangulares y tiras ajustables.',
    genero: 'Mujer'
  },
  {
    id: 'bruce',
    nombre: 'Bóxer Clásico Masculino',
    categoria: 'Ropa Interior, Baño y Corsetería',
    icono: '🩲',
    design: Bruce,
    descripcion: 'Calzoncillo bóxer anatómico de algodón con refuerzo central.',
    genero: 'Hombre'
  },
  {
    id: 'crux',
    nombre: 'Bóxer Corto Anatómico',
    categoria: 'Ropa Interior, Baño y Corsetería',
    icono: '🩲',
    design: Crux,
    descripcion: 'Bóxer ajustado sin costuras laterales para máxima comodidad.',
    genero: 'Hombre'
  },
  {
    id: 'shin',
    nombre: 'Short de Baño / Bañador',
    categoria: 'Ropa Interior, Baño y Corsetería',
    icono: '🩳',
    design: Shin,
    descripcion: 'Malla / short de natación con cintura elastizada y cordón.',
    genero: 'Hombre / Unisex'
  },

  // --- ACCESORIOS, SOMBREROS Y HOGAR ---
  {
    id: 'albert',
    nombre: 'Delantal de Cocina y Taller',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '🧑‍🍳',
    design: Albert,
    descripcion: 'Delantal peto protector con bolsillos frontales amplios y lazos.',
    genero: 'Unisex'
  },
  {
    id: 'bob',
    nombre: 'Gorro Pescador (Bucket Hat)',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '👒',
    design: Bob,
    descripcion: 'Sombrero pescador moderno de ala corta con copa estructurada.',
    genero: 'Unisex'
  },
  {
    id: 'florent',
    nombre: 'Boina Plana / Gorra Gatsby',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '🧢',
    design: Florent,
    descripcion: 'Gorra clásica de 6 u 8 gajos con visera pequeña cosida.',
    genero: 'Unisex'
  },
  {
    id: 'holmes',
    nombre: 'Gorro de Cazador (Sherlock Hat)',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '🕵️',
    design: Holmes,
    descripcion: 'Sombrero tradicional con doble visera y orejeras atadas.',
    genero: 'Unisex'
  },
  {
    id: 'florence',
    nombre: 'Antifaz de Descanso / Máscara de Ojos',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '😴',
    design: Florence,
    descripcion: 'Antifaz acolchado con elástico suave para dormir.',
    genero: 'Unisex'
  },
  {
    id: 'lucy',
    nombre: 'Bolsillo Oculto / Riñonera Interna',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '👜',
    design: Lucy,
    descripcion: 'Bolsillo portátil para viaje o prenda interior.',
    genero: 'Unisex'
  },
  {
    id: 'tiberius',
    nombre: 'Túnica Tradicional',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '🏛️',
    design: Tiberius,
    descripcion: 'Túnica holgada ceremonial o de vestuario.',
    genero: 'Unisex'
  },
  {
    id: 'hi',
    nombre: 'Tiburón de Peluche Artesanal',
    categoria: 'Accesorios, Sombreros y Hogar',
    icono: '🦈',
    design: Hi,
    descripcion: 'Peluche tridimensional con aletas y cuerpo anatómico.',
    genero: 'General'
  }
];
