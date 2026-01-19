import { UnidadeMedida } from './receita';
import { LocalIngrediente } from './ingrediente';

export type LocalArmazenamento = 'geladeira' | 'freezer' | 'armario' | 'outro';

export type Inventario = {
  usuario_id: string;
  ingrediente_id: number;
  quantidade: number;
  unidade: UnidadeMedida;
  validade: number; // INTEGER timestamp
  precisa_sincronizar: boolean;
  local?: LocalIngrediente;
  atualizado_em?: number;
  deletado_em?: number;
};

