import * as ImageManipulator from 'expo-image-manipulator';

const MAX_WIDTH  = 1200;   // px — sube imágenes a máx 1200px de ancho
const THUMB_WIDTH = 400;   // px — ancho para thumbnails en listas

/**
 * Redimensiona una imagen al ancho máximo antes de subirla.
 * Si ya es más pequeña, la devuelve sin tocar.
 * Siempre re-comprime a JPEG quality 0.8 para normalizar el formato.
 */
export async function resizeForUpload(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_WIDTH } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}

/**
 * Convierte una URL de Supabase Storage en una URL de thumbnail
 * usando la API de transformación de imágenes de Supabase.
 *
 * Transforma:
 *   /storage/v1/object/public/posts/path.jpg
 * En:
 *   /storage/v1/render/image/public/posts/path.jpg?width=400&quality=70
 */
export function thumbUrl(url: string, width = THUMB_WIDTH): string {
  if (!url) return url;
  const transformed = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/',
  );
  return `${transformed}?width=${width}&quality=70`;
}
