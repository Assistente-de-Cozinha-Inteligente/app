import { Receita } from "@/models";
import { getAllAsync } from "../database";
import { getOrCreatePerfilUsuario } from "./perfilUsuarioDao";
import { getOrCreateLocalUser } from "./usuarioDao";

export type ReceitaComScore = Receita & {
  qtd_faltantes: number;
  score_total: number;
};

type BuscarReceitasOptions = {
  limit: number;
  offset?: number;
  excluir_ids?: number[];
};

/**
 * Busca receitas seguindo as regras:
 * - Restrições alimentares: FILTRO OBRIGATÓRIO - só mostra receitas que têm pelo menos uma das restrições do usuário
 * - Alergias: FILTRO OBRIGATÓRIO - exclui receitas que têm qualquer alergia do usuário
 * - Prioridades: PRIORIZAÇÃO (score) - não obrigatório
 * - Nível: PRIORIZAÇÃO (score) - não obrigatório
 * - Ingredientes: PRIORIZAÇÃO (score) - receitas com ingredientes aparecem primeiro, mas não obrigatório
 * - Sempre retorna algo (a menos que bloqueado por restrição/alergia)
 * 
 * @param options - Opções de busca: limit (obrigatório), offset (opcional), excluir_ids (opcional)
 */
async function buscarReceitas(options: BuscarReceitasOptions | number): Promise<ReceitaComScore[]> {
  // Suporta tanto objeto quanto número para compatibilidade
  const opts: BuscarReceitasOptions = typeof options === 'number' 
    ? { limit: options }
    : options;
  
  const { limit, offset = 0, excluir_ids = [] } = opts;
  // Busca usuário e perfil automaticamente
  const usuario = await getOrCreateLocalUser();
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const perfil = await getOrCreatePerfilUsuario();
  if (!perfil) {
    throw new Error("Perfil não encontrado");
  }

  const usuarioId = usuario.id;
  const perfilId = perfil.id;

  // Filtro de restrições alimentares: OBRIGATÓRIO
  // Se o usuário tem restrições, só mostra receitas que têm pelo menos uma das restrições
  const restricaoFilter = `
    AND (
      -- Se o usuário não tem restrições, mostra todas as receitas
      NOT EXISTS (
        SELECT 1 FROM perfil_restricoes_alimentares pra 
        WHERE pra.perfil_id = ?
        AND pra.restricao IS NOT NULL
        AND pra.restricao != ''
      )
      OR
      -- Se o usuário tem restrições, mostra apenas receitas que têm pelo menos uma das restrições do usuário
      EXISTS (
        SELECT 1 FROM receita_restricoes rr
        WHERE rr.receita_id = r.id
        AND EXISTS (
          SELECT 1 FROM perfil_restricoes_alimentares pra 
          WHERE pra.perfil_id = ?
          AND pra.restricao = rr.restricao
          AND pra.restricao IS NOT NULL
          AND pra.restricao != ''
        )
      )
    )`;

  // Filtro de alergias: OBRIGATÓRIO
  // Exclui receitas que contêm qualquer alergia do usuário
  const alergiaFilter = `
    AND NOT EXISTS (
      SELECT 1 FROM receita_alergias ra
      INNER JOIN perfil_alergias pa 
        ON ra.alergia = pa.alergia
      WHERE ra.receita_id = r.id
      AND pa.perfil_id = ?
      AND pa.alergia IS NOT NULL
    )`;

  // Filtro para excluir IDs específicos
  const excluirIdsFilter = excluir_ids.length > 0
    ? `AND r.id NOT IN (${excluir_ids.map(() => '?').join(',')})`
    : '';

  // Score de ingredientes: PRIORIZAÇÃO (não obrigatório)
  // Receitas com ingredientes disponíveis ganham pontos
  const ingredienteScore = `
    SELECT
      ri.receita_id,
      SUM(
        CASE
          WHEN inv.disponibilidade IS NULL THEN 
            -- Penaliza ingredientes faltantes baseado no papel
            CASE ri.papel
              WHEN 'base' THEN -10
              WHEN 'principal' THEN -8
              WHEN 'secundario' THEN -5
              WHEN 'complemento' THEN -3
              WHEN 'tempero' THEN -2
            END
          WHEN (
            CASE inv.disponibilidade
              WHEN 'baixo' THEN 1
              WHEN 'medio' THEN 2
              WHEN 'alto' THEN 3
            END
          ) <
          (
            CASE ri.papel
              WHEN 'base' THEN 3
              WHEN 'principal' THEN 2
              WHEN 'secundario' THEN 2
              WHEN 'complemento' THEN 1
              WHEN 'tempero' THEN 1
            END
          )
          THEN -2
          ELSE
            -- Recompensa ingredientes disponíveis
            CASE ri.papel
              WHEN 'base' THEN 10
              WHEN 'principal' THEN 8
              WHEN 'secundario' THEN 5
              WHEN 'complemento' THEN 3
              WHEN 'tempero' THEN 2
            END
        END
      ) AS score_ingredientes,
      SUM(
        CASE
          WHEN inv.disponibilidade IS NULL THEN 1
          ELSE 0
        END
      ) AS qtd_faltantes,
      SUM(
        CASE
          WHEN inv.disponibilidade IS NOT NULL THEN 1
          ELSE 0
        END
      ) AS qtd_disponiveis
    FROM receita_ingredientes ri
    LEFT JOIN inventario inv
      ON inv.ingrediente_id = ri.ingrediente_id
     AND inv.usuario_id = ?
     AND inv.deletado_em IS NULL
    GROUP BY ri.receita_id
  `;

  // Score de prioridades: PRIORIZAÇÃO (não obrigatório)
  const prioridadeScore = `
    SELECT
      rp.receita_id,
      SUM(
        CASE
          WHEN pp.prioridade IS NOT NULL THEN 3
          ELSE 0
        END
      ) AS score_prioridades
    FROM receita_prioridades rp
    LEFT JOIN perfil_prioridades pp
      ON rp.prioridade = pp.prioridade
     AND pp.perfil_id = ?
    GROUP BY rp.receita_id
  `;

  // Score de nível: PRIORIZAÇÃO (não obrigatório)
  const nivelScore = `
    SELECT
      rn.receita_id,
      SUM(
        CASE
          WHEN pu.nivel_cozinha = 'iniciante' AND rn.nivel = 'iniciante' THEN 5
          WHEN pu.nivel_cozinha = 'intermediario' AND rn.nivel IN ('iniciante', 'intermediario') THEN 
            CASE WHEN rn.nivel = 'intermediario' THEN 5 ELSE 3 END
          WHEN pu.nivel_cozinha = 'avancado' AND rn.nivel IN ('iniciante', 'intermediario', 'avancado') THEN
            CASE 
              WHEN rn.nivel = 'avancado' THEN 5
              WHEN rn.nivel = 'intermediario' THEN 3
              ELSE 1
            END
          WHEN pu.nivel_cozinha = 'outro' AND rn.nivel = 'iniciante' THEN 5
          ELSE 0
        END
      ) AS score_nivel
    FROM receita_niveis rn
    LEFT JOIN perfis_usuario pu ON pu.id = ?
    GROUP BY rn.receita_id
  `;

  const query = `
    WITH
    ingrediente_score AS (${ingredienteScore}),
    prioridade_score AS (${prioridadeScore}),
    nivel_score AS (${nivelScore})

    SELECT
      r.id,
      r.nome,
      r.descricao,
      r.imagem,
      r.tempo_minutos,
      r.pessoas,
      r.calorias,
      r.proteinas,
      r.carboidratos,
      r.gorduras,
      COALESCE(iscore.qtd_faltantes, 0) AS qtd_faltantes,
      COALESCE(iscore.qtd_disponiveis, 0) AS qtd_disponiveis,
      (
        COALESCE(iscore.score_ingredientes, 0)
        + COALESCE(ps.score_prioridades, 0)
        + COALESCE(ns.score_nivel, 0)
      ) AS score_total
    FROM receitas r
    LEFT JOIN ingrediente_score iscore ON iscore.receita_id = r.id
    LEFT JOIN prioridade_score ps ON ps.receita_id = r.id
    LEFT JOIN nivel_score ns ON ns.receita_id = r.id
    WHERE 1=1
      ${restricaoFilter}
      ${alergiaFilter}
      ${excluirIdsFilter}
    ORDER BY 
      -- Prioriza receitas que podem ser feitas completamente
      CASE WHEN iscore.qtd_faltantes = 0 THEN 0 ELSE 1 END ASC,
      -- Prioriza receitas com mais ingredientes disponíveis no inventário
      iscore.qtd_disponiveis DESC,
      -- Depois ordena por score total
      score_total DESC,
      -- Como critério de desempate, menos faltantes
      iscore.qtd_faltantes ASC
    LIMIT ? OFFSET ?;
  `;

  const params: any[] = [
    usuarioId,        // Para inventario
    perfilId,         // Para prioridades
    perfilId,         // Para nível score
    perfilId,         // Primeiro check de restrições (NOT EXISTS)
    perfilId,         // Segundo check de restrições (EXISTS)
    perfilId,         // Para alergias
  ];

  // Adiciona IDs para excluir se houver
  if (excluir_ids.length > 0) {
    params.push(...excluir_ids);
  }

  // Adiciona limit e offset
  params.push(limit, offset);

  return getAllAsync<ReceitaComScore>(query, params);
}

export async function buscarTop3ReceitasPossiveis(): Promise<ReceitaComScore[]> {
  return buscarReceitas({ limit: 3 });
}

export async function buscarReceitasHomePaginacao(
  offset: number, 
  limit: number, 
  excluir_ids?: number[]
): Promise<ReceitaComScore[]> {
  return buscarReceitas({
    limit,
    offset,
    excluir_ids,
  });
}

/**
 * Busca a categoria principal de uma receita
 * @param receitaId ID da receita
 * @returns Nome da categoria principal ou 'Geral' se não encontrar
 */
export async function buscarCategoriaPrincipal(receitaId: number): Promise<string> {
  const query = `
    SELECT c.nome
    FROM receitas_categorias rc
    INNER JOIN categorias c ON c.id = rc.categoria_id
    WHERE rc.receita_id = ?
      AND rc.principal = 1
    LIMIT 1
  `;

  const result = await getAllAsync<{ nome: string }>(query, [receitaId]);
  
  return result.length > 0 ? result[0].nome : 'Geral';
}
