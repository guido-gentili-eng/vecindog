/**
 * Divide una imagen cuadrada en 9 partes para grid de Instagram.
 *
 * Uso:
 *   node scripts/split-instagram-grid.mjs <ruta-imagen>
 *
 * Ejemplo:
 *   node scripts/split-instagram-grid.mjs mi-foto.jpg
 *
 * Genera 9 archivos en la carpeta instagram-grid/ nombrados con el orden
 * de subida a Instagram (01 se sube primero = esquina inferior derecha).
 *
 * Orden de subida (el más reciente aparece arriba-izquierda en el perfil):
 *
 *   Perfil de Instagram (lo que ve el visitante):
 *   [7] [8] [9]   ← fila superior (posts más nuevos)
 *   [4] [5] [6]
 *   [1] [2] [3]   ← fila inferior (posts más viejos)
 *
 *   → Subís primero el 01 (inf-der), último el 09 (sup-izq)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('❌  Uso: node scripts/split-instagram-grid.mjs <ruta-imagen>');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`❌  No se encontró el archivo: ${inputPath}`);
  process.exit(1);
}

const outputDir = 'instagram-grid';
fs.mkdirSync(outputDir, { recursive: true });

const image = sharp(inputPath);
const meta = await image.metadata();
const { width, height } = meta;

if (width !== height) {
  console.warn(`⚠️  La imagen no es cuadrada (${width}x${height}). Se usará el lado menor.`);
}

const size = Math.min(width, height);
const tileSize = Math.floor(size / 3);

console.log(`\n📐 Imagen: ${width}x${height}px`);
console.log(`📦 Cada tile: ${tileSize}x${tileSize}px\n`);

// Mapa: posición en el perfil → coordenadas de corte
// Perfil muestra: fila 0 = top, col 0 = left
// Subida: el tile [2][2] (inf-der) se sube primero (upload order 01)
//
// upload_order = 9 - (row * 3 + col)  donde row/col empiezan en 0 desde arriba-izq
//
// Pero queremos que al verlo en el perfil quede bien, así que:
// upload 01 = fila 2 col 2 (inf-der del perfil)
// upload 09 = fila 0 col 0 (sup-izq del perfil)

const tiles = [];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const uploadOrder = 9 - (row * 3 + col); // 9 downto 1
    tiles.push({ row, col, uploadOrder });
  }
}

// Ordenar por uploadOrder para procesar en orden
tiles.sort((a, b) => a.uploadOrder - b.uploadOrder);

for (const { row, col, uploadOrder } of tiles) {
  const left = col * tileSize;
  const top = row * tileSize;
  const posLabel = `fila${row + 1}-col${col + 1}`;
  const filename = path.join(outputDir, `upload-${String(uploadOrder).padStart(2, '0')}_${posLabel}.jpg`);

  await sharp(inputPath)
    .extract({ left, top, width: tileSize, height: tileSize })
    .resize(1080, 1080)
    .jpeg({ quality: 95 })
    .toFile(filename);

  const gridPos = row === 0 ? 'superior' : row === 1 ? 'media' : 'inferior';
  const colPos = col === 0 ? 'izquierda' : col === 1 ? 'centro' : 'derecha';
  console.log(`  ✅ upload-${String(uploadOrder).padStart(2, '0')} → ${gridPos} ${colPos}  (${filename})`);
}

console.log(`
✨ ¡Listo! Encontrás las 9 imágenes en: ./${outputDir}/

📋 ORDEN DE SUBIDA A INSTAGRAM:
   Subí primero upload-01, luego upload-02, ..., por último upload-09.
   Esperá que cada post se publique antes de subir el siguiente.

   Lo que verá el visitante en tu perfil:
   ┌─────────────┐
   │ 09 │ 08 │ 07│  ← fila superior
   │ 06 │ 05 │ 04│
   │ 03 │ 02 │ 01│  ← fila inferior
   └─────────────┘
   (01 = primer post subido, 09 = último)
`);
