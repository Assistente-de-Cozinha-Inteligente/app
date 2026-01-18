import * as SQLite from 'expo-sqlite';

type SQLiteBindParams = SQLite.SQLiteBindParams;
type SQLiteRunResult = SQLite.SQLiteRunResult;

/**
 * database.ts — Camada de Acesso ao Banco
 * 
 * Responsável apenas por:
 * - Abrir o banco SQLite
 * - Executar comandos SQL (execAsync, runAsync, getAllAsync, getFirstAsync)
 * 
 * NÃO conhece:
 * - Receitas, telas, sync ou regras de negócio
 * - Estrutura de tabelas ou migrations
 */

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Abre o banco de dados SQLite
 * @param dbName Nome do banco (padrão: 'app.db')
 * @returns Instância do banco de dados
 */
export async function openDatabase(dbName: string = 'app.db'): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync(dbName);
  return dbInstance;
}

/**
 * Obtém a instância atual do banco de dados
 * @returns Instância do banco ou null se não estiver aberto
 */
export function getDatabase(): SQLite.SQLiteDatabase | null {
  return dbInstance;
}

/**
 * Executa um comando SQL (CREATE, INSERT, UPDATE, DELETE, etc)
 * Útil para comandos que não retornam dados
 * 
 * @param sql Comando SQL a ser executado
 * @returns Promise que resolve quando o comando é executado
 */
export async function execAsync(sql: string): Promise<void> {
  const db = await openDatabase();
  await db.execAsync(sql);
}

/**
 * Executa um comando SQL e retorna o resultado
 * Útil para INSERT, UPDATE, DELETE que retornam lastInsertRowId ou changes
 * 
 * @param sql Comando SQL a ser executado
 * @param params Parâmetros opcionais para o SQL (array, object ou variadic)
 * @returns Promise com o resultado da execução
 */
export async function runAsync(
  sql: string,
  ...params: any[]
): Promise<SQLiteRunResult> {
  const db = await openDatabase();
  if (params.length === 0) {
    return await db.runAsync(sql);
  }
  if (params.length === 1 && (Array.isArray(params[0]) || typeof params[0] === 'object')) {
    return await db.runAsync(sql, params[0] as SQLiteBindParams);
  }
  return await db.runAsync(sql, ...params);
}

/**
 * Executa uma query SQL e retorna todos os resultados
 * 
 * @param sql Query SQL (SELECT)
 * @param params Parâmetros opcionais para o SQL (array, object ou variadic)
 * @returns Promise com array de resultados
 */
export async function getAllAsync<T = any>(
  sql: string,
  ...params: any[]
): Promise<T[]> {
  const db = await openDatabase();
  if (params.length === 0) {
    return await db.getAllAsync<T>(sql);
  }
  if (params.length === 1 && (Array.isArray(params[0]) || typeof params[0] === 'object')) {
    return await db.getAllAsync<T>(sql, params[0] as SQLiteBindParams);
  }
  return await db.getAllAsync<T>(sql, ...params);
}

/**
 * Executa uma query SQL e retorna apenas o primeiro resultado
 * 
 * @param sql Query SQL (SELECT)
 * @param params Parâmetros opcionais para o SQL (array, object ou variadic)
 * @returns Promise com o primeiro resultado ou null
 */
export async function getFirstAsync<T = any>(
  sql: string,
  ...params: any[]
): Promise<T | null> {
  const db = await openDatabase();
  if (params.length === 0) {
    return await db.getFirstAsync<T>(sql);
  }
  if (params.length === 1 && (Array.isArray(params[0]) || typeof params[0] === 'object')) {
    return await db.getFirstAsync<T>(sql, params[0] as SQLiteBindParams);
  }
  const result = await db.getFirstAsync<T>(sql, ...params);
  return result ?? null;
}

/**
 * Fecha o banco de dados
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
