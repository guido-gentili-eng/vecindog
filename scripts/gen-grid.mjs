import sharp from 'sharp';
import fs from 'fs';

const INPUT = 'C:/Users/Guido/Desktop/Vecindog/Foto Perfil.jpeg';
const OUT_DIR = 'C:/Users/Guido/Desktop/instagram-grid';
const CANVAS = 3240;
const TILE = 1080;

fs.mkdirSync(OUT_DIR, { recursive: true });

const bg = await sharp({
  create: { width: CANVAS, height: CANVAS, channels: 3, background: { r: 245, g: 237, b: 224 } }
}).jpeg().toBuffer();

// 1080x1350 → alto = CANVAS, ancho proporcional
const scaledH = CANVAS;
const scaledW = Math.round(1080 / 1350 * CANVAS); // 2592
const left = Math.round((CANVAS - scaledW) / 2);  // 324

const resized = await sharp(INPUT).resize(scaledW, scaledH).toBuffer();

const composite = await sharp(bg)
  .composite([{ input: resized, left, top: 0 }])
  .toBuffer();

console.log(`Canvas: ${CANVAS}x${CANVAS} | imagen: ${scaledW}x${scaledH} | offset left: ${left}px`);

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const uploadOrder = 9 - (row * 3 + col);
    const rowLabel = ['superior', 'media', 'inferior'][row];
    const colLabel = ['izq', 'centro', 'der'][col];
    const filename = `${OUT_DIR}/upload-${String(uploadOrder).padStart(2, '0')}_${rowLabel}-${colLabel}.jpg`;

    await sharp(composite)
      .extract({ left: col * TILE, top: row * TILE, width: TILE, height: TILE })
      .jpeg({ quality: 95 })
      .toFile(filename);

    console.log(`  upload-${String(uploadOrder).padStart(2, '0')} → ${rowLabel} ${colLabel}  ✅`);
  }
}

console.log('\nListo! Tiles en: ' + OUT_DIR);
console.log('\nOrden de subida a Instagram (primero upload-01, último upload-09):');
console.log('  [ 09 | 08 | 07 ]  ← se ve arriba en el perfil');
console.log('  [ 06 | 05 | 04 ]');
console.log('  [ 03 | 02 | 01 ]  ← se ve abajo en el perfil');
