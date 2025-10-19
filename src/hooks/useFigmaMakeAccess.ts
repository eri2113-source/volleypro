import { useEffect, useState } from 'react';

const ALLOWED_EMAILS = [
  'eri.2113@gmail.com',
  'teste@volleypro.com'
];

const PRODUCTION_URL = 'https://volleypro-zw96.vercel.app';

export function useFigmaMakeAccess(userEmail: string | null) {
  const [isFigmaMake, setIsFigmaMake] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Detectar se está no Figma Make
    const hostname = window.location.hostname;
    const href = window.location.href;
    
    const isFigma = 
      hostname.includes('figma.com') || 
      hostname.includes('fig.ma') ||
      (hostname.includes('localhost') && !href.includes('vercel.app')) ||
      hostname.includes('make.fig');
    
    setIsFigmaMake(isFigma);

    if (!isFigma) {
      // Não está no Figma Make = LIBERAR
      setHasAccess(true);
      setIsChecking(false);
      return;
    }

    // Está no Figma Make - verificar permissão
    console.log('🔍 Figma Make detectado. Verificando acesso para:', userEmail || 'não logado');

    // 🔒 REGRA: Bloquear TODOS exceto emails autorizados
    if (!userEmail) {
      // Sem login = SEM ACESSO
      console.log('🚫 BLOQUEADO: Usuário não está logado');
      setHasAccess(false);
      setIsChecking(false);
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        console.log('🔄 Redirecionando para produção...');
        window.location.href = PRODUCTION_URL;
      }, 3000);
      return;
    }

    if (!ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
      // Email não autorizado = SEM ACESSO
      console.log('🚫 BLOQUEADO: Email não autorizado -', userEmail);
      setHasAccess(false);
      setIsChecking(false);
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        console.log('🔄 Redirecionando para produção...');
        window.location.href = PRODUCTION_URL;
      }, 3000);
      return;
    }

    // Email autorizado = ACESSO LIBERADO
    console.log('✅ AUTORIZADO: Acesso liberado para', userEmail);
    setHasAccess(true);
    setIsChecking(false);
  }, [userEmail]);

  return { isFigmaMake, hasAccess, isChecking };
}
