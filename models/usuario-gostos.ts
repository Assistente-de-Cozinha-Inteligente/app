export type UsuarioGostos = {
  id: number;
  usuario_id: string;
  atualizado_em: number; // INTEGER timestamp
};

export type UsuarioCategoriaFavorita = {
  usuario_gosto_id: number;
  categoria_id: number;
  peso: number;
};

export type UsuarioIngredienteFavorito = {
  usuario_gosto_id: number;
  ingrediente_id: number;
  peso: number;
};

export type UsuarioIngredienteEvitado = {
  usuario_gosto_id: number;
  ingrediente_id: number;
};

