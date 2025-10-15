#!/usr/bin/env node

/**
 * Gerador de Ícones PWA para VolleyPro
 * 
 * Uso:
 *   node generate-icons.js
 * 
 * Requer: npm install canvas
 */

const fs = require('fs');
const path = require('path');

// Tentar importar canvas
let canvas;
try {
  canvas = require('canvas');
} catch (error) {
  console.log('📦 Instalando dependência "canvas"...');
  console.log('Execute: npm install canvas');
  console.log('\nOu use as outras opções documentadas em GERAR_ICONES_FACIL.md');
  process.exit(1);
}

const { createCanvas } = canvas;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'public');

// Criar diretório public se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateIcon(size) {
  console.log(`🎨 Gerando ícone ${size}x${size}...`);
  
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradiente (azul VolleyPro)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#0066ff');
  gradient.addColorStop(1, '#0052cc');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Bola de vôlei branca no centro
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.32;

  // Círculo branco
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Linhas da bola de vôlei (azul)
  ctx.strokeStyle = '#0066ff';
  ctx.lineWidth = size * 0.02;

  // Linha vertical esquerda
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.quadraticCurveTo(
    centerX - radius * 0.4, centerY,
    centerX, centerY + radius
  );
  ctx.stroke();

  // Linha vertical direita
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.quadraticCurveTo(
    centerX + radius * 0.4, centerY,
    centerX, centerY + radius
  );
  ctx.stroke();

  // Linha horizontal superior
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.quadraticCurveTo(
    centerX, centerY - radius * 0.4,
    centerX + radius, centerY
  );
  ctx.stroke();

  // Linha horizontal inferior
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.quadraticCurveTo(
    centerX, centerY + radius * 0.4,
    centerX + radius, centerY
  );
  ctx.stroke();

  // Texto "VP" (apenas em ícones grandes)
  if (size >= 192) {
    ctx.fillStyle = '#0066ff';
    ctx.font = `bold ${size * 0.25}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VP', centerX, centerY);
  }

  // Salvar arquivo
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  console.log(`✅ Criado: ${filename}`);
}

console.log('🏐 Gerador de Ícones PWA - VolleyPro\n');

try {
  sizes.forEach(size => {
    generateIcon(size);
  });

  console.log('\n✅ SUCESSO! Todos os ícones foram gerados em /public/');
  console.log('\n📋 Próximos passos:');
  console.log('1. Verifique os arquivos em /public/');
  console.log('2. git add public/icon-*.png');
  console.log('3. git commit -m "feat: Add PWA icons"');
  console.log('4. git push');
  console.log('\n🚀 Após o deploy, seu PWA estará completo!');
  
} catch (error) {
  console.error('\n❌ Erro ao gerar ícones:', error.message);
  console.log('\n💡 Alternativas:');
  console.log('- Use o componente IconGenerator no browser');
  console.log('- Use https://realfavicongenerator.net/');
  console.log('- Veja GERAR_ICONES_FACIL.md para mais opções');
  process.exit(1);
}
