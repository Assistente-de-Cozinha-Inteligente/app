import { Ingrediente } from "@/models";
import { getDatabase, getFirstAsync } from "../database";

const TABLE_NAME = 'ingredientes';

/*
 * Remove acentos de uma string
 */
function removerAcentos(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

/*
 * Busca ingredientes por nome (busca parcial, case-insensitive e sem acentos)
 * @param searchTerm Termo de busca
 * @param limit Limite de resultados (padrão: 6)
 * @returns Lista de ingredientes que correspondem à busca
 */
export async function buscarIngredientesPorNome(
    searchTerm: string,
    limit: number = 6
): Promise<Ingrediente[]> {
    const db = getDatabase();
    if (!db) {
        return [];
    }

    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }

    const termoNormalizado = removerAcentos(searchTerm.trim());
    const termo = `%${termoNormalizado}%`;
    
    // Busca todos os ingredientes e filtra no JavaScript para normalizar acentos
    const todosIngredientes = await db.getAllAsync<any>(
        `SELECT id, nome, categoria
         FROM ${TABLE_NAME}
         ORDER BY nome ASC`
    );

    if (!todosIngredientes || todosIngredientes.length === 0) {
        return [];
    }

    // Filtra ingredientes que correspondem à busca (normalizando acentos)
    const resultados = todosIngredientes
        .filter((row: any) => {
            const nomeNormalizado = removerAcentos(row.nome);
            return nomeNormalizado.includes(termoNormalizado);
        })
        .slice(0, limit)
        .map((row: any) => ({
            id: row.id,
            nome: row.nome,
            categoria: row.categoria
        } as Ingrediente));

    return resultados;
}

/*
 * Busca todos os ingredientes
 * @returns Lista de todos os ingredientes
 */
export async function getAllIngredientes(): Promise<Ingrediente[]> {
    const db = getDatabase();
    if (!db) {
        return [];
    }

    const result = await db.getAllAsync<any>(
        `SELECT id, nome, categoria, local
         FROM ${TABLE_NAME}
         ORDER BY nome ASC`
    );
    
    return (result ?? []).map((row: any) => ({
        id: row.id,
        nome: row.nome,
        categoria: row.categoria,
        local: row.local
    } as Ingrediente));

    return result ?? [];
}

/*
 * Busca um ingrediente por nome (exato, case-insensitive e sem acentos)
 * @param nome Nome do ingrediente
 * @returns Ingrediente encontrado ou null
 */
export async function buscarIngredientePorNomeExato(nome: string): Promise<Ingrediente | null> {
    const db = getDatabase();
    if (!db) {
        return null;
    }

    const nomeNormalizado = removerAcentos(nome.trim());
    
    // Busca todos os ingredientes e filtra no JavaScript para normalizar acentos
    const todosIngredientes = await db.getAllAsync<any>(
        `SELECT id, nome, categoria
         FROM ${TABLE_NAME}`
    );

    if (!todosIngredientes || todosIngredientes.length === 0) {
        return null;
    }

    // Encontra ingrediente que corresponde exatamente (normalizando acentos)
    const resultado = todosIngredientes.find((row: any) => {
        const nomeIngredienteNormalizado = removerAcentos(row.nome);
        return nomeIngredienteNormalizado === nomeNormalizado;
    });

    if (!resultado) {
        return null;
    }

    return {
        id: resultado.id,
        nome: resultado.nome,
        categoria: resultado.categoria
    } as Ingrediente;
}

/*
 * Busca a unidade principal de um ingrediente
 * @param ingrediente_id ID do ingrediente
 * @returns ID da unidade principal ou null se não encontrado
 */
export async function getUnidadePrincipalIngrediente(ingrediente_id: number): Promise<number | null> {
    const resultado = await getFirstAsync<{ unidade_id: number }>(
        `SELECT unidade_id
         FROM ingredientes_unidades
         WHERE ingrediente_id = ? AND principal = 1
         LIMIT 1`,
        [ingrediente_id]
    );

    return resultado?.unidade_id ?? null;
}

/*
 * Busca o nome da unidade pelo ID
 * @param unidade_id ID da unidade
 * @returns Nome da unidade ou null se não encontrado
 */
export async function getNomeUnidade(unidade_id: number): Promise<string | null> {
    const resultado = await getFirstAsync<{ nome: string }>(
        `SELECT nome
         FROM unidades
         WHERE id = ?`,
        [unidade_id]
    );

    return resultado?.nome ?? null;
}

/*
 * Busca todas as unidades de um ingrediente
 * @param ingrediente_id ID do ingrediente
 * @returns Lista de unidades com id e nome
 */
export async function getUnidadesIngrediente(ingrediente_id: number): Promise<Array<{ id: number; nome: string }>> {
    const db = getDatabase();
    if (!db) {
        return [];
    }

    const resultados = await db.getAllAsync<any>(
        `SELECT u.id, u.nome
         FROM unidades u
         INNER JOIN ingredientes_unidades iu ON u.id = iu.unidade_id
         WHERE iu.ingrediente_id = ?
         ORDER BY iu.principal DESC, u.nome ASC`,
        [ingrediente_id]
    );

    return resultados.map((row: any) => ({
        id: row.id,
        nome: row.nome
    }));
}
