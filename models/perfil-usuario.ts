export type NivelCozinha = 'iniciante' | 'intermediario' | 'avancado' | 'outro';

export type RestricaoAlimentar = 'vegetariano' | 'vegano' | 'sem_gluten' | 'sem_lactose' | 'outro';

export type Alergia = 'lactose' | 'gluten' | 'amendoim' | 'frutos_do_mar' | 'ovos' | 'soja' | 'outro';

export type Prioridade = 'rapidez' | 'economia' | 'saude' | 'sabor' | 'outro';

export type PerfilUsuario = {
  id: number;
  usuario_id: string;
  nivel_cozinha: NivelCozinha;
  receber_sugestao_dia: boolean;
};

export type PerfilRestricaoAlimentar = {
  perfil_id: number;
  restricao: RestricaoAlimentar;
};

export type PerfilAlergia = {
  perfil_id: number;
  alergia: Alergia;
};

export type PerfilPrioridade = {
  perfil_id: number;
  prioridade: Prioridade;
};

