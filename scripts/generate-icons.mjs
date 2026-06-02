import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(join(publicDir, 'icons'), { recursive: true });

// SVG icon: fondo coral con huella de perro (paw print)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Fondo redondeado color coral -->
  <rect width="512" height="512" rx="110" fill="#B85C4A"/>

  <!-- Huella de perro centrada y escalada -->
  <!-- Almohadilla central (grande, forma de corazón invertido) -->
  <ellipse cx="256" cy="340" rx="95" ry="75" fill="white"/>
  <!-- Muesca superior para forma de corazón invertido -->
  <ellipse cx="222" cy="305" rx="48" ry="42" fill="white"/>
  <ellipse cx="290" cy="305" rx="48" ry="42" fill="white"/>

  <!-- Dedo 1 - izquierda abajo -->
  <ellipse cx="135" cy="295" rx="42" ry="52" fill="white" transform="rotate(-20 135 295)"/>
  <!-- Dedo 2 - izquierda arriba -->
  <ellipse cx="178" cy="195" rx="38" ry="50" fill="white" transform="rotate(-8 178 195)"/>
  <!-- Dedo 3 - derecha arriba -->
  <ellipse cx="334" cy="195" rx="38" ry="50" fill="white" transform="rotate(8 334 195)"/>
  <!-- Dedo 4 - derecha abajo -->
  <ellipse cx="377" cy="295" rx="42" ry="52" fill="white" transform="rotate(20 377 295)"/>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, 'icons', `icon-${size}x${size}.png`));
  console.log(`✓ icon-${size}x${size}.png`);
}

// Apple touch icon (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png');

// Favicon 32x32
await sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile(join(publicDir, 'favicon-32x32.png'));

// Favicon 16x16
await sharp(svgBuffer)
  .resize(16, 16)
  .png()
  .toFile(join(publicDir, 'favicon-16x16.png'));

console.log('✓ Todos los íconos generados');
