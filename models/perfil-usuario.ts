export type NivelCozinha = 'iniciante' | 'intermediario' | 'avancado' | 'outro';

export type RestricaoAlimentar = 'vegetariano' | 'vegano' | 'sem_gluten' | 'sem_lactose' ;

export type Alergia = 'lactose' | 'gluten' | 'amendoim' | 'frutos_do_mar' | 'ovos' | 'soja' ;

export type Prioridade = 'rapidez' | 'economia' | 'saude';

export type PerfilUsuario = {
  id: number;
  usuario_id: string;
  nivel_cozinha: NivelCozinha;
  receber_sugestao_dia: boolean;
};

export type PerfilRestricaoAlimentar = {
  perfil_id: number;
  restricao: RestricaoAlimentar | null;
};

export type PerfilAlergia = {
  perfil_id: number;
  alergia: Alergia | null;
};

export type PerfilPrioridade = {
  perfil_id: number;
  prioridade: Prioridade | null;
};

