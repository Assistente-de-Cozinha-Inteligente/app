import * as tabelasSchema from '@/data/local/tabelas.json';
import { Alergia, NivelCozinha, Prioridade, RestricaoAlimentar } from '@/models';

/**
 * Extrai valores de CHECK constraints de uma definição de tabela
 */
function extractCheckValues(checkConstraint: string): string[] {
  // Procura por padrão: CHECK (campo IN ('valor1','valor2',...))
  const match = checkConstraint.match(/IN\s*\(([^)]+)\)/);
  if (!match) return [];
  
  // Extrai os valores entre aspas simples
  const values = match[1]
    .split(',')
    .map(v => v.trim().replace(/^'|'$/g, ''))
    .filter(v => v !== 'outro'); // Remove 'outro' pois não é uma opção válida para UI
  
  return values;
}

/**
 * Mapeia valores do banco para valores da UI
 */
export const mapDBtoUI = {
  restricaoAlimentar: (db: RestricaoAlimentar): string => {
    const map: Record<RestricaoAlimentar, string> = {
      'vegetariano': 'Vegetariano',
      'vegano': 'Vegano',
      'sem_gluten': 'Sem glúten',
      'sem_lactose': 'Sem lactose',
      'outro': 'Nenhuma',
    };
    return map[db] || 'Nenhuma';
  },
  alergia: (db: Alergia): string => {
    const map: Record<Alergia, string> = {
      'lactose': 'Lactose',
      'gluten': 'Glúten',
      'amendoim': 'Amendoim',
      'frutos_do_mar': 'Frutos do mar',
      'ovos': 'Ovos',
      'soja': 'Soja',
      'outro': 'Nenhuma',
    };
    return map[db] || 'Nenhuma';
  },
  prioridade: (db: Prioridade): string => {
    const map: Record<Prioridade, string> = {
      'rapidez': 'Rapidez',
      'economia': 'Economia',
      'saude': 'Saúde',
      'sabor': 'Sabor',
      'outro': 'Nenhuma',
    };
    return map[db] || 'Nenhuma';
  },
  nivelCozinha: (db: NivelCozinha): string => {
    const map: Record<NivelCozinha, string> = {
      'iniciante': 'Iniciante',
      'intermediario': 'Intermediário',
      'avancado': 'Avançado',
      'outro': 'Outro',
    };
    return map[db] || 'Iniciante';
  },
};


// Mapeamento UI -> DB
export const mapUItoDB = {
  restricaoAlimentar: (ui: string): RestricaoAlimentar | null => {
    const map: Record<string, RestricaoAlimentar> = {
      'Vegetariano': 'vegetariano',
      'Vegano': 'vegano',
      'Sem glúten': 'sem_gluten',
      'Sem lactose': 'sem_lactose',
    };
    return map[ui] || null;
  },
  alergia: (ui: string): Alergia | null => {
    const map: Record<string, Alergia> = {
      'Lactose': 'lactose',
      'Glúten': 'gluten',
      'Amendoim': 'amendoim',
      'Frutos do mar': 'frutos_do_mar',
      'Ovos': 'ovos',
      'Soja': 'soja',
    };
    return map[ui] || null;
  },
  prioridade: (ui: string): Prioridade | null => {
    const map: Record<string, Prioridade> = {
      'Rapidez': 'rapidez',
      'Economia': 'economia',
      'Saúde': 'saude',
      'Sabor': 'sabor',
    };
    return map[ui] || null;
  },
  nivelCozinha: (ui: string): NivelCozinha => {
    const map: Record<string, NivelCozinha> = {
      'Iniciante': 'iniciante',
      'Intermediário': 'intermediario',
      'Avançado': 'avancado',
      'Outro': 'outro',
    };
    return map[ui] || 'iniciante';
  },
};

/**
 * Obtém opções de restrições alimentares baseadas no schema do banco
 */
export function getRestricoesAlimentaresOptions(): string[] {
  const tabela = tabelasSchema.perfil_restricoes_alimentares?.[0];
  if (!tabela?.restricao) return ['Nenhuma'];
  
  const dbValues = extractCheckValues(tabela.restricao);
  const uiValues = dbValues.map(v => mapDBtoUI.restricaoAlimentar(v as RestricaoAlimentar));
  
  // Adiciona "Nenhuma" no início
  return ['Nenhuma', ...uiValues];
}

/**
 * Obtém opções de alergias baseadas no schema do banco
 */
export function getAlergiasOptions(): string[] {
  const tabela = tabelasSchema.perfil_alergias?.[0];
  if (!tabela?.alergia) return ['Nenhuma'];
  
  const dbValues = extractCheckValues(tabela.alergia);
  const uiValues = dbValues.map(v => mapDBtoUI.alergia(v as Alergia));
  
  // Adiciona "Nenhuma" no início
  return ['Nenhuma', ...uiValues];
}

/**
 * Obtém opções de prioridades baseadas no schema do banco
 */
export function getPrioridadesOptions(): string[] {
  const tabela = tabelasSchema.perfil_prioridades?.[0];
  if (!tabela?.prioridade) return ['Rapidez'];
  
  const dbValues = extractCheckValues(tabela.prioridade);
  const uiValues = dbValues.map(v => mapDBtoUI.prioridade(v as Prioridade));
  
  return uiValues;
}

/**
 * Obtém opções de nível de cozinha baseadas no schema do banco
 */
export function getNivelCozinhaOptions(): string[] {
  const tabela = tabelasSchema.perfis_usuario?.[0];
  if (!tabela?.nivel_cozinha) return ['Iniciante'];
  
  const dbValues = extractCheckValues(tabela.nivel_cozinha);
  const uiValues = dbValues.map(v => mapDBtoUI.nivelCozinha(v as NivelCozinha));
  
  return uiValues;
}

/**
 * Retorna todas as opções de recomendação
 */
export function getRecomendacoesOptions() {
  return {
    restricaoAlimentar: getRestricoesAlimentaresOptions(),
    alergias: getAlergiasOptions(),
    prioridade: getPrioridadesOptions(),
    nivelCozinha: getNivelCozinhaOptions(),
  };
}

