import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(join(publicDir, 'icons'), { recursive: true });

// SVG icon: misma huella que el AuthModal — bg-brand-primary + rounded-2xl
// PawIcon original: viewBox="0 0 32 32", escalado a 512x512 con padding
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Fondo coral con rounded-2xl (~20% = 102px de radio) -->
  <rect width="512" height="512" rx="102" fill="#B85C4A"/>

  <!-- Huella escalada: viewBox 0 0 32 32 -> centro en 256,256, escala ~11.5x, con padding -->
  <g transform="translate(80, 90) scale(11.0)">
    <!-- 4 dedos (toe pads) -->
    <ellipse cx="7"  cy="11" rx="3" ry="4"  fill="white"/>
    <ellipse cx="14" cy="6"  rx="3" ry="4"  fill="white"/>
    <ellipse cx="22" cy="6"  rx="3" ry="4"  fill="white"/>
    <ellipse cx="29" cy="11" rx="3" ry="4"  fill="white"/>
    <!-- Almohadilla central -->
    <path d="M18 14c-6 0-10 5-10 9 0 4 4 6 10 6s10-2 10-6c0-4-9-9-10-9z" fill="white"/>
  </g>
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
