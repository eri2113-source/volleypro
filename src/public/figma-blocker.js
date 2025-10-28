// 🔒 BLOQUEIO FIGMA MAKE - EXECUTADO ANTES DO REACT!
// Este script executa IMEDIATAMENTE ao carregar a página
// 📊 IMPORTANTE: Preserva window.dataLayer para Google Tag Manager

(function() {
  'use strict';
  
  // 📊 PRESERVAR dataLayer do GTM antes de qualquer bloqueio
  const preservedDataLayer = window.dataLayer || [];
  
  const ALLOWED_EMAILS = [
    'eri.2113@gmail.com',
    'teste@volleypro.com'
  ];
  
  const PRODUCTION_URL = 'https://volleypro-zw96.vercel.app';
  
  // Detectar se está no Figma Make
  const hostname = window.location.hostname;
  const href = window.location.href;
  
  const isFigmaMake = 
    hostname.includes('figma.com') || 
    hostname.includes('figma.site') ||  // 🔥 CORREÇÃO CRÍTICA: Figma Make usa .figma.site
    hostname.includes('fig.ma') ||
    hostname.includes('make.fig') ||
    (hostname.includes('localhost') && !href.includes('vercel.app'));
  
  if (!isFigmaMake) {
    console.log('✅ Produção detectada - acesso liberado');
    // 📊 Garantir que dataLayer existe em produção
    window.dataLayer = window.dataLayer || [];
    return; // Não está no Figma Make, liberar
  }
  
  console.log('🔍 FIGMA MAKE DETECTADO:', hostname);
  console.log('🔒 Verificando permissões...');
  
  // Pegar email do localStorage (se existir)
  let userEmail = null;
  try {
    const authData = localStorage.getItem('supabase.auth.token');
    if (authData) {
      const parsed = JSON.parse(authData);
      userEmail = parsed?.currentSession?.user?.email || null;
    }
  } catch (e) {
    console.log('⚠️ Não foi possível verificar email:', e);
  }
  
  console.log('📧 Email detectado:', userEmail || 'NENHUM');
  
  // Verificar se tem permissão
  const hasAccess = userEmail && ALLOWED_EMAILS.includes(userEmail.toLowerCase());
  
  if (hasAccess) {
    console.log('✅ ACESSO AUTORIZADO para:', userEmail);
    // 📊 Garantir que dataLayer existe para usuários autorizados
    window.dataLayer = window.dataLayer || [];
    return; // Autorizado, liberar
  }
  
  // 🚫 SEM PERMISSÃO - BLOQUEAR E REDIRECIONAR IMEDIATAMENTE!
  console.log('🚫 ACESSO NEGADO - REDIRECIONANDO...');
  
  // 📊 IMPORTANTE: Preservar dataLayer mesmo durante bloqueio
  window.dataLayer = preservedDataLayer;
  
  // Bloquear interface criando overlay (NÃO usar innerHTML para evitar conflito com React!)
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999;';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 999999;
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        text-align: center;
        animation: slideIn 0.5s ease-out;
      ">
        <div style="
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        ">
          🔒
        </div>
        
        <h1 style="
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 10px 0;
        ">
          Ambiente de Desenvolvimento
        </h1>
        
        <p style="
          font-size: 16px;
          color: #718096;
          margin: 0 0 30px 0;
          line-height: 1.6;
        ">
          Esta área é restrita para testes internos.<br>
          Você será redirecionado para o site oficial.
        </p>
        
        <div style="
          background: #f7fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        ">
          <p style="
            font-size: 14px;
            color: #4a5568;
            margin: 0 0 10px 0;
          ">
            Conta atual:
          </p>
          <code style="
            display: block;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            color: #2d3748;
            font-family: 'Monaco', 'Courier New', monospace;
          ">
            ${userEmail || 'Não logado'}
          </code>
        </div>
        
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        ">
          <p style="
            font-size: 14px;
            color: rgba(255,255,255,0.9);
            margin: 0 0 10px 0;
          ">
            Acesse o site oficial:
          </p>
          <a href="${PRODUCTION_URL}" style="
            display: block;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            padding: 12px;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            volleypro-zw96.vercel.app
          </a>
        </div>
        
        <div style="
          background: #fff5f5;
          border-left: 4px solid #fc8181;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 30px;
          text-align: left;
        ">
          <p style="
            font-size: 14px;
            color: #c53030;
            margin: 0 0 10px 0;
            font-weight: 600;
          ">
            ⚡ Redirecionamento automático em:
          </p>
          <div style="
            font-size: 48px;
            font-weight: 700;
            color: #fc8181;
            text-align: center;
          " id="countdown">
            3
          </div>
        </div>
        
        <a href="${PRODUCTION_URL}" style="
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'">
          🚀 Ir para o Site Oficial Agora
        </a>
      </div>
    </div>
    
    <style>
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `;
  
  // Adicionar overlay ao body sem destruir conteúdo existente
  document.body.appendChild(overlay);
  
  // Countdown de 3 segundos
  let seconds = 3;
  const countdownEl = overlay.querySelector('#countdown');
  
  const timer = setInterval(() => {
    seconds--;
    if (countdownEl) {
      countdownEl.textContent = seconds;
    }
    
    if (seconds <= 0) {
      clearInterval(timer);
      console.log('🔄 REDIRECIONANDO AGORA...');
      window.location.href = PRODUCTION_URL;
    }
  }, 1000);
  
  // Impedir qualquer tentativa de contornar
  setTimeout(() => {
    if (window.location.hostname.includes('figma')) {
      window.location.href = PRODUCTION_URL;
    }
  }, 3100);
  
})();