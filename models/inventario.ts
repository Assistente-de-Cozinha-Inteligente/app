import { Ingrediente, LocalIngrediente } from './ingrediente';

export type Disponibilidade = 'baixo' | 'medio' | 'alto';

export type Inventario = {
  usuario_id: string;
  ingrediente_id: number;
  ingrediente?: Ingrediente;
  disponibilidade: Disponibilidade;
  validade: number | null; // INTEGER timestamp (opcional)
  local?: LocalIngrediente;
  precisa_sincronizar: boolean;
  atualizado_em?: number;
  deletado_em?: number;
};

