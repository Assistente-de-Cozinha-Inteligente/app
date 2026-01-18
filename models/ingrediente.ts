export type CategoriaIngrediente = 'proteina' | 'vegetal' | 'fruta' | 'legume' | 'grao' | 'bebida' | 'outro';

export type Ingrediente = {
  id: number;
  nome: string;
  categoria: CategoriaIngrediente | null;
};

