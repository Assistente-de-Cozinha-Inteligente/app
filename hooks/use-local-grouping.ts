import { useMemo } from 'react';
import { LocalIngrediente } from '@/models';
import { getNomeLocal } from '@/utils/localHelper';

type ItemWithLocal = {
  ingrediente_id: number;
  local?: LocalIngrediente;
  ingrediente?: {
    nome?: string;
    local?: LocalIngrediente;
  };
  [key: string]: any;
};

type LocalGroup<T> = {
  local: LocalIngrediente;
  itens: T[];
};

/**
 * Hook para agrupar itens por local e ordenar alfabeticamente
 */
export function useLocalGrouping<T extends ItemWithLocal>(
  items: T[],
  sortItems?: (a: T, b: T) => number
): LocalGroup<T>[] {
  return useMemo(() => {
    const grupos: Record<string, T[]> = {};

    items.forEach(item => {
      const local = item.local || item.ingrediente?.local || 'outro';
      if (!grupos[local]) {
        grupos[local] = [];
      }
      grupos[local].push(item);
    });

    // Ordena os grupos por nome do local
    return Object.entries(grupos)
      .sort(([localA], [localB]) => {
        const nomeA = getNomeLocal(localA as LocalIngrediente);
        const nomeB = getNomeLocal(localB as LocalIngrediente);
        return nomeA.localeCompare(nomeB);
      })
      .map(([local, itens]) => ({
        local: local as LocalIngrediente,
        itens: sortItems
          ? itens.sort(sortItems)
          : itens.sort((a, b) =>
              (a.ingrediente?.nome || '').localeCompare(b.ingrediente?.nome || '')
            ),
      }));
  }, [items, sortItems]);
}

