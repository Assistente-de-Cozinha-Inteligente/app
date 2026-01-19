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

export type LocalIngrediente = 
  | 'frutas_vegetais'
  | 'laticinios_queijos'
  | 'carnes_peixes'
  | 'padaria'
  | 'graos_cereais'
  | 'bebidas'
  | 'congelados'
  | 'outro';

export type Ingrediente = {
  id: number;
  nome: string;
  categoria: CategoriaIngrediente;
  local?: LocalIngrediente;
};

