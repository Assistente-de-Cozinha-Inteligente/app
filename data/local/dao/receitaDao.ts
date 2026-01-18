import { Receita } from "@/models";
import { getDatabase } from "../database";

export async function getHomeReceitas(): Promise<Receita[]> {
    const db = await getDatabase();
    const result = await db?.getAllAsync<Receita>(
        `SELECT id, nome, tempo_minutos, nivel
        FROM
        receitas
        ORDER BY tempo_minutos ASC LIMIT 20`
    );
    return result ?? [];
}