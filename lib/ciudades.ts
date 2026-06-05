/**
 * Ciudades argentinas disponibles en Vecindog.
 * Ordenadas: primero las más grandes, luego alfabético por provincia.
 */
export interface Ciudad {
  nombre: string;
  provincia: string;
  lat: number;
  lng: number;
}

export const CIUDADES: Ciudad[] = [
  // Grandes urbes
  { nombre: 'Buenos Aires (CABA)',         provincia: 'CABA',                    lat: -34.6037,  lng: -58.3816 },
  { nombre: 'Córdoba',                     provincia: 'Córdoba',                 lat: -31.4135,  lng: -64.1811 },
  { nombre: 'Rosario',                     provincia: 'Santa Fe',                lat: -32.9442,  lng: -60.6505 },
  { nombre: 'Mendoza',                     provincia: 'Mendoza',                 lat: -32.8908,  lng: -68.8272 },
  { nombre: 'La Plata',                    provincia: 'Buenos Aires',            lat: -34.9215,  lng: -57.9545 },
  { nombre: 'San Miguel de Tucumán',       provincia: 'Tucumán',                 lat: -26.8083,  lng: -65.2176 },
  { nombre: 'Mar del Plata',               provincia: 'Buenos Aires',            lat: -38.0055,  lng: -57.5426 },
  { nombre: 'Salta',                       provincia: 'Salta',                   lat: -24.7859,  lng: -65.4117 },
  { nombre: 'Santa Fe',                    provincia: 'Santa Fe',                lat: -31.6333,  lng: -60.7000 },
  { nombre: 'Corrientes',                  provincia: 'Corrientes',              lat: -27.4806,  lng: -58.8341 },
  { nombre: 'Resistencia',                 provincia: 'Chaco',                   lat: -27.4514,  lng: -58.9867 },
  { nombre: 'Posadas',                     provincia: 'Misiones',                lat: -27.3671,  lng: -55.8961 },
  { nombre: 'San Juan',                    provincia: 'San Juan',                lat: -31.5375,  lng: -68.5364 },
  { nombre: 'Neuquén',                     provincia: 'Neuquén',                 lat: -38.9516,  lng: -68.0591 },
  { nombre: 'Santiago del Estero',         provincia: 'Santiago del Estero',     lat: -27.7951,  lng: -64.2615 },
  { nombre: 'Formosa',                     provincia: 'Formosa',                 lat: -26.1775,  lng: -58.1781 },

  // Buenos Aires Provincia
  { nombre: 'Bahía Blanca',               provincia: 'Buenos Aires',            lat: -38.7196,  lng: -62.2724 },
  { nombre: 'Quilmes',                     provincia: 'Buenos Aires',            lat: -34.7206,  lng: -58.2535 },
  { nombre: 'Lanús',                       provincia: 'Buenos Aires',            lat: -34.7007,  lng: -58.3955 },
  { nombre: 'Tandil',                      provincia: 'Buenos Aires',            lat: -37.3217,  lng: -59.1332 },
  { nombre: 'Junín',                       provincia: 'Buenos Aires',            lat: -34.5928,  lng: -60.9568 },
  { nombre: 'Olavarría',                   provincia: 'Buenos Aires',            lat: -36.8924,  lng: -60.3226 },
  { nombre: 'Pergamino',                   provincia: 'Buenos Aires',            lat: -33.8894,  lng: -60.5706 },
  { nombre: 'Zárate',                      provincia: 'Buenos Aires',            lat: -34.0983,  lng: -59.0289 },
  { nombre: 'Azul',                        provincia: 'Buenos Aires',            lat: -36.7762,  lng: -59.8579 },
  { nombre: 'Necochea',                    provincia: 'Buenos Aires',            lat: -38.5548,  lng: -58.7393 },
  { nombre: 'Tres Arroyos',               provincia: 'Buenos Aires',            lat: -38.3753,  lng: -60.2761 },
  { nombre: 'Luján',                       provincia: 'Buenos Aires',            lat: -34.5697,  lng: -59.1089 },
  { nombre: 'San Nicolás',                provincia: 'Buenos Aires',            lat: -33.3356,  lng: -60.2228 },
  { nombre: 'Campana',                     provincia: 'Buenos Aires',            lat: -34.1638,  lng: -58.9566 },

  // Córdoba
  { nombre: 'Río Cuarto',                 provincia: 'Córdoba',                 lat: -33.1232,  lng: -64.3493 },
  { nombre: 'Villa María',               provincia: 'Córdoba',                 lat: -32.4072,  lng: -63.2403 },
  { nombre: 'San Francisco',             provincia: 'Córdoba',                 lat: -31.4278,  lng: -62.0850 },
  { nombre: 'Villa Carlos Paz',          provincia: 'Córdoba',                 lat: -31.4228,  lng: -64.4997 },
  { nombre: 'Alta Gracia',               provincia: 'Córdoba',                 lat: -31.6547,  lng: -64.4327 },

  // Entre Ríos
  { nombre: 'Paraná',                    provincia: 'Entre Ríos',              lat: -31.7333,  lng: -60.5333 },
  { nombre: 'Concordia',                 provincia: 'Entre Ríos',              lat: -31.3933,  lng: -58.0200 },
  { nombre: 'Gualeguaychú',             provincia: 'Entre Ríos',              lat: -33.0127,  lng: -58.5179 },
  { nombre: 'Colón',                     provincia: 'Entre Ríos',              lat: -32.2233,  lng: -58.1440 },

  // Río Negro & Neuquén
  { nombre: 'Bariloche',                 provincia: 'Río Negro',               lat: -41.1335,  lng: -71.3103 },
  { nombre: 'Viedma',                    provincia: 'Río Negro',               lat: -40.8135,  lng: -62.9967 },
  { nombre: 'Cipolletti',               provincia: 'Río Negro',               lat: -38.9330,  lng: -68.0000 },
  { nombre: 'General Roca',             provincia: 'Río Negro',               lat: -39.0333,  lng: -67.5833 },
  { nombre: 'Zapala',                    provincia: 'Neuquén',                 lat: -38.8990,  lng: -70.0690 },

  // Patagonia
  { nombre: 'Comodoro Rivadavia',       provincia: 'Chubut',                  lat: -45.8647,  lng: -67.4974 },
  { nombre: 'Rawson',                    provincia: 'Chubut',                  lat: -43.3002,  lng: -65.1023 },
  { nombre: 'Puerto Madryn',            provincia: 'Chubut',                  lat: -42.7682,  lng: -65.0385 },
  { nombre: 'Esquel',                    provincia: 'Chubut',                  lat: -42.9060,  lng: -71.3186 },
  { nombre: 'Río Gallegos',             provincia: 'Santa Cruz',              lat: -51.6230,  lng: -69.2168 },
  { nombre: 'Caleta Olivia',            provincia: 'Santa Cruz',              lat: -46.4385,  lng: -67.5226 },
  { nombre: 'Ushuaia',                   provincia: 'Tierra del Fuego',        lat: -54.8019,  lng: -68.3030 },
  { nombre: 'Río Grande',               provincia: 'Tierra del Fuego',        lat: -53.7878,  lng: -67.7066 },

  // NOA
  { nombre: 'Jujuy',                     provincia: 'Jujuy',                   lat: -24.1858,  lng: -65.2995 },
  { nombre: 'Palpalá',                   provincia: 'Jujuy',                   lat: -24.2564,  lng: -65.2097 },
  { nombre: 'La Rioja',                  provincia: 'La Rioja',                lat: -29.4131,  lng: -66.8558 },
  { nombre: 'San Fernando del Valle de Catamarca', provincia: 'Catamarca',    lat: -28.4696,  lng: -65.7852 },

  // Cuyo
  { nombre: 'San Luis',                  provincia: 'San Luis',                lat: -33.3015,  lng: -66.3375 },
  { nombre: 'Merlo',                     provincia: 'San Luis',                lat: -32.3439,  lng: -65.0126 },
  { nombre: 'San Rafael',               provincia: 'Mendoza',                 lat: -34.6176,  lng: -68.3299 },
  { nombre: 'Godoy Cruz',               provincia: 'Mendoza',                 lat: -32.9247,  lng: -68.8458 },
  { nombre: 'Luján de Cuyo',            provincia: 'Mendoza',                 lat: -33.0391,  lng: -68.8772 },

  // La Pampa
  { nombre: 'Santa Rosa',               provincia: 'La Pampa',                lat: -36.6167,  lng: -64.2833 },
  { nombre: 'General Pico',             provincia: 'La Pampa',                lat: -35.6566,  lng: -63.7566 },

  // Misiones
  { nombre: 'Oberá',                     provincia: 'Misiones',                lat: -27.4847,  lng: -55.1219 },
  { nombre: 'Eldorado',                  provincia: 'Misiones',                lat: -26.4031,  lng: -54.6347 },

  // Corrientes & Chaco
  { nombre: 'Goya',                      provincia: 'Corrientes',              lat: -29.1433,  lng: -59.2636 },
  { nombre: 'Charata',                   provincia: 'Chaco',                   lat: -27.2152,  lng: -61.1886 },
];

function sinTildes(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Devuelve las ciudades que matchean el término de búsqueda (ignora tildes) */
export function buscarCiudades(q: string): Ciudad[] {
  const term = sinTildes(q.trim());
  if (!term) return CIUDADES;
  return CIUDADES.filter(
    (c) =>
      sinTildes(c.nombre).includes(term) ||
      sinTildes(c.provincia).includes(term)
  );
}

/** Nombre para mostrar en la UI (sin "(CABA)") */
export function nombreCorto(ciudad: string): string {
  return ciudad.replace(' (CABA)', '');
}
