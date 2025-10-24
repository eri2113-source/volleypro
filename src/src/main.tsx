import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App.tsx';
import '../styles/globals.css';

// ⚠️ Service Worker DESATIVADO temporariamente até deploy correto
// Será reativado após commit/push do arquivo service-worker.js
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });
  });
}
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);