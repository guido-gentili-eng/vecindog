import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(join(publicDir, 'icons'), { recursive: true });

// SVG icon: fondo coral con huella de perro (paw)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Fondo redondeado -->
  <rect width="512" height="512" rx="100" fill="#B85C4A"/>
  <!-- Texto "V" estilizado -->
  <text x="256" y="340"
    font-family="Arial Black, sans-serif"
    font-size="300"
    font-weight="900"
    fill="white"
    text-anchor="middle"
    dominant-baseline="auto">V</text>
  <!-- Puntitos decorativos (pata) -->
  <circle cx="150" cy="160" r="40" fill="rgba(255,255,255,0.3)"/>
  <circle cx="200" cy="110" r="30" fill="rgba(255,255,255,0.3)"/>
  <circle cx="312" cy="110" r="30" fill="rgba(255,255,255,0.3)"/>
  <circle cx="362" cy="160" r="40" fill="rgba(255,255,255,0.3)"/>
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
