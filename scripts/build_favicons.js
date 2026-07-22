import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG definition for Majalengka Post Favicon Logo
// Requirements:
// 1. Black monument at top (#111111)
// 2. Bold Red 'M' (#D60000)
// 3. Red Pen Nib in center (#D60000 with high contrast #111111 outlines)
// 4. Transparent background, crisp & centered, no text "Majalengka Post"
// 5. Optimized for 16x16, 32x32, 48x48, 180x180, 192x192, 512x512

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Group with subtle drop filter or crisp rendering -->
  <g shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
    
    <!-- 1. BLACK MONUMENT (Monumen Hitam) - Top Center (Tugu Majalengka Spire) -->
    <!-- Base platform of monument -->
    <path d="M 196 128 L 316 128 L 306 112 L 206 112 Z" fill="#111111" />
    <path d="M 216 112 L 296 112 L 288 98 L 224 98 Z" fill="#111111" />
    
    <!-- Spire body (Left facet dark #111111, Right facet slightly lighter #2A2A2A for 3D monument depth) -->
    <path d="M 224 98 L 256 98 L 256 16 L 236 98 Z" fill="#111111" />
    <path d="M 256 98 L 288 98 L 276 98 L 256 16 Z" fill="#2A2A2A" />
    <path d="M 236 98 L 256 98 L 256 16 Z" fill="#111111" />
    <path d="M 256 98 L 276 98 L 256 16 Z" fill="#333333" />
    <!-- Monument spire cap highlight -->
    <polygon points="256,12 250,28 262,28" fill="#111111" />

    <!-- 2. BOLD RED LETTER 'M' (Huruf M Merah - #D60000) -->
    <!-- Left outer pillar -->
    <path d="M 44 140 L 124 140 L 124 472 L 44 472 Z" fill="#D60000" />
    <!-- Right outer pillar -->
    <path d="M 388 140 L 468 140 L 468 472 L 388 472 Z" fill="#D60000" />
    
    <!-- Left diagonal slope -->
    <path d="M 124 140 L 256 348 L 206 348 L 124 220 Z" fill="#D60000" />
    <!-- Right diagonal slope -->
    <path d="M 388 140 L 256 348 L 306 348 L 388 220 Z" fill="#D60000" />
    <!-- Center V junction -->
    <path d="M 206 348 L 256 424 L 306 348 L 256 320 Z" fill="#B30000" />

    <!-- Crisp black border/contour framing the M for ultra-high contrast on light/dark backgrounds -->
    <path d="M 44 140 L 124 140 L 256 348 L 388 140 L 468 140 L 468 472 L 388 472 L 388 228 L 256 436 L 124 228 L 124 472 L 44 472 Z" 
          fill="none" stroke="#111111" stroke-width="12" stroke-linejoin="miter" stroke-miterlimit="4" />

    <!-- 3. RED PEN NIB IN CENTER (Pena Merah di Tengah) -->
    <!-- Pen Nib background plate / shadow for separation -->
    <path d="M 256 160 L 312 256 L 296 390 L 256 448 L 216 390 L 200 256 Z" fill="#111111" />
    
    <!-- Pen Nib Body (#D60000) -->
    <path d="M 256 172 L 304 256 L 288 382 L 256 436 L 224 382 L 208 256 Z" fill="#D60000" />
    
    <!-- Pen Nib Left/Right facet shading -->
    <path d="M 256 172 L 256 436 L 224 382 L 208 256 Z" fill="#E61A1A" />
    <path d="M 256 172 L 304 256 L 288 382 L 256 436 Z" fill="#B30000" />

    <!-- Breather hole (Circle in center) -->
    <circle cx="256" cy="280" r="16" fill="#111111" />
    <circle cx="256" cy="280" r="10" fill="#FFFFFF" />

    <!-- Tine slit line running down to nib tip -->
    <line x1="256" y1="296" x2="256" y2="436" stroke="#111111" stroke-width="6" stroke-linecap="round" />
    
    <!-- Pen Nib metallic highlight arc -->
    <path d="M 232 230 C 248 220, 264 220, 280 230" fill="none" stroke="#FFFFFF" stroke-width="5" opacity="0.8" stroke-linecap="round" />

  </g>
</svg>`;

async function buildFavicons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVG source for reference
  fs.writeFileSync(path.join(publicDir, 'favicon-source.svg'), svgContent, 'utf8');

  const svgBuffer = Buffer.from(svgContent);

  // Define sizes to generate
  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 }
  ];

  const generatedBuffers = {};

  for (const target of targets) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(target.size, target.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9, quality: 100 })
      .toBuffer();

    const filePath = path.join(publicDir, target.name);
    fs.writeFileSync(filePath, pngBuffer);
    generatedBuffers[target.size] = pngBuffer;
    console.log(`Generated: ${target.name} (${target.size}x${target.size})`);
  }

  // Generate 48x48 buffer for favicon.ico
  const png48 = await sharp(svgBuffer)
    .resize(48, 48, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();

  // Create favicon.ico containing 16x16, 32x32, 48x48
  const icoImages = [
    { size: 16, buffer: generatedBuffers[16] },
    { size: 32, buffer: generatedBuffers[32] },
    { size: 48, buffer: png48 }
  ];

  const icoBuffer = createIcoFromPngs(icoImages);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated: favicon.ico (16x16, 32x32, 48x48)');
}

function createIcoFromPngs(images) {
  const count = images.length;
  const headerSize = 6;
  const directorySize = 16 * count;
  let offset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const directories = [];
  const imageBuffers = [];

  for (const img of images) {
    const size = img.size;
    const buf = img.buffer;
    const dir = Buffer.alloc(16);

    dir.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    dir.writeUInt8(0, 2); // Color palette
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(buf.length, 8); // Size of image data
    dir.writeUInt32LE(offset, 12); // Offset of image data

    directories.push(dir);
    imageBuffers.push(buf);
    offset += buf.length;
  }

  return Buffer.concat([header, ...directories, ...imageBuffers]);
}

buildFavicons().catch(err => {
  console.error('Error building favicons:', err);
  process.exit(1);
});
