import { LocalIngrediente } from '@/models';

/**
 * Mapeia os valores de LocalIngrediente para nomes formatados e legíveis
 */
const localNames: Record<LocalIngrediente, string> = {
  frutas_vegetais: 'Frutas e Vegetais',
  laticinios_queijos: 'Laticínios e Queijos',
  carnes_peixes: 'Carnes e Peixes',
  padaria: 'Padaria',
  graos_cereais: 'Grãos e Cereais',
  bebidas: 'Bebidas',
  congelados: 'Congelados',
  outro: 'Outro',
};

/**
 * Traduz um valor de LocalIngrediente para um nome formatado e legível
 * @param local Valor do local (pode ser undefined)
 * @returns Nome formatado do local ou 'Outro' se não fornecido
 */
export function getNomeLocal(local?: LocalIngrediente): string {
  if (!local) {
    return localNames.outro;
  }
  return localNames[local] || localNames.outro;
}

/**
 * Retorna todos os locais disponíveis com seus nomes formatados
 * @returns Array de objetos com valor e nome do local
 */
export function getLocaisDisponiveis(): Array<{ value: LocalIngrediente; nome: string }> {
  return Object.entries(localNames).map(([value, nome]) => ({
    value: value as LocalIngrediente,
    nome,
  }));
}

