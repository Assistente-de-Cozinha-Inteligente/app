import { Ingrediente, Inventario } from "@/models";
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
            inv.quantidade,
            inv.unidade,
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
            quantidade: row.quantidade,
            unidade: row.unidade,
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
 * Se já existir um item com o mesmo usuario_id e ingrediente_id, atualiza a quantidade
 * Caso contrário, insere um novo item
 * @param items Itens a serem inseridos ou atualizados
 */
export async function inserirAtualizarItemInventario(
    items: Omit<Inventario, 'usuario_id' | 'atualizado_em' | 'deletado_em'>[]
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
        // Verifica se já existe um item com o mesmo usuario_id e ingrediente_id (não deletado)
        const itemExistente = await getFirstAsync<any>(
            `SELECT usuario_id, ingrediente_id, quantidade, unidade, validade, precisa_sincronizar, local, atualizado_em, deletado_em
             FROM ${TABLE_NAME}
             WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
            [usuario.id, item.ingrediente_id]
        );

        if (itemExistente) {
            // Soma a quantidade existente com a nova quantidade e atualiza o timestamp
            const novaQuantidade = itemExistente.quantidade + item.quantidade;
            await db.runAsync(
                `UPDATE ${TABLE_NAME}
                 SET quantidade = ?, unidade = ?, validade = ?, precisa_sincronizar = ?, local = ?, atualizado_em = ?
                 WHERE usuario_id = ? AND ingrediente_id = ?`,
                [
                    novaQuantidade,
                    item.unidade,
                    item.validade || null,
                    item.precisa_sincronizar ? 1 : 0,
                    item.local || null,
                    agora,
                    usuario.id,
                    item.ingrediente_id
                ]
            );
        } else {
            // Insere um novo item com timestamp de criação
            // Sempre marca precisa_sincronizar como true para novos itens
            await db.runAsync(
                `INSERT INTO ${TABLE_NAME}
                 (usuario_id, ingrediente_id, quantidade, unidade, validade, precisa_sincronizar, local, atualizado_em)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    usuario.id,
                    item.ingrediente_id,
                    item.quantidade,
                    item.unidade,
                    item.validade || null,
                    1, // precisa_sincronizar = true para novos itens
                    item.local || null,
                    agora
                ]
            );
        }
    }
}

/*
 * Atualiza a quantidade, unidade e validade de um item no inventário
 * Substitui os valores existentes pelos novos (não soma)
 * @param ingrediente_id ID do ingrediente
 * @param quantidade Nova quantidade (substitui a existente)
 * @param unidade Nova unidade
 * @param validade Nova validade (timestamp ou null)
 */
export async function atualizarQuantidadeUnidadeValidadeItemInventario(
    ingrediente_id: number,
    quantidade: number,
    unidade: string,
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

    // Atualiza quantidade, unidade e validade, substituindo os valores existentes
    await db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET quantidade = ?, unidade = ?, validade = ?, precisa_sincronizar = ?, atualizado_em = ?
         WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
        [
            quantidade,
            unidade,
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

