const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/og-image.svg');
const outputPath = path.join(__dirname, '../public/og-image.png');

async function generateOGImage() {
  try {
    console.log('🎨 Converting SVG to PNG...');

    await sharp(inputPath)
      .resize(1200, 630)
      .png({ quality: 100 })
      .toFile(outputPath);

    console.log('✅ OG Image created successfully!');
    console.log(`📁 Output: ${outputPath}`);

    // Verify file size
    const stats = fs.statSync(outputPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateOGImage();
