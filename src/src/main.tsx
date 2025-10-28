import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App.tsx';
import '../styles/globals.css';

// 🔥 DESREGISTRAR Service Workers antigos que estão causando erro 404
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('🗑️ Service Worker antigo removido:', registration.scope);
    });
  });
}

// Limpar cache do navegador em produção para forçar novo build
if (import.meta.env.PROD && 'caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      if (name.includes('workbox') || name.includes('precache')) {
        caches.delete(name);
        console.log('🗑️ Cache antigo removido:', name);
      }
    });
  });
}

// REMOVER StrictMode em produção para evitar double-render
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);