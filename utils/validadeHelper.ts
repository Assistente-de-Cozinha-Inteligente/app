import { Inventario, LocalIngrediente } from '@/models';

/**
 * Pesos por categoria de local para cálculo de prioridade
 * Quanto menor o peso, maior a prioridade
 */
const pesoCategoria: Record<LocalIngrediente, number> = {
  carnes_peixes: 0,
  laticinios_queijos: 1,
  frutas_vegetais: 2,
  padaria: 3,
  congelados: 4,
  graos_cereais: 6,
  bebidas: 7,
  outro: 8,
};

/**
 * Calcula o peso de prioridade de um item do inventário
 * Fórmula: peso da categoria + dias para vencer
 * Quanto menor o peso, maior a prioridade
 * 
 * @param item Item do inventário
 * @param diasRestantes Dias restantes até a validade
 * @returns Peso de prioridade (menor = mais urgente)
 */
export function calcularPesoValidade(
  item: Inventario,
  diasRestantes: number
): number {
  // Tenta pegar o local do item, se não tiver, tenta do ingrediente
  const local = item.local || item.ingrediente?.local || 'outro';
  const pesoLocal = pesoCategoria[local] ?? pesoCategoria.outro;
  return pesoLocal + diasRestantes;
}

/**
 * Filtra e ordena itens próximos de vencer (0-3 dias) por prioridade
 * Prioridade = peso da categoria + dias para vencer (menor = mais urgente)
 * 
 * @param inventario Lista de itens do inventário
 * @returns Array de itens ordenados por prioridade (mais urgente primeiro)
 */
export function getItensProximosVencerOrdenados(
  inventario: Inventario[]
): Array<{ item: Inventario; diasRestantes: number; peso: number }> {
  const agora = Date.now();

  const itensFiltrados = inventario
    .filter(item => {
      if (!item.validade) return false;
      const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
      return diasRestantes >= 0 && diasRestantes <= 3;
    })
    .map(item => {
      const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
      const peso = calcularPesoValidade(item, diasRestantes);
      return { item, diasRestantes, peso };
    });

  // Ordena por peso (menor = mais urgente)
  // Se os pesos forem iguais, ordena por dias restantes (menor = mais urgente)
  return itensFiltrados.sort((a, b) => {
    // Primeiro critério: peso (menor peso = maior prioridade)
    if (a.peso !== b.peso) {
      return a.peso - b.peso; // Menor peso primeiro
    }
    // Segundo critério: dias restantes (menor dias = maior prioridade)
    return a.diasRestantes - b.diasRestantes; // Se pesos iguais, menor dias primeiro
  });
}

/**
 * Retorna o item mais prioritário para vencer (0-3 dias)
 * 
 * @param inventario Lista de itens do inventário
 * @returns Item mais prioritário ou null se não houver
 */
export function getItemMaisPrioritario(
  inventario: Inventario[]
): { item: Inventario; diasRestantes: number } | null {
  const itensOrdenados = getItensProximosVencerOrdenados(inventario);
  if (itensOrdenados.length === 0) return null;

  const primeiro = itensOrdenados[0];
  return {
    item: primeiro.item,
    diasRestantes: primeiro.diasRestantes,
  };
}

