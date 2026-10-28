import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp radar and alert icon SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="110" fill="url(#bgGlow)"/>
  <rect width="504" height="504" x="4" y="4" rx="106" fill="none" stroke="#1f2937" stroke-width="4"/>

  <!-- Radar Rings -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-opacity="0.25"/>
  <circle cx="256" cy="256" r="135" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-opacity="0.35"/>
  <circle cx="256" cy="256" r="80" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.45"/>

  <!-- Radar Crosshairs -->
  <line x1="256" y1="56" x2="256" y2="456" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 6"/>
  <line x1="56" y1="256" x2="456" y2="256" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 6"/>

  <!-- Radar Sweep wedge -->
  <path d="M 256 256 L 390 122 A 190 190 0 0 0 256 66 Z" fill="url(#sweepGrad)"/>

  <!-- Center Emblem (Alert Radar Shield) -->
  <g transform="translate(256, 256)">
    <circle r="44" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
    <!-- Outer Blip Pulse -->
    <circle cx="90" cy="-60" r="7" fill="#ef4444"/>
    <circle cx="90" cy="-60" r="14" fill="none" stroke="#ef4444" stroke-width="2" stroke-opacity="0.75"/>
    <circle cx="-75" cy="85" r="5" fill="#10b981"/>
    
    <!-- Shield / Radar Logo in Center -->
    <path d="M-18 -12 L0 -24 L18 -12 L18 8 C18 20 0 28 0 28 C0 28 -18 20 -18 8 Z" fill="url(#shieldGrad)"/>
    <polygon points="0,-16 -10,3 -2,3 -4,15 10,-3 2,-3" fill="#ffffff"/>
  </g>
</svg>`;

// Maskable SVG with safe-zone margin (15% padding)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlowM" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </radialGradient>
    <linearGradient id="shieldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed Solid Background for Maskable -->
  <rect width="512" height="512" fill="url(#bgGlowM)"/>

  <!-- Safe Zone Elements (within central 80% circle, r=204) -->
  <circle cx="256" cy="256" r="160" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-opacity="0.3"/>
  <circle cx="256" cy="256" r="110" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-opacity="0.4"/>
  <circle cx="256" cy="256" r="65" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.5"/>

  <line x1="256" y1="96" x2="256" y2="416" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 6"/>
  <line x1="96" y1="256" x2="416" y2="256" stroke="#0ea5e9" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="6 6"/>

  <g transform="translate(256, 256)">
    <circle r="36" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
    <circle cx="70" cy="-50" r="6" fill="#ef4444"/>
    <circle cx="-60" cy="65" r="5" fill="#10b981"/>
    
    <path d="M-15 -10 L0 -20 L15 -10 L15 7 C15 17 0 24 0 24 C0 24 -15 17 -15 7 Z" fill="url(#shieldGradM)"/>
    <polygon points="0,-13 -8,2 -1,2 -3,12 8,-2 1,-2" fill="#ffffff"/>
  </g>
</svg>`;

async function run() {
  const svgBuf = Buffer.from(svgIcon);
  const svgMaskableBuf = Buffer.from(svgMaskable);

  // Write icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

  // 192x192 PNG
  await sharp(svgBuf)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PNG
  await sharp(svgBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 512x512 Maskable PNG
  await sharp(svgMaskableBuf)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 180x180 Apple Touch Icon PNG
  await sharp(svgBuf)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 48x48 Favicon PNG
  await sharp(svgBuf)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('Icons generated successfully in public/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
