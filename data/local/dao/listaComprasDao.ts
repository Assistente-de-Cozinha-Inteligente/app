import { Ingrediente, ListaCompras } from "@/models";
import { getDatabase, getFirstAsync } from "../database";
import { getOrCreateLocalUser } from "./usuarioDao";

const TABLE_NAME = 'lista_compras';

const KEY_SYNC = 'lista_compras_sync';

/*
 * Obtém a lista de compras do usuário
 * @returns Lista de compras
 */
export async function getListaCompras(): Promise<ListaCompras[]> {
    const db = getDatabase();
    const result = await db?.getAllAsync<any>(
        `SELECT 
            lc.usuario_id, 
            lc.ingrediente_id, 
            lc.quantidade,
            lc.unidade,
            lc.marcado, 
            lc.precisa_sincronizar,
            lc.local,
            lc.atualizado_em, 
            lc.deletado_em,
            i.id as ingrediente_id_join,
            i.nome as ingrediente_nome,
            i.categoria as ingrediente_categoria
        FROM ${TABLE_NAME} lc
        INNER JOIN ingredientes i ON lc.ingrediente_id = i.id
        WHERE lc.deletado_em IS NULL
        ORDER BY i.nome ASC`
    );

    // Mapeia os resultados para o tipo ListaCompras
    return (result ?? []).map((row: any) => {
        const ingrediente: Ingrediente | undefined = row.ingrediente_id_join ? {
            id: row.ingrediente_id_join,
            nome: row.ingrediente_nome,
            categoria: row.ingrediente_categoria
        } : undefined;

        return {
            usuario_id: row.usuario_id,
            ingrediente_id: row.ingrediente_id,
            quantidade: row.quantidade,
            unidade: row.unidade,
            marcado: row.marcado === 1,
            precisa_sincronizar: row.precisa_sincronizar === 1,
            local: row.local || undefined,
            atualizado_em: row.atualizado_em,
            deletado_em: row.deletado_em,
            ingrediente
        } as ListaCompras;
    });
}

/*
 * Insere ou atualiza item na lista de compras
 * Se já existir um item com o mesmo usuario_id e ingrediente_id, atualiza a quantidade
 * Caso contrário, insere um novo item
 * @param item Item a ser inserido ou atualizado
 */
export async function inserirAtualizarItemListaCompras(
    items: Omit<ListaCompras, 'usuario_id' | 'atualizado_em' | 'deletado_em'>[]
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
            `SELECT usuario_id, ingrediente_id, quantidade, unidade, marcado, precisa_sincronizar, local, atualizado_em, deletado_em
             FROM ${TABLE_NAME}
             WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
            [usuario.id, item.ingrediente_id]
        );

        if (itemExistente) {
            // Soma a quantidade existente com a nova quantidade e atualiza o timestamp
            const novaQuantidade = itemExistente.quantidade + item.quantidade;
            await db.runAsync(
                `UPDATE ${TABLE_NAME}
             SET quantidade = ?, unidade = ?, marcado = ?, precisa_sincronizar = ?, local = ?, atualizado_em = ?
             WHERE usuario_id = ? AND ingrediente_id = ?`,
                [
                    novaQuantidade,
                    item.unidade,
                    item.marcado ? 1 : 0,
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
             (usuario_id, ingrediente_id, quantidade, unidade, marcado, precisa_sincronizar, local, atualizado_em)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    usuario.id,
                    item.ingrediente_id,
                    item.quantidade,
                    item.unidade,
                    item.marcado ? 1 : 0,
                    1, // precisa_sincronizar = true para novos itens
                    item.local || null,
                    agora
                ]
            );
        }
    }

}

/*
 * Atualiza apenas o campo marcado de um item na lista de compras
 * @param ingrediente_id ID do ingrediente
 * @param marcado Novo valor para o campo marcado
 */
export async function atualizarMarcadoItemListaCompras(
    ingrediente_id: number,
    marcado: boolean
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

    // Atualiza apenas o campo marcado, sem alterar a quantidade
    await db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET marcado = ?, precisa_sincronizar = ?, atualizado_em = ?
         WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
        [
            marcado ? 1 : 0,
            1, // precisa_sincronizar = true para sincronizar a mudança
            agora,
            usuario.id,
            ingrediente_id
        ]
    );
}

/*
 * Atualiza a quantidade e unidade de um item na lista de compras
 * Substitui a quantidade existente pela nova (não soma)
 * @param ingrediente_id ID do ingrediente
 * @param quantidade Nova quantidade (substitui a existente)
 * @param unidade Nova unidade
 */
export async function atualizarQuantidadeUnidadeItemListaCompras(
    ingrediente_id: number,
    quantidade: number,
    unidade: string
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

    // Atualiza quantidade e unidade, substituindo os valores existentes
    await db.runAsync(
        `UPDATE ${TABLE_NAME}
         SET quantidade = ?, unidade = ?, precisa_sincronizar = ?, atualizado_em = ?
         WHERE usuario_id = ? AND ingrediente_id = ? AND deletado_em IS NULL`,
        [
            quantidade,
            unidade,
            1, // precisa_sincronizar = true para sincronizar a mudança
            agora,
            usuario.id,
            ingrediente_id
        ]
    );
}

/*
 * Exclui um item da lista de compras (soft delete)
 * @param ingrediente_id ID do ingrediente a ser excluído
 */
export async function excluirItemListaCompras(ingrediente_id: number): Promise<void> {
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

