import { atualizarAlergias, atualizarPerfilUsuario, atualizarPrioridades, atualizarRestricoesAlimentares, getPerfilCompleto } from '@/data/local/dao/perfilUsuarioDao';
import { Alergia, RestricaoAlimentar } from '@/models';
import { mapDBtoUI, mapUItoDB } from '@/utils/perfilOptions';
import { useCallback, useState } from 'react';

type PerfilConfigState = {
  perfilId: number | null;
  dailySuggestions: boolean;
  restricaoAlimentar: string[];
  alergias: string[];
  prioridade: string;
  nivelCozinha: string;
};

type UsePerfilConfigReturn = PerfilConfigState & {
  loadPerfil: () => Promise<void>;
  updateRestricoes: (values: string[]) => Promise<void>;
  updateAlergias: (values: string[]) => Promise<void>;
  updatePrioridade: (value: string) => Promise<void>;
  updateNivelCozinha: (value: string) => Promise<void>;
  updateDailySuggestions: (value: boolean) => Promise<void>;
};

/**
 * Hook para gerenciar estado e lógica do perfil de usuário
 */
export function usePerfilConfig(): UsePerfilConfigReturn {
  const [state, setState] = useState<PerfilConfigState>({
    perfilId: null,
    dailySuggestions: true,
    restricaoAlimentar: [],
    alergias: [],
    prioridade: 'Rapidez',
    nivelCozinha: 'Iniciante',
  });

  const loadPerfil = useCallback(async () => {
    try {
      const perfilCompleto = await getPerfilCompleto();
      if (perfilCompleto) {
        const restricoesUI = perfilCompleto.restricoes
          .map(r => mapDBtoUI.restricaoAlimentar(r))
          .filter(r => r !== 'Nenhuma');
        
        const alergiasUI = perfilCompleto.alergias
          .map(a => mapDBtoUI.alergia(a))
          .filter(a => a !== 'Nenhuma');

        setState({
          perfilId: perfilCompleto.perfil.id,
          dailySuggestions: perfilCompleto.perfil.receber_sugestao_dia,
          nivelCozinha: mapDBtoUI.nivelCozinha(perfilCompleto.perfil.nivel_cozinha),
          restricaoAlimentar: restricoesUI.length > 0 ? restricoesUI : ['Nenhuma'],
          alergias: alergiasUI.length > 0 ? alergiasUI : ['Nenhuma'],
          prioridade: perfilCompleto.prioridades.length > 0
            ? mapDBtoUI.prioridade(perfilCompleto.prioridades[0])
            : 'Rapidez',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }, []);

  const updateRestricoes = useCallback(async (values: string[]) => {
    const filtered = values.filter(v => v !== 'Nenhuma');
    const newRestricoes = filtered.length > 0 ? filtered : ['Nenhuma'];
    
    setState(prev => {
      if (prev.perfilId) {
        const restricoesDB = filtered
          .map(r => mapUItoDB.restricaoAlimentar(r))
          .filter((r): r is RestricaoAlimentar => r !== null);
        atualizarRestricoesAlimentares(prev.perfilId, restricoesDB).catch(error => {
          console.error('Erro ao salvar restrições:', error);
        });
      }
      return { ...prev, restricaoAlimentar: newRestricoes };
    });
  }, []);

  const updateAlergias = useCallback(async (values: string[]) => {
    const filtered = values.filter(v => v !== 'Nenhuma');
    const newAlergias = filtered.length > 0 ? filtered : ['Nenhuma'];
    
    setState(prev => {
      if (prev.perfilId) {
        const alergiasDB = filtered
          .map(a => mapUItoDB.alergia(a))
          .filter((a): a is Alergia => a !== null);
        atualizarAlergias(prev.perfilId, alergiasDB).catch(error => {
          console.error('Erro ao salvar alergias:', error);
        });
      }
      return { ...prev, alergias: newAlergias };
    });
  }, []);

  const updatePrioridade = useCallback(async (value: string) => {
    setState(prev => {
      if (prev.perfilId) {
        const prioridadeDB = mapUItoDB.prioridade(value);
        if (prioridadeDB) {
          atualizarPrioridades(prev.perfilId, [prioridadeDB]).catch(error => {
            console.error('Erro ao salvar prioridade:', error);
          });
        }
      }
      return { ...prev, prioridade: value };
    });
  }, []);

  const updateNivelCozinha = useCallback(async (value: string) => {
    setState(prev => {
      if (prev.perfilId) {
        const nivelDB = mapUItoDB.nivelCozinha(value);
        atualizarPerfilUsuario(nivelDB, prev.dailySuggestions).catch(error => {
          console.error('Erro ao salvar nível de cozinha:', error);
        });
      }
      return { ...prev, nivelCozinha: value };
    });
  }, []);

  const updateDailySuggestions = useCallback(async (value: boolean) => {
    setState(prev => {
      if (prev.perfilId) {
        const nivelDB = mapUItoDB.nivelCozinha(prev.nivelCozinha);
        atualizarPerfilUsuario(nivelDB, value).catch(error => {
          console.error('Erro ao salvar sugestões diárias:', error);
        });
      }
      return { ...prev, dailySuggestions: value };
    });
  }, []);

  return {
    ...state,
    loadPerfil,
    updateRestricoes,
    updateAlergias,
    updatePrioridade,
    updateNivelCozinha,
    updateDailySuggestions,
  };
}

