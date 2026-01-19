import { Ingrediente, LocalIngrediente } from './ingrediente';
import { UnidadeMedida } from './receita';

export type LocalArmazenamento = 'geladeira' | 'freezer' | 'armario' | 'outro';

export type Inventario = {
  usuario_id: string;
  ingrediente_id: number;
  ingrediente?: Ingrediente;
  quantidade: number;
  unidade: UnidadeMedida;
  validade: number | null; // INTEGER timestamp (opcional)
  precisa_sincronizar: boolean;
  local?: LocalIngrediente;
  atualizado_em?: number;
  deletado_em?: number;
};

