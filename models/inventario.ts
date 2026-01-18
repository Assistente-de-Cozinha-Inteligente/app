import { UnidadeMedida } from './receita';

export type LocalArmazenamento = 'geladeira' | 'freezer' | 'armario' | 'outro';

export type Inventario = {
  usuario_id: string;
  ingrediente_id: number;
  quantidade: number;
  unidade: UnidadeMedida;
  validade: string; // DATE format
  local: LocalArmazenamento;
};

