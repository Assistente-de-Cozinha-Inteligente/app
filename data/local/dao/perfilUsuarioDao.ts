import { PerfilUsuario, PerfilRestricaoAlimentar, PerfilAlergia, PerfilPrioridade, NivelCozinha, RestricaoAlimentar, Alergia, Prioridade } from '@/models';
import { getDatabase, getFirstAsync, getAllAsync } from '../database';
import { getOrCreateLocalUser } from './usuarioDao';

const TABLE_PERFIL = 'perfis_usuario';
const TABLE_RESTRICOES = 'perfil_restricoes_alimentares';
const TABLE_ALERGIAS = 'perfil_alergias';
const TABLE_PRIORIDADES = 'perfil_prioridades';

/**
 * Obtém ou cria o perfil do usuário
 */
export async function getOrCreatePerfilUsuario(): Promise<PerfilUsuario | null> {
    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    // Busca perfil existente
    const perfil = await getFirstAsync<PerfilUsuario>(
        `SELECT id, usuario_id, nivel_cozinha, receber_sugestao_dia 
         FROM ${TABLE_PERFIL} 
         WHERE usuario_id = ?`,
        [usuario.id]
    );

    if (perfil) {
        return perfil;
    }

    // Cria novo perfil com valores padrão
    const result = await db.runAsync(
        `INSERT INTO ${TABLE_PERFIL} (usuario_id, nivel_cozinha, receber_sugestao_dia)
         VALUES (?, ?, ?)`,
        [usuario.id, 'iniciante', 1]
    );

    const newPerfil = await getFirstAsync<PerfilUsuario>(
        `SELECT id, usuario_id, nivel_cozinha, receber_sugestao_dia 
         FROM ${TABLE_PERFIL} 
         WHERE id = ?`,
        [result.lastInsertRowId]
    );

    return newPerfil;
}

/**
 * Atualiza o perfil do usuário
 */
export async function atualizarPerfilUsuario(
    nivel_cozinha: NivelCozinha,
    receber_sugestao_dia: boolean
): Promise<void> {
    const usuario = await getOrCreateLocalUser();
    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    // Garante que o perfil existe
    await getOrCreatePerfilUsuario();

    await db.runAsync(
        `UPDATE ${TABLE_PERFIL}
         SET nivel_cozinha = ?, receber_sugestao_dia = ?
         WHERE usuario_id = ?`,
        [nivel_cozinha, receber_sugestao_dia ? 1 : 0, usuario.id]
    );
}

/**
 * Obtém todas as restrições alimentares do perfil
 */
export async function getRestricoesAlimentares(perfil_id: number): Promise<RestricaoAlimentar[]> {
    const restricoes = await getAllAsync<PerfilRestricaoAlimentar>(
        `SELECT perfil_id, restricao 
         FROM ${TABLE_RESTRICOES} 
         WHERE perfil_id = ? AND restricao IS NOT NULL`,
        [perfil_id]
    );

    return restricoes.map(r => r.restricao as RestricaoAlimentar);
}

/**
 * Atualiza as restrições alimentares do perfil
 */
export async function atualizarRestricoesAlimentares(
    perfil_id: number,
    restricoes: RestricaoAlimentar[]
): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    // Remove todas as restrições existentes
    await db.runAsync(
        `DELETE FROM ${TABLE_RESTRICOES} WHERE perfil_id = ?`,
        [perfil_id]
    );

    // Insere as novas restrições
    for (const restricao of restricoes) {
        await db.runAsync(
            `INSERT INTO ${TABLE_RESTRICOES} (perfil_id, restricao)
             VALUES (?, ?)`,
            [perfil_id, restricao]
        );
    }
}

/**
 * Obtém todas as alergias do perfil
 */
export async function getAlergias(perfil_id: number): Promise<Alergia[]> {
    const alergias = await getAllAsync<PerfilAlergia>(
        `SELECT perfil_id, alergia 
         FROM ${TABLE_ALERGIAS} 
         WHERE perfil_id = ? AND alergia IS NOT NULL`,
        [perfil_id]
    );

    return alergias.map(a => a.alergia as Alergia);
}

/**
 * Atualiza as alergias do perfil
 */
export async function atualizarAlergias(
    perfil_id: number,
    alergias: Alergia[]
): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    // Remove todas as alergias existentes
    await db.runAsync(
        `DELETE FROM ${TABLE_ALERGIAS} WHERE perfil_id = ?`,
        [perfil_id]
    );

    // Insere as novas alergias
    for (const alergia of alergias) {
        await db.runAsync(
            `INSERT INTO ${TABLE_ALERGIAS} (perfil_id, alergia)
             VALUES (?, ?)`,
            [perfil_id, alergia]
        );
    }
}

/**
 * Obtém todas as prioridades do perfil
 */
export async function getPrioridades(perfil_id: number): Promise<Prioridade[]> {
    const prioridades = await getAllAsync<PerfilPrioridade>(
        `SELECT perfil_id, prioridade 
         FROM ${TABLE_PRIORIDADES} 
         WHERE perfil_id = ? AND prioridade IS NOT NULL`,
        [perfil_id]
    );

    return prioridades.map(p => p.prioridade as Prioridade);
}

/**
 * Atualiza as prioridades do perfil
 */
export async function atualizarPrioridades(
    perfil_id: number,
    prioridades: Prioridade[]
): Promise<void> {
    const db = getDatabase();
    if (!db) {
        throw new Error("Banco de dados não inicializado");
    }

    // Remove todas as prioridades existentes
    await db.runAsync(
        `DELETE FROM ${TABLE_PRIORIDADES} WHERE perfil_id = ?`,
        [perfil_id]
    );

    // Insere as novas prioridades
    for (const prioridade of prioridades) {
        await db.runAsync(
            `INSERT INTO ${TABLE_PRIORIDADES} (perfil_id, prioridade)
             VALUES (?, ?)`,
            [perfil_id, prioridade]
        );
    }
}

/**
 * Obtém o perfil completo do usuário (perfil + restrições + alergias + prioridades)
 */
export async function getPerfilCompleto(): Promise<{
    perfil: PerfilUsuario;
    restricoes: RestricaoAlimentar[];
    alergias: Alergia[];
    prioridades: Prioridade[];
} | null> {
    const perfil = await getOrCreatePerfilUsuario();
    if (!perfil) {
        return null;
    }

    const restricoes = await getRestricoesAlimentares(perfil.id);
    const alergias = await getAlergias(perfil.id);
    const prioridades = await getPrioridades(perfil.id);

    return {
        perfil,
        restricoes,
        alergias,
        prioridades,
    };
}

