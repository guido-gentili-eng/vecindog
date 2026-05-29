// Datos de prueba (mock) para que la app funcione sin base de datos.
// Esta version de Vecindog esta enfocada en PERROS.
//
// SUPABASE FUTURO:
// La estructura de Animal mapea 1:1 a una tabla `posts`:
//   - imagenes -> columna `images text[]` o tabla `post_images`.
//   - El primer elemento de imagenes[] es la imagen principal.

export type Categoria = 'perdido' | 'encontrado' | 'adopcion';
export type Especie = 'perro' | 'gato' | 'otro';
export type EstadoVida = 'vivo' | 'fallecido' | 'desconocido';
export type Tamanio = 'chico' | 'mediano' | 'grande';
export type Sexo = 'macho' | 'hembra';

export interface Animal {
  id: string;
  categoria: Categoria;
  especie: Especie;
  nombre: string | null;
  descripcion: string;
  zona: string;          // barrio / referencia
  ciudad: string;
  fecha: string;         // YYYY-MM-DD
  imagenes: string[];    // 1 a 5 URLs. La primera es la principal.
  contacto: string;      // WhatsApp visible
  estado: EstadoVida;
  recompensa?: number | null;

  // Atributos descriptivos del animal (opcionales, para matching)
  raza?: string | null;
  colorPrincipal?: string | null;
  coloresSecundarios?: string[];
  tamanio?: Tamanio | null;
  sexo?: Sexo | null;
  collar?: boolean | null;        // true = si, false = no, null = desconocido
  colorCollar?: string | null;
  chapita?: boolean | null;
}

export const ANIMALES: Animal[] = [];

export function obtenerAnimal(id: string): Animal | undefined {
  return ANIMALES.find((a) => a.id === id);
}

// 'buscar' = perdidos + encontrados (excluye adopcion).
export type FiltroCategoria = Categoria | 'todas' | 'buscar';

export function listarAnimales(filtros?: {
  categoria?: FiltroCategoria;
  especie?: Especie | 'todas';
  zona?: string;
}): Animal[] {
  const cat = filtros?.categoria ?? 'todas';
  const esp = filtros?.especie ?? 'todas';
  const zona = (filtros?.zona ?? '').trim().toLowerCase();

  return ANIMALES.filter((a) => {
    if (cat === 'buscar') {
      if (a.categoria !== 'perdido' && a.categoria !== 'encontrado') return false;
    } else if (cat !== 'todas' && a.categoria !== cat) return false;
    if (esp !== 'todas' && a.especie !== esp) return false;
    if (zona && !a.zona.toLowerCase().includes(zona)) return false;
    return true;
  });
}

export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adopcion: 'En adopcion'
};

export const ETIQUETA_ESPECIE: Record<Especie, string> = {
  perro: 'Perro',
  gato: 'Gato',
  otro: 'Otro'
};

/* Helpers de uploads */
export const MAX_FOTOS = 5;
export const MAX_PESO_MB = 5;
export const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ACCEPT_IMAGEN = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

/* ===================================================================
 * Constantes para el formulario de busqueda manual
 * =================================================================== */
export const RAZAS_COMUNES: string[] = [
  'Mestizo',
  'Labrador',
  'Golden Retriever',
  'Border Collie',
  'Caniche / Poodle',
  'Bulldog',
  'Pastor Aleman',
  'Chihuahua',
  'Pitbull',
  'Beagle',
  'Boxer',
  'Cocker',
  'Dalmata',
  'Husky',
  'Salchicha / Dachshund',
  'Yorkshire',
  'Schnauzer',
  'Shih Tzu',
  'Otra'
];

export const COLORES_PERRO: string[] = [
  'Negro',
  'Blanco',
  'Marron',
  'Caramelo',
  'Dorado',
  'Gris',
  'Atigrado',
  'Tricolor',
  'Manchado'
];

export const ZONAS_BB: string[] = [
  'Centro',
  'Villa Mitre',
  'Palihue',
  'Universitario',
  'Terminal',
  'Patagonia',
  'Villa Don Bosco',
  'Villa Floresta',
  'Norte',
  'Sur',
  'Otra'
];

/* ===================================================================
 * Matching mock: filtra avisos por criterios de busqueda manual
 * =================================================================== */
export interface CriteriosBusqueda {
  especie?: Especie | 'todas';
  nombre?: string;
  raza?: string;
  colorPrincipal?: string;
  coloresSecundarios?: string[];
  tamanio?: Tamanio | null;
  sexo?: Sexo | null;
  collar?: boolean | null;
  colorCollar?: string;
  chapita?: boolean | null;
  zona?: string;
  fecha?: string;
  observaciones?: string;
}

export interface Coincidencia {
  animal: Animal;
  score: number;
  porcentaje: number;
  matches: string[];
}

/**
 * Logica mock de matching. Devuelve avisos compatibles ordenados por score.
 * Solo busca entre perdidos + encontrados (no adopcion).
 */
export function buscarCoincidencias(c: CriteriosBusqueda): Coincidencia[] {
  // Calcula puntaje maximo posible segun que criterios fueron cargados
  let maxPosible = 0;
  if (c.raza) maxPosible += 30;
  if (c.colorPrincipal) maxPosible += 25;
  if (c.coloresSecundarios && c.coloresSecundarios.length > 0) maxPosible += 10;
  if (c.tamanio) maxPosible += 10;
  if (c.sexo) maxPosible += 5;
  if (c.collar !== null && c.collar !== undefined) maxPosible += 10;
  if (c.colorCollar) maxPosible += 5;
  if (c.chapita !== null && c.chapita !== undefined) maxPosible += 5;
  if (c.zona) maxPosible += 10;

  if (maxPosible === 0) return [];

  const especie: Especie | 'todas' = c.especie ?? 'perro';
  const resultados: Coincidencia[] = [];

  for (const a of ANIMALES) {
    // Solo perdidos + encontrados (no adopcion) para "buscar mi perro"
    if (a.categoria === 'adopcion') continue;
    if (especie !== 'todas' && a.especie !== especie) continue;

    let score = 0;
    const matches: string[] = [];

    if (c.raza && a.raza && a.raza.toLowerCase().includes(c.raza.toLowerCase())) {
      score += 30;
      matches.push('Raza: ' + a.raza);
    }
    if (c.colorPrincipal && a.colorPrincipal &&
        a.colorPrincipal.toLowerCase() === c.colorPrincipal.toLowerCase()) {
      score += 25;
      matches.push('Color principal: ' + a.colorPrincipal);
    }
    if (c.coloresSecundarios && c.coloresSecundarios.length > 0 && a.coloresSecundarios) {
      const overlap = c.coloresSecundarios.some((cs) =>
        a.coloresSecundarios!.some((as) => as.toLowerCase() === cs.toLowerCase())
      );
      if (overlap) {
        score += 10;
        matches.push('Colores secundarios coinciden');
      }
    }
    if (c.tamanio && a.tamanio === c.tamanio) {
      score += 10;
      matches.push('Tamanio: ' + a.tamanio);
    }
    if (c.sexo && a.sexo === c.sexo) {
      score += 5;
      matches.push('Sexo: ' + a.sexo);
    }
    if (c.collar !== null && c.collar !== undefined && a.collar === c.collar) {
      score += 10;
      matches.push('Collar: ' + (c.collar ? 'si' : 'no'));
    }
    if (c.colorCollar && a.colorCollar &&
        a.colorCollar.toLowerCase() === c.colorCollar.toLowerCase()) {
      score += 5;
      matches.push('Color collar: ' + a.colorCollar);
    }
    if (c.chapita !== null && c.chapita !== undefined && a.chapita === c.chapita) {
      score += 5;
      matches.push('Chapita: ' + (c.chapita ? 'si' : 'no'));
    }
    if (c.zona && a.zona.toLowerCase().includes(c.zona.toLowerCase())) {
      score += 10;
      matches.push('Zona: ' + a.zona);
    }

    if (score >= 20) {
      const porcentaje = Math.round((score / maxPosible) * 100);
      resultados.push({ animal: a, score, porcentaje, matches });
    }
  }

  resultados.sort((a, b) => b.score - a.score);
  return resultados;
}
