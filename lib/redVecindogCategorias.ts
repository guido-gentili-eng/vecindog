export const CATEGORIAS_RED_VECINDOG = [
  { url: 'veterinaria', slug: 'Veterinaria', label: 'Veterinaria', emoji: '🏥', desc: 'Atención médica, vacunas y urgencias' },
  { url: 'pet-shop', slug: 'Pet Shop', label: 'Pet Shop', emoji: '🛍️', desc: 'Alimentos, accesorios y juguetes' },
  { url: 'peluqueria-canina', slug: 'Peluquería Canina', label: 'Peluquería Canina', emoji: '✂️', desc: 'Baño, corte y estética canina' },
  { url: 'adiestrador', slug: 'Adiestrador', label: 'Adiestrador', emoji: '🏆', desc: 'Educación, obediencia y conducta' },
  { url: 'paseador', slug: 'Paseador', label: 'Paseador', emoji: '🐕', desc: 'Paseos diarios y actividad física' },
  { url: 'guarderia-hotel', slug: 'Guardería / Hotel', label: 'Guardería / Hotel', emoji: '🏠', desc: 'Cuidado diurno y hospedaje canino' },
  { url: 'refugio-rescate', slug: 'Refugio / Rescate', label: 'Refugio / Rescate', emoji: '❤️', desc: 'Adopción responsable y rescate animal' },
  { url: 'tienda-mascotas', slug: 'Tienda de Mascotas', label: 'Tienda de Mascotas', emoji: '🛒', desc: 'Ropa, accesorios y artículos para mascotas' },
  { url: 'farmacia-veterinaria', slug: 'Farmacia Veterinaria', label: 'Farmacia Veterinaria', emoji: '💊', desc: 'Medicamentos, antiparasitarios y suplementos' },
] as const;

export function categoriaPorUrl(url: string) {
  return CATEGORIAS_RED_VECINDOG.find((c) => c.url === url) ?? null;
}
