import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

mkdirSync(join(publicDir, 'icons'), { recursive: true });

// Pin de Vecindog (pin.svg) incrustado directamente como paths
// viewBox original: 0 0 59.57 89.72
// Lo centramos en un cuadrado con fondo verde #3F8B5C
function buildSvg(size) {
  const bg_r   = Math.round(size * 0.22);  // border-radius ~22%
  const pad    = Math.round(size * 0.10);  // 10% de padding
  const pinW   = size - pad * 2;
  // ratio h/w del pin original: 89.72 / 59.57 = 1.506
  const pinH   = Math.round(pinW * (89.72 / 59.57));
  const offsetX = pad;
  const offsetY = Math.round((size - pinH) / 2);
  const scaleX  = pinW / 59.57;
  const scaleY  = pinH / 89.72;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${bg_r}" fill="#3F8B5C"/>
  <g transform="translate(${offsetX},${offsetY}) scale(${scaleX.toFixed(6)},${scaleY.toFixed(6)})">
    <path fill="#d31323" d="M29.79,0C13.34,0,0,13.34,0,29.79,0,53.16,21.13,65.1,29.79,89.72c8.66-24.62,29.79-36.56,29.79-59.93C59.57,13.34,46.24,0,29.79,0ZM35.22,51.3c-.29.07-.58.14-.87.2-.57,3.35-.69,7.15-.66,7.26,0,0,0,0,0,0-.07.04-3.33-2.52-5.14-5.57-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01s22.24,3.93,25.01,14.97c2.77,11.04-3.32,21.63-14.36,24.4Z"/>
    <path fill="#413f3f" d="M23.05,33.88c-1.24.15-2.39-.95-2.57-2.46-.24-1.96.54-3.89,1.77-4.04,1.24-.15,2.48,1.67,2.7,3.49.19,1.51-.66,2.86-1.9,3.01Z"/>
    <path fill="#413f3f" d="M32.78,40.28c-1.76-.04-2.43-.82-3.56-.84-1.13-.02-1.83.73-3.59.7-2.3-.05-3.96-2.94-1.83-4.79,2.65-2.3,3.45-5.24,5.61-5.19,2.17.04,2.84,3.02,5.39,5.42,2.05,1.94.28,4.76-2.02,4.71Z"/>
    <path fill="#413f3f" d="M30.05,26.32c.19-1.82,1.41-3.67,2.64-3.53,1.24.13,2.05,2.05,1.84,4.01-.16,1.51-1.3,2.63-2.53,2.5-1.24-.13-2.11-1.47-1.95-2.98Z"/>
    <path fill="#413f3f" d="M24.42,26.59c-.13-1.97.76-3.85,2-3.93,1.24-.08,2.38,1.81,2.49,3.64.1,1.52-.83,2.82-2.07,2.9-1.24.08-2.33-1.09-2.43-2.61Z"/>
    <path fill="#413f3f" d="M35.61,34.14c-1.23-.2-2.02-1.59-1.77-3.09.3-1.81,1.62-3.58,2.84-3.37,1.23.2,1.93,2.16,1.6,4.11-.25,1.5-1.45,2.56-2.67,2.35Z"/>
    <path fill="#ba0022" d="M28.55,53.2c-.14-.23-.26-.45-.38-.67-8.91-.35-16.29-6.5-18.57-15.58-2.77-11.04,3.93-22.24,14.97-25.01,1.75-.44,3.49-.61,5.21-.6V0C13.34,0,0,13.34,0,29.79c0,23.37,21.13,35.31,29.79,59.93v-34.77c-.44-.56-.87-1.14-1.24-1.75Z"/>
  </g>
</svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(Buffer.from(buildSvg(size)))
    .png({ compressionLevel: 9 })
    .toFile(join(publicDir, 'icons', `icon-${size}x${size}.png`));
  console.log(`✓ icon-${size}x${size}.png`);
}

await sharp(Buffer.from(buildSvg(180)))
  .png({ compressionLevel: 9 })
  .toFile(join(publicDir, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png');

await sharp(Buffer.from(buildSvg(32)))
  .png({ compressionLevel: 9 })
  .toFile(join(publicDir, 'favicon-32x32.png'));
console.log('✓ favicon-32x32.png');

await sharp(Buffer.from(buildSvg(16)))
  .png({ compressionLevel: 9 })
  .toFile(join(publicDir, 'favicon-16x16.png'));
console.log('✓ favicon-16x16.png');

console.log('\n¡Listo! Íconos generados desde pin.svg con fondo verde.');
