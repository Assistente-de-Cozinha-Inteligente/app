// disponibilidade.ts

import { Disponibilidade } from "@/models";

/**
 * Disponibilidade representa a CONFIANÇA
 * de que o ingrediente está disponível para uso,
 * NÃO quantidade exata.
 */

/**
 * Forma como o ingrediente foi adicionado
 */
export type OrigemAdicao =
  | 'manual'
  | 'compra'
  | 'compra_repetida';

/**
 * Configurações de tempo (em dias)
 */
const DIAS_PARA_DIMINUIR_DE_ALTO = 30;
const DIAS_PARA_DIMINUIR_DE_MEDIO = 60;

/* =======================
   DISPONIBILIDADE
======================= */

export function disponibilidadeInicial(
  origem: OrigemAdicao
): Disponibilidade {
  switch (origem) {
    case 'manual':
      return 'baixo';
    case 'compra':
      return 'medio';
    case 'compra_repetida':
      return 'alto';
    default:
      return 'baixo';
  }
}

export function aumentarDisponibilidade(
  atual: Disponibilidade
): Disponibilidade {
  if (atual === 'baixo') return 'medio';
  if (atual === 'medio') return 'alto';
  return 'alto';
}

export function diminuirDisponibilidadePorTempo(
  atual: Disponibilidade,
  diasSemAtualizacao: number
): Disponibilidade {
  if (atual === 'alto' && diasSemAtualizacao >= DIAS_PARA_DIMINUIR_DE_ALTO) {
    return 'medio';
  }

  if (atual === 'medio' && diasSemAtualizacao >= DIAS_PARA_DIMINUIR_DE_MEDIO) {
    return 'baixo';
  }

  return atual;
}

export function decidirDisponibilidadeFinal(params: {
  disponibilidadeAtual?: Disponibilidade;
  origemAdicao: OrigemAdicao;
  diasSemAtualizacao?: number;
}): Disponibilidade {
  const {
    disponibilidadeAtual,
    origemAdicao,
    diasSemAtualizacao = 0,
  } = params;

  if (!disponibilidadeAtual) {
    return disponibilidadeInicial(origemAdicao);
  }

  if (origemAdicao === 'compra' || origemAdicao === 'compra_repetida') {
    return aumentarDisponibilidade(disponibilidadeAtual);
  }

  return diminuirDisponibilidadePorTempo(
    disponibilidadeAtual,
    diasSemAtualizacao
  );
}

export function pesoDisponibilidade(d: Disponibilidade): number {
  switch (d) {
    case 'baixo':
      return 1;
    case 'medio':
      return 2;
    case 'alto':
      return 3;
    default:
      return 1;
  }
}

/* =======================
   DECISÃO DE RECEITA
======================= */

/**
 * Papel do ingrediente dentro da receita
 */
export type PapelIngrediente =
  | 'base'
  | 'principal'
  | 'secundario'
  | 'complemento'
  | 'tempero';

/**
 * Status final do ingrediente na receita
 */
export type StatusIngredienteReceita =
  | 'PODE_FAZER'
  | 'TALVEZ_FALTE'
  | 'FALTA_INGREDIENTE';

/**
 * Converte o papel do ingrediente em exigência numérica
 *
 * Quanto maior o número, maior a dependência da receita
 */
function pesoExigenciaPorPapel(papel: PapelIngrediente): number {
  switch (papel) {
    case 'base':
      return 3;
    case 'principal':
      return 2;
    case 'secundario':
      return 2;
    case 'complemento':
      return 1;
    case 'tempero':
      return 1;
    default:
      return 1;
  }
}

/**
 * Decide o status de UM ingrediente dentro de UMA receita
 *
 * QUANDO USAR:
 * - Durante a avaliação de receitas
 * - Durante busca
 * - Durante exibição do detalhe da receita
 *
 * REGRAS:
 * - Se não existe no inventário → FALTA_INGREDIENTE
 * - Se existe mas disponibilidade < exigência → TALVEZ_FALTE
 * - Caso contrário → PODE_FAZER
 */
export function decidirStatusIngredienteReceita(params: {
  papel: PapelIngrediente;
  disponibilidade?: Disponibilidade; // undefined = não existe na cozinha
}): StatusIngredienteReceita {
  const { papel, disponibilidade } = params;

  if (!disponibilidade) {
    return 'FALTA_INGREDIENTE';
  }

  const exigencia = pesoExigenciaPorPapel(papel);
  const peso = pesoDisponibilidade(disponibilidade);

  if (peso < exigencia) {
    return 'TALVEZ_FALTE';
  }

  return 'PODE_FAZER';
}


/* ============================================================================
   USO DO ARQUIVO disponibilidade.ts
   ----------------------------------------------------------------------------
   Este arquivo é a FONTE ÚNICA DA VERDADE para qualquer decisão relacionada a:
   - inventário (cozinha)
   - disponibilidade de ingredientes
   - avaliação de receitas
   - status "Pode fazer / Talvez falte / Falta ingrediente"

   SEMPRE que o app precisar responder:
   "isso dá pra fazer?" ou "isso provavelmente existe?",
   este arquivo deve ser utilizado.
============================================================================ */

/* ---------------------------------------------------------------------------
1) ADIÇÃO MANUAL DE INGREDIENTE NA COZINHA
---------------------------------------------------------------------------

QUANDO:
- Usuário adiciona um ingrediente manualmente
- Ex: "Tenho ovo", "Tenho arroz"

COMO:
- Chamar decidirDisponibilidadeFinal()

USO:
decidirDisponibilidadeFinal({
  origemAdicao: 'manual'
})

RESULTADO:
- Ingrediente entra com disponibilidade = 'baixo'

MOTIVO:
- Pode ser apenas um resto ou pouca quantidade
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
2) ENVIO DA LISTA DE COMPRAS PARA A COZINHA (PRIMEIRA VEZ)
---------------------------------------------------------------------------

QUANDO:
- Usuário marca um item da lista de compras como comprado
- Ingrediente ainda não existe no inventário

COMO:
- Chamar decidirDisponibilidadeFinal()

USO:
decidirDisponibilidadeFinal({
  origemAdicao: 'compra'
})

RESULTADO:
- Ingrediente entra com disponibilidade = 'medio'

MOTIVO:
- Compra recente indica quantidade padrão
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
3) ENVIO DA LISTA DE COMPRAS PARA A COZINHA (INGREDIENTE JÁ EXISTE)
---------------------------------------------------------------------------

QUANDO:
- Usuário compra novamente um ingrediente já existente

COMO:
- Chamar decidirDisponibilidadeFinal()
- Informar disponibilidadeAtual

USO:
decidirDisponibilidadeFinal({
  disponibilidadeAtual,
  origemAdicao: 'compra'
})

RESULTADO:
- baixo → medio
- medio → alto
- alto → alto

MOTIVO:
- Compra reforça a confiança de disponibilidade
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
4) COMPRA REPETIDA EM POUCO TEMPO
---------------------------------------------------------------------------

QUANDO:
- Mesmo ingrediente comprado várias vezes em sequência

COMO:
- Chamar decidirDisponibilidadeFinal()
- Usar origem 'compra_repetida'

USO:
decidirDisponibilidadeFinal({
  disponibilidadeAtual,
  origemAdicao: 'compra_repetida'
})

RESULTADO:
- Disponibilidade vai para 'alto'

MOTIVO:
- Alta confiança de abundância
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
5) PASSAGEM DO TEMPO SEM ATUALIZAÇÃO
---------------------------------------------------------------------------

QUANDO:
- Ao abrir o app
- Antes de calcular status de receitas
- Em rotinas de manutenção offline

COMO:
- Chamar diminuirDisponibilidadePorTempo()

USO:
diminuirDisponibilidadePorTempo(
  disponibilidadeAtual,
  diasSemAtualizacao
)

RESULTADO:
- alto → medio após X dias
- medio → baixo após Y dias

OBSERVAÇÃO:
- O ingrediente NÃO é removido
- Apenas a confiança diminui
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
6) BUSCA E LISTAGEM DE RECEITAS
---------------------------------------------------------------------------

QUANDO:
- Usuário pesquisa receitas
- Lista de resultados é exibida

COMO:
- Para CADA ingrediente da receita, chamar:
  decidirStatusIngredienteReceita()

USO:
decidirStatusIngredienteReceita({
  papel,
  disponibilidade
})

RESULTADO POR INGREDIENTE:
- PODE_FAZER
- TALVEZ_FALTE
- FALTA_INGREDIENTE
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
7) DEFINIÇÃO DO STATUS FINAL DA RECEITA
---------------------------------------------------------------------------

QUANDO:
- Exibir card da receita
- Ordenar resultados
- Mostrar status visual

COMO:
- Consolidar os status dos ingredientes

REGRA:
- Se algum ingrediente = FALTA_INGREDIENTE → 🔴 Falta ingrediente
- Senão, se algum = TALVEZ_FALTE → 🟡 Talvez falte algo
- Senão → 🟢 Pode fazer
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
8) DETALHE DA RECEITA (ANTES DE COZINHAR)
---------------------------------------------------------------------------

QUANDO:
- Usuário abre a receita

COMO:
- Reavaliar ingredientes com decidirStatusIngredienteReceita()

RESULTADO:
- Mostrar aviso leve se necessário
- Sugerir adicionar item à lista de compras
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
REGRA FINAL (NUNCA QUEBRAR)
---------------------------------------------------------------------------

- Compra aumenta disponibilidade
- Tempo diminui disponibilidade
- Receita nunca subtrai nada do inventário
- Usuário nunca gerencia quantidade
- Inventário NÃO é estoque exato
- Toda decisão passa por este arquivo

Este arquivo centraliza:
- previsibilidade
- simplicidade
- explicabilidade
- coerência de produto
--------------------------------------------------------------------------- */
