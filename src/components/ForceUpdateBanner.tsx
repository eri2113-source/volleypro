import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Banner DESABILITADO - Estava causando loops de atualização
 * Mantido apenas para compatibilidade, mas não mostra nada
 */
export function ForceUpdateBanner() {
  // COMPONENTE DESABILITADO
  // Estava causando reinicializações em loop nos celulares
  return null;
}
