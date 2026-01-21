import { Ingrediente, Inventario } from "@/models";
import { decidirDisponibilidadeFinal, diminuirDisponibilidadePorTempo, OrigemAdicao } from "@/utils/disponibilidade";
import { getDatabase, getFirstAsync } from "../database";
import { getOrCreateLocalUser } from "./usuarioDao";

const TABLE_NAME = 'inventario';

/*
 * Obtém o inventário do usuário
 * @returns Lista de itens do inventário
 */
export async function getInventario(): Promise<Inventario[]> {
    const db = getDatabase();
    const result = await db?.getAllAsync<any>(
        `SELECT 
            inv.usuario_id, 
            inv.ingrediente_id, 
            inv.disponibilidade,
            inv.validade,
            inv.precisa_sincronizar,
            inv.local,
            inv.atualizado_em, 
            inv.deletado_em,
            i.id as ingrediente_id_join,
            i.nome as ingrediente_nome,
            i.categoria as ingrediente_categoria,
            i.local as ingrediente_local
        FROM ${TABLE_NAME} inv
        INNER JOIN ingredientes i ON inv.ingrediente_id = i.id
        WHERE inv.deletado_em IS NULL
        ORDER BY i.nome ASC`
    );

    // Mapeia os resultados para o tipo Inventario
    return (result ?? []).map((row: any) => {
        const ingrediente: Ingrediente | undefined = row.ingrediente_id_join ? {
            id: row.ingrediente_id_join,
            nome: row.ingrediente_nome,
            categoria: row.ingrediente_categoria,
            local: row.ingrediente_local
        } : undefined;

        return {
            usuario_id: row.usuario_id,
            ingrediente_id: row.ingrediente_id,
            disponibilidade: row.disponibilidade || 'medio',
            validade: row.validade || null,
            precisa_sincronizar: row.precisa_sincronizar === 1,
            local: row.local || row.ingrediente_local || undefined,
            atualizado_em: row.atualizado_em,
            deletado_em: row.deletado_em,
            ingrediente
        } as Inventario;
    });
}

/*
 * Insere ou atualiza item no inventário
 * Se já existir um item com o mesmo usuario_id e ingrediente_id, calcula a disponibilidade automaticamente
 * Caso contrário, insere um novo item
 * @param items Itens a serem inseridos ou atualizados
 * @param origemAdicao Origem da adição ('manual', 'compra', 'compra_repetida')
 */
export async function inserirAtualizarItemInventario(
    items: Omit<Inventario, 'usuario_id' | 'atualizado_em' | 'deletado_em'>[],
    origemAdicao: OrigemAdicao = 'manual'
): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const agora = Date.now();

    for (const item of items) {
        // Sempre busca o local do ingrediente no banco
        // Como todo ingrediente tem local, sempre usa o local do ingrediente
        const ingrediente = await getFirstAsync<any>(
            `SELECT local FROM ingredientes WHERE id = ?`,
            [item.ingrediente_id]
        );
        // Usa o local do ingrediente (do banco) se existir, senão usa o local do item
        const localIngrediente = ingrediente?.local;
        const localFinal = localIngrediente || item.local || null;

        // Verifica se já existe um item com o mesmo usuario_id e ingrediente_id (não deletado)
        const itemExistente = await getFirstAsync<any>(
            `SELECT usuario_id, ingrediente_id, disponibilidade, validade, precisa_sincronizar, local, atualizado_em, deletado_em
             FROM ${TABLE_NAME}
             WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
            [usuario.id, item.ingrediente_id]
        );

        if (itemExistente) {
            // REGRA 4: Detecta compra repetida se houve atualização recente (últimos 14 dias)
            let origemFinal = origemAdicao;
            if (origemAdicao === 'compra') {
                const diasDesdeUltimaAtualizacao = Math.floor((agora - (itemExistente.atualizado_em || 0)) / (1000 * 60 * 60 * 24));
                // Se foi atualizado nos últimos 14 dias, considera compra repetida
                if (diasDesdeUltimaAtualizacao <= 14) {
                    origemFinal = 'compra_repetida';
                }
            }
            
            // Calcula a disponibilidade automaticamente baseado na origem e disponibilidade atual
            const disponibilidadeCalculada = decidirDisponibilidadeFinal({
                disponibilidadeAtual: itemExistente.disponibilidade as 'baixo' | 'medio' | 'alto',
                origemAdicao: origemFinal
            });
            
            // Atualiza disponibilidade (calculada automaticamente), validade e timestamp
            await db.runAsync(
                `UPDATE ${TABLE_NAME}
                 SET disponibilidade = ?, validade = ?, precisa_sincronizar = ?, local = ?, atualizado_em = ?
                 WHERE usuario_id = ? AND ingrediente_id = ?`,
                [
                    disponibilidadeCalculada,
                    item.validade || null,
                    item.precisa_sincronizar ? 1 : 0,
                    localFinal,
                    agora,
                    usuario.id,
                    item.ingrediente_id
                ]
            );
        } else {
            // Calcula a disponibilidade inicial baseado na origem
            const disponibilidadeInicial = decidirDisponibilidadeFinal({
                origemAdicao: origemAdicao
            });
            
            // Insere um novo item com timestamp de criação
            // Sempre marca precisa_sincronizar como true para novos itens
            await db.runAsync(
                `INSERT INTO ${TABLE_NAME}
                 (usuario_id, ingrediente_id, disponibilidade, validade, precisa_sincronizar, local, atualizado_em)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    usuario.id,
                    item.ingrediente_id,
                    disponibilidadeInicial,
                    item.validade || null,
                    1, // precisa_sincronizar = true para novos itens
                    localFinal,
                    agora
                ]
            );
        }
    }
}

/*
 * Atualiza a disponibilidade e validade de um item no inventário
 * Substitui os valores existentes pelos novos
 * @param ingrediente_id ID do ingrediente
 * @param disponibilidade Nova disponibilidade
 * @param validade Nova validade (timestamp ou null)
 */
export async function atualizarDisponibilidadeValidadeItemInventario(
    ingrediente_id: number,
    disponibilidade: 'baixo' | 'medio' | 'alto',
    validade: number | null
): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const agora = Date.now();

    // Atualiza disponibilidade e validade, substituindo os valores existentes
    await db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET disponibilidade = ?, validade = ?, precisa_sincronizar = ?, atualizado_em = ?
         WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
        [
            disponibilidade,
            validade || null,
            1, // precisa_sincronizar = true para sincronizar a mudança
            agora,
            usuario.id,
            ingrediente_id
        ]
    );
}

/*
 * Exclui um item do inventário (soft delete)
 * @param ingrediente_ids IDs dos ingredientes a serem excluídos
 */
export async function excluirItemInventario(ingrediente_ids: number[]): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const agora = Date.now();

    // Atualiza o campo deletado_em para fazer soft delete
    for (const ingrediente_id of ingrediente_ids) {
        await db.runAsync(
            `UPDATE ${TABLE_NAME}
             SET deletado_em = ?, atualizado_em = ?, precisa_sincronizar = ?
             WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
            [
                agora,
                agora,
                1, // precisa_sincronizar = true para sincronizar a exclusão
                usuario.id,
                ingrediente_id
            ]
        );
    }
}

/*
 * REGRA 5: Atualiza a disponibilidade dos itens baseado no tempo sem atualização
 * Diminui a disponibilidade automaticamente quando o tempo passa sem atualização
 * - alto → medio após 30 dias
 * - medio → baixo após 60 dias
 * 
 * QUANDO CHAMAR:
 * - Ao abrir o app
 * - Antes de calcular status de receitas
 * - Em rotinas de manutenção offline
 */
export async function atualizarDisponibilidadePorTempo(): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const agora = Date.now();

    // Busca todos os itens do inventário (não deletados)
    const itens = await db.getAllAsync<any>(
        `SELECT ingrediente_id, disponibilidade, atualizado_em
         FROM ${TABLE_NAME}
         WHERE usuario_id = ? AND deletado_em IS NULL`,
        [usuario.id]
    );

    if (!itens || itens.length === 0) {
        return;
    }

    // Processa cada item e atualiza se necessário
    for (const item of itens) {
        const disponibilidadeAtual = item.disponibilidade as 'baixo' | 'medio' | 'alto';
        const atualizadoEm = item.atualizado_em || 0;
        
        // Calcula dias sem atualização
        const diasSemAtualizacao = Math.floor((agora - atualizadoEm) / (1000 * 60 * 60 * 24));
        
        // Aplica a regra de diminuição por tempo
        const novaDisponibilidade = diminuirDisponibilidadePorTempo(
            disponibilidadeAtual,
            diasSemAtualizacao
        );
        
        // Atualiza apenas se a disponibilidade mudou
        if (novaDisponibilidade !== disponibilidadeAtual) {
            await db.runAsync(
                `UPDATE ${TABLE_NAME}
                 SET disponibilidade = ?, precisa_sincronizar = ?
                 WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
                [
                    novaDisponibilidade,
                    1, // precisa_sincronizar = true para sincronizar a mudança
                    usuario.id,
                    item.ingrediente_id
                ]
            );
        }
        console.log(novaDisponibilidade, disponibilidadeAtual, diasSemAtualizacao, item.ingrediente_id, "(<<<<<<<<< Nova disponibilidade <<<<<<<<<)");
    }
}

