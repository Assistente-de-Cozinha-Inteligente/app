import { LocalArmazenamento } from './inventario';

export type ListaCompras = {
  usuario_id: string;
  ingrediente_id: number;
  quantidade: number;
  local: LocalArmazenamento;
  marcado: boolean;
};

