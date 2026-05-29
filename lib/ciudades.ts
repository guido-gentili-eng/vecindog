/**
 * Ciudades argentinas disponibles en Vecindog.
 * Ordenadas: primero las más grandes, luego alfabético por provincia.
 */
export interface Ciudad {
  nombre: string;
  provincia: string;
}

export const CIUDADES: Ciudad[] = [
  // Grandes urbes
  { nombre: 'Buenos Aires (CABA)',         provincia: 'CABA' },
  { nombre: 'Córdoba',                     provincia: 'Córdoba' },
  { nombre: 'Rosario',                     provincia: 'Santa Fe' },
  { nombre: 'Mendoza',                     provincia: 'Mendoza' },
  { nombre: 'La Plata',                    provincia: 'Buenos Aires' },
  { nombre: 'San Miguel de Tucumán',       provincia: 'Tucumán' },
  { nombre: 'Mar del Plata',               provincia: 'Buenos Aires' },
  { nombre: 'Salta',                       provincia: 'Salta' },
  { nombre: 'Santa Fe',                    provincia: 'Santa Fe' },
  { nombre: 'Corrientes',                  provincia: 'Corrientes' },
  { nombre: 'Resistencia',                 provincia: 'Chaco' },
  { nombre: 'Posadas',                     provincia: 'Misiones' },
  { nombre: 'San Juan',                    provincia: 'San Juan' },
  { nombre: 'Neuquén',                     provincia: 'Neuquén' },
  { nombre: 'Santiago del Estero',         provincia: 'Santiago del Estero' },
  { nombre: 'Formosa',                     provincia: 'Formosa' },

  // Buenos Aires Provincia
  { nombre: 'Bahía Blanca',               provincia: 'Buenos Aires' },
  { nombre: 'Quilmes',                     provincia: 'Buenos Aires' },
  { nombre: 'Lanús',                       provincia: 'Buenos Aires' },
  { nombre: 'General Roca',               provincia: 'Río Negro' },
  { nombre: 'Tandil',                      provincia: 'Buenos Aires' },
  { nombre: 'Junín',                       provincia: 'Buenos Aires' },
  { nombre: 'Olavarría',                   provincia: 'Buenos Aires' },
  { nombre: 'Pergamino',                   provincia: 'Buenos Aires' },
  { nombre: 'Zárate',                      provincia: 'Buenos Aires' },
  { nombre: 'Azul',                        provincia: 'Buenos Aires' },
  { nombre: 'Necochea',                    provincia: 'Buenos Aires' },
  { nombre: 'Tres Arroyos',               provincia: 'Buenos Aires' },
  { nombre: 'Luján',                       provincia: 'Buenos Aires' },
  { nombre: 'San Nicolás',                provincia: 'Buenos Aires' },
  { nombre: 'Campana',                     provincia: 'Buenos Aires' },

  // Córdoba
  { nombre: 'Río Cuarto',                 provincia: 'Córdoba' },
  { nombre: 'Villa María',               provincia: 'Córdoba' },
  { nombre: 'San Francisco',             provincia: 'Córdoba' },
  { nombre: 'Villa Carlos Paz',          provincia: 'Córdoba' },
  { nombre: 'Alta Gracia',               provincia: 'Córdoba' },

  // Entre Ríos
  { nombre: 'Paraná',                    provincia: 'Entre Ríos' },
  { nombre: 'Concordia',                 provincia: 'Entre Ríos' },
  { nombre: 'Gualeguaychú',             provincia: 'Entre Ríos' },
  { nombre: 'Colón',                     provincia: 'Entre Ríos' },

  // Río Negro & Neuquén
  { nombre: 'Bariloche',                 provincia: 'Río Negro' },
  { nombre: 'Viedma',                    provincia: 'Río Negro' },
  { nombre: 'Cipolletti',               provincia: 'Río Negro' },
  { nombre: 'Zapala',                    provincia: 'Neuquén' },

  // Patagonia
  { nombre: 'Comodoro Rivadavia',       provincia: 'Chubut' },
  { nombre: 'Rawson',                    provincia: 'Chubut' },
  { nombre: 'Puerto Madryn',            provincia: 'Chubut' },
  { nombre: 'Esquel',                    provincia: 'Chubut' },
  { nombre: 'Río Gallegos',             provincia: 'Santa Cruz' },
  { nombre: 'Caleta Olivia',            provincia: 'Santa Cruz' },
  { nombre: 'Ushuaia',                   provincia: 'Tierra del Fuego' },
  { nombre: 'Río Grande',               provincia: 'Tierra del Fuego' },

  // NOA
  { nombre: 'Jujuy',                     provincia: 'Jujuy' },
  { nombre: 'Palpalá',                   provincia: 'Jujuy' },
  { nombre: 'La Rioja',                  provincia: 'La Rioja' },
  { nombre: 'San Fernando del Valle de Catamarca', provincia: 'Catamarca' },

  // Cuyo
  { nombre: 'San Luis',                  provincia: 'San Luis' },
  { nombre: 'Merlo',                     provincia: 'San Luis' },
  { nombre: 'San Rafael',               provincia: 'Mendoza' },
  { nombre: 'Godoy Cruz',               provincia: 'Mendoza' },
  { nombre: 'Luján de Cuyo',            provincia: 'Mendoza' },

  // La Pampa
  { nombre: 'Santa Rosa',               provincia: 'La Pampa' },
  { nombre: 'General Pico',             provincia: 'La Pampa' },

  // Misiones
  { nombre: 'Oberá',                     provincia: 'Misiones' },
  { nombre: 'Eldorado',                  provincia: 'Misiones' },

  // Corrientes & Chaco
  { nombre: 'Goya',                      provincia: 'Corrientes' },
  { nombre: 'Charata',                   provincia: 'Chaco' },
];

/** Devuelve las ciudades que matchean el término de búsqueda */
export function buscarCiudades(q: string): Ciudad[] {
  const term = q.trim().toLowerCase();
  if (!term) return CIUDADES;
  return CIUDADES.filter(
    (c) =>
      c.nombre.toLowerCase().includes(term) ||
      c.provincia.toLowerCase().includes(term)
  );
}

/** Nombre para mostrar en la UI (sin "(CABA)") */
export function nombreCorto(ciudad: string): string {
  return ciudad.replace(' (CABA)', '');
}
