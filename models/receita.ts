export type NivelDificuldade = 'facil' | 'medio' | 'dificil';

export type UnidadeMedida = 'grama' | 'kilograma' | 'litro' | 'mililitro' | 'unidade' | 'outro';

export type Receita = {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  tempo_minutos: number;
  pessoas: number | null;
  calorias: number | null;
  proteinas: number | null;
  carboidratos: number | null;
  gorduras: number | null;
  nivel: NivelDificuldade;
};

export type ReceitaIngrediente = {
  id: number;
  receita_id: number;
  ingrediente_id: number;
  quantidade: number;
  unidade: UnidadeMedida | null;
  observacao: string | null;
};

export type ReceitaIngredienteSubstituto = {
  id: number;
  receita_ingrediente_id: number;
  ingrediente_id: number;
  quantidade: number;
  unidade: UnidadeMedida | null;
  observacao: string | null;
};

export type ReceitaEtapa = {
  id: number;
  receita_id: number;
  ordem: number;
  titulo: string;
  tempo_minutos: number;
};

export type ReceitaEtapaTarefa = {
  id: number;
  receita_etapa_id: number;
  texto: string;
  descricao: string;
};

export type ReceitaPontoAtencao = {
  id: number;
  receita_id: number;
  descricao: string;
};

export type ReceitaCategoria = {
  receita_id: number;
  categoria_id: number;
  principal: boolean;
};

