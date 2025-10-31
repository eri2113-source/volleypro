#!/usr/bin/env node

/**
 * Restaura os placeholders após o build
 * para manter os arquivos versionados no Git limpos
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Restaurando placeholders...');

// Restaura o service worker
const swPath = path.join(__dirname, 'public', 'service-worker.js');

if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Substitui qualquer timestamp por placeholder
  swContent = swContent.replace(/const BUILD_TIMESTAMP = '\d+';/g, "const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';");
  swContent = swContent.replace(/const BUILD_TIMESTAMP = "__BUILD_TIMESTAMP__";/g, "const BUILD_TIMESTAMP = '__BUILD_TIMESTAMP__';");
  
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('✅ Service Worker restaurado');
}

// Restaura o VersionChecker
const vcPath = path.join(__dirname, 'components', 'VersionChecker.tsx');

if (fs.existsSync(vcPath)) {
  let vcContent = fs.readFileSync(vcPath, 'utf8');
  
  // Substitui qualquer timestamp por placeholder
  vcContent = vcContent.replace(/const CURRENT_VERSION = '\d+';/g, "const CURRENT_VERSION = '__BUILD_TIMESTAMP__';");
  vcContent = vcContent.replace(/const CURRENT_VERSION = "\d+";/g, "const CURRENT_VERSION = '__BUILD_TIMESTAMP__';");
  
  fs.writeFileSync(vcPath, vcContent, 'utf8');
  console.log('✅ VersionChecker restaurado');
}

console.log('✅ Placeholders restaurados');
