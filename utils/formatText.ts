/**
 * Utilitários para formatação de texto
 */

const MAX_LENGTH = 25; // Limite de caracteres para exibição

/**
 * Formata uma lista de strings para exibição, truncando se necessário
 */
export function formatListForDisplay(list: string[], excludeValue?: string): string {
  const filtered = excludeValue 
    ? list.filter(item => item !== excludeValue)
    : list;
  
  if (filtered.length === 0) return excludeValue || 'Nenhuma';

  const text = filtered.join(', ');

  if (text.length <= MAX_LENGTH) return text;

  // Tenta mostrar pelo menos 2 itens
  if (filtered.length <= 2) {
    return `${text.substring(0, MAX_LENGTH - 3)}...`;
  }

  // Mostra os primeiros itens que cabem no limite
  let result = '';
  for (let i = 0; i < filtered.length; i++) {
    const nextItem = i === 0 ? filtered[i] : `, ${filtered[i]}`;
    if ((result + nextItem).length <= MAX_LENGTH - 3) {
      result += nextItem;
    } else {
      break;
    }
  }
  return `${result}...`;
}

