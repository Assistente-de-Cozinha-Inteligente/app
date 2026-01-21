import { getDatabase } from "../database";

export async function testSelectDao(select: string): Promise<any> {
    const db = await getDatabase();
    return await db?.getAllAsync(select);
}

export async function testInsertUpdateDao(insert: string): Promise<any> {
    const db = await getDatabase();
    return await db?.runAsync(insert);
}