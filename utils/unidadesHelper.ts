/**
 * Helper para gerenciar unidades baseado nas categorias de ingredientes
 * Segue as regras definidas em regra_unidades.txt
 */

export type CategoriaIngrediente = 
  | 'legume'
  | 'verdura'
  | 'fruta'
  | 'proteína'
  | 'grão'
  | 'laticíneo'
  | 'tempero'
  | 'óleo_gordura'
  | 'bebida'
  | 'panificacao_massas'
  | 'congelado';

export type Unidade = 'grama' | 'kilograma' | 'litro' | 'mililitro' | 'unidade' | 'outro';

/**
 * Mapeamento de categorias para suas unidades disponíveis
 * A primeira unidade é sempre a principal
 */
const CATEGORIA_UNIDADES: Record<CategoriaIngrediente, Unidade[]> = {
  legume: ['grama', 'kilograma', 'unidade'],
  verdura: ['unidade', 'grama'],
  fruta: ['unidade', 'grama', 'kilograma'],
  proteína: ['grama', 'kilograma', 'unidade'],
  grão: ['kilograma', 'grama', 'unidade'],
  laticíneo: ['litro', 'mililitro', 'grama', 'unidade'],
  tempero: ['grama', 'mililitro', 'unidade'],
  óleo_gordura: ['mililitro', 'litro', 'grama'],
  bebida: ['litro', 'mililitro', 'unidade'],
  panificacao_massas: ['grama', 'kilograma', 'unidade'],
  congelado: ['unidade', 'grama', 'kilograma'],
};

/**
 * Retorna todas as unidades disponíveis para uma categoria
 * @param categoria Categoria do ingrediente
 * @returns Array de unidades disponíveis (a primeira é a principal)
 */
export function getUnidadesPorCategoria(categoria: CategoriaIngrediente): Unidade[] {
  return CATEGORIA_UNIDADES[categoria] || ['unidade'];
}

/**
 * Retorna a unidade principal para uma categoria
 * @param categoria Categoria do ingrediente
 * @returns Unidade principal
 */
export function getUnidadePrincipalPorCategoria(categoria: CategoriaIngrediente): Unidade {
  const unidades = getUnidadesPorCategoria(categoria);
  return unidades[0] || 'unidade';
}

/**
 * Verifica se uma unidade é válida para uma categoria
 * @param categoria Categoria do ingrediente
 * @param unidade Unidade a ser verificada
 * @returns true se a unidade é válida para a categoria
 */
export function isUnidadeValidaParaCategoria(
  categoria: CategoriaIngrediente,
  unidade: Unidade
): boolean {
  const unidades = getUnidadesPorCategoria(categoria);
  return unidades.includes(unidade);
}

/**
 * Retorna as unidades disponíveis como array de objetos {label, value}
 * Útil para componentes de seleção (Picker, etc)
 * @param categoria Categoria do ingrediente
 * @returns Array de objetos com label e value
 */
export function getUnidadesOptionsPorCategoria(categoria: CategoriaIngrediente): Array<{ label: string; value: Unidade }> {
  const unidades = getUnidadesPorCategoria(categoria);
  return unidades.map(unidade => ({
    label: unidade.charAt(0).toUpperCase() + unidade.slice(1),
    value: unidade
  }));
}

