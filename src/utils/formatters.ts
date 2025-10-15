/**
 * Utilitários de formatação para o VolleyPro
 */

/**
 * Formata altura de centímetros para metros com vírgula (formato brasileiro)
 * @param heightInCm - Altura em centímetros (ex: 185)
 * @returns String formatada (ex: "1,85cm")
 */
export function formatHeight(heightInCm: number | string | null | undefined): string {
  if (!heightInCm) return '-';
  
  const height = typeof heightInCm === 'string' ? parseInt(heightInCm, 10) : heightInCm;
  
  if (isNaN(height) || height <= 0) return '-';
  
  // Converter de cm para formato 1,85 (1 metro e 85 centímetros)
  const meters = (height / 100).toFixed(2);
  
  // Substituir ponto por vírgula (formato brasileiro)
  return `${meters.replace('.', ',')}cm`;
}

/**
 * Formata peso com 1 casa decimal (formato brasileiro)
 * @param weightInKg - Peso em quilogramas (ex: 75.5)
 * @returns String formatada (ex: "75,5kg")
 */
export function formatWeight(weightInKg: number | string | null | undefined): string {
  if (!weightInKg) return '-';
  
  const weight = typeof weightInKg === 'string' ? parseFloat(weightInKg) : weightInKg;
  
  if (isNaN(weight) || weight <= 0) return '-';
  
  // Formatar com 1 casa decimal
  const formatted = weight.toFixed(1);
  
  // Substituir ponto por vírgula (formato brasileiro)
  return `${formatted.replace('.', ',')}kg`;
}

/**
 * Formata número com separador de milhares (formato brasileiro)
 * @param value - Número a ser formatado
 * @returns String formatada (ex: 1.234.567)
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  
  return value.toLocaleString('pt-BR');
}
