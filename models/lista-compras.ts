import { Ingrediente, LocalIngrediente } from './ingrediente';

export type ListaCompras = {
  usuario_id: string;
  ingrediente_id: number;
  ingrediente?: Ingrediente;
  marcado: boolean;
  precisa_sincronizar: boolean;
  local?: LocalIngrediente;
  atualizado_em?: number;
  deletado_em?: number;
};

