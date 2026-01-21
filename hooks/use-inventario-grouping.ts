import { useMemo } from 'react';
import { Inventario, LocalIngrediente } from '@/models';
import { getNomeLocal } from '@/utils/localHelper';
import { calcularPesoValidade } from '@/utils/validadeHelper';

type LocalGroup = {
  local: LocalIngrediente;
  itens: Inventario[];
  prioridade: number;
};

/**
 * Hook para agrupar itens do inventário por local com priorização por validade
 */
export function useInventarioGrouping(inventario: Inventario[]): LocalGroup[] {
  return useMemo(() => {
    const grupos: Record<string, Inventario[]> = {};
    const agora = Date.now();

    inventario.forEach(item => {
      const local = item.local || 'outro';
      if (!grupos[local]) {
        grupos[local] = [];
      }
      grupos[local].push(item);
    });

    // Calcula prioridade de cada local baseado em itens próximos de vencer
    const calcularPrioridadeLocal = (itens: Inventario[]): number => {
      if (itens.length === 0) return 999;

      const itensProximosVencer = itens.filter(item => {
        if (!item.validade) return false;
        const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
        return diasRestantes >= 0 && diasRestantes <= 3;
      });

      if (itensProximosVencer.length === 0) return 100;

      const pesos = itensProximosVencer.map(item => {
        const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
        return calcularPesoValidade(item, diasRestantes);
      });

      return Math.min(...pesos);
    };

    // Processa cada grupo
    return Object.entries(grupos)
      .map(([local, itens]) => {
        // Separa itens próximos de vencer (0-3 dias) dos demais
        const itensProximosVencer = itens.filter(item => {
          if (!item.validade) return false;
          const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
          return diasRestantes >= 0 && diasRestantes <= 3;
        });

        const itensOutros = itens.filter(item => {
          if (!item.validade) return true;
          const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
          return diasRestantes < 0 || diasRestantes > 3;
        });

        // Ordena itens próximos de vencer por prioridade
        const itensProximosOrdenados = itensProximosVencer
          .map(item => {
            const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
            const peso = calcularPesoValidade(item, diasRestantes);
            return { item, peso };
          })
          .sort((a, b) => {
            if (a.peso !== b.peso) {
              return a.peso - b.peso;
            }
            return (a.item.ingrediente?.nome || '').localeCompare(b.item.ingrediente?.nome || '');
          })
          .map(({ item }) => item);

        // Ordena demais itens alfabeticamente
        const itensOutrosOrdenados = itensOutros.sort((a, b) =>
          (a.ingrediente?.nome || '').localeCompare(b.ingrediente?.nome || '')
        );

        // Combina: primeiro os próximos de vencer, depois os demais
        const itensOrdenados = [...itensProximosOrdenados, ...itensOutrosOrdenados];

        return {
          local: local as LocalIngrediente,
          itens: itensOrdenados,
          prioridade: calcularPrioridadeLocal(itens),
        };
      })
      .sort((a, b) => {
        // Primeiro critério: prioridade (menor = mais prioritário)
        if (a.prioridade !== b.prioridade) {
          return a.prioridade - b.prioridade;
        }
        // Segundo critério: ordem alfabética
        const nomeA = getNomeLocal(a.local);
        const nomeB = getNomeLocal(b.local);
        return nomeA.localeCompare(nomeB);
      });
  }, [inventario]);
}

