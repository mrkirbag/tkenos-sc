import sharp from 'sharp';

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Read and resize logo with transparent background
  const resizedLogo = await sharp('public/brand/logo.png')
    .resize({ height: 280, width: 340, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="65%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#f9aa0b" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#141414" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f9aa0b" />
          <stop offset="100%" stop-color="#e59800" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.5" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="#181818" />
      <rect width="100%" height="100%" fill="url(#bgGlow)" />

      <!-- Outer decorative frame -->
      <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#2c2c2c" stroke-width="2" />
      <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-dasharray="160 1800" />

      <!-- Left Card / Logo Container in light cream to make the black and gold logo pop -->
      <g filter="url(#shadow)">
        <rect x="80" y="125" width="380" height="380" rx="32" fill="#eeece4" />
        <rect x="80" y="125" width="380" height="380" rx="32" fill="none" stroke="#f9aa0b" stroke-width="2" />
      </g>

      <!-- Text Container on the right -->
      <g transform="translate(520, 155)">
        <!-- Location badge -->
        <rect x="0" y="0" width="310" height="42" rx="21" fill="#242424" stroke="#f9aa0b" stroke-width="1.5" />
        <circle cx="24" cy="21" r="6" fill="#f9aa0b" />
        <text x="40" y="26.5" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#f9aa0b" letter-spacing="1.2">SAN CRISTÓBAL, TÁCHIRA</text>

        <!-- Main Title -->
        <text x="0" y="95" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Los Mejores Tequeños</text>
        <text x="0" y="148" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#f9aa0b" letter-spacing="-0.5">que vas a probar</text>

        <!-- Subtitle & URL -->
        <text x="0" y="208" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#a8a8a8">Menú Digital • Pedidos a Domicilio y Pick Up</text>
        
        <g transform="translate(0, 240)">
          <rect width="300" height="48" rx="12" fill="#f9aa0b" />
          <text x="24" y="31" font-family="Plus Jakarta Sans, system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" fill="#181818" letter-spacing="0.5">www.tkeños-sc.com</text>
        </g>
      </g>
    </svg>
  `);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 24, g: 24, b: 24, alpha: 1 }
    }
  })
  .composite([
    { input: svgOverlay, top: 0, left: 0 },
    { input: resizedLogo, top: 175, left: 100 }
  ])
  .png({ quality: 92 })
  .toFile('public/brand/og-image.png');

  console.log('public/brand/og-image.png regenerated successfully!');
}

createOgImage().catch(console.error);
