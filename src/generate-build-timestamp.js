#!/usr/bin/env node

/**
 * Gera um timestamp único para cada build
 * Isso força a atualização do PWA nos usuários
 */

const fs = require('fs');
const path = require('path');

const timestamp = Date.now().toString();
const timestampFile = path.join(__dirname, 'public', 'BUILD_TIMESTAMP.txt');

// Escreve o timestamp no arquivo público
fs.writeFileSync(timestampFile, timestamp, 'utf8');

console.log('✅ Build timestamp gerado:', timestamp);
console.log('📝 Arquivo:', timestampFile);

// Também atualiza o service worker
const swPath = path.join(__dirname, 'public', 'service-worker.js');

if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Substitui o placeholder pelo timestamp real
  swContent = swContent.replace(/__BUILD_TIMESTAMP__/g, timestamp);
  
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('✅ Service Worker atualizado com timestamp');
}

// Atualiza o VersionChecker
const vcPath = path.join(__dirname, 'components', 'VersionChecker.tsx');

if (fs.existsSync(vcPath)) {
  let vcContent = fs.readFileSync(vcPath, 'utf8');
  
  // Substitui o placeholder pelo timestamp real
  vcContent = vcContent.replace(/__BUILD_TIMESTAMP__/g, timestamp);
  
  fs.writeFileSync(vcPath, vcContent, 'utf8');
  console.log('✅ VersionChecker atualizado com timestamp');
}

console.log('');
console.log('🎉 Build preparado com sucesso!');
console.log('📦 Versão:', timestamp);
