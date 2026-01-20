import { deleteDatabaseAsync } from 'expo-sqlite';
import { getOrCreateLocalUser } from './dao/usuarioDao';
import { execAsync, getFirstAsync, openDatabase, runAsync } from './database';
import seedV1 from './seeds/v1.json';
import tabelasSchema from './tabelas.json';

/**
 * initDatabase.ts — Inicialização do Banco
 * 
 * Responsável por:
 * - Configurar o banco (PRAGMA)
 * - Criar tabelas baseadas em tabelas.json
 * - Executar migrations
 * - Inserir dados iniciais (se necessário)
 * 
 * Usa as funções do database.ts para executar SQL
 */

type TableSchema = {
  [key: string]: Array<Record<string, string>>;
};

// Flag para garantir que a inicialização só aconteça uma vez
let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Inicializa o banco de dados
 * Configura PRAGMA, cria tabelas e executa migrations
 * 
 * @returns Promise que resolve quando a inicialização está completa
 */
export async function initDatabase(): Promise<void> {
  // Se já foi inicializado, retorna imediatamente
  if (isInitialized) {
    return;
  }

  // Se já está inicializando, retorna a promise existente
  if (initPromise) {
    return initPromise;
  }

  // Cria uma nova promise de inicialização
  initPromise = (async () => {
  try {
    // Abre o banco
    await openDatabase('app.db');

    // Configurações do banco
    await execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);

      // Criar tabelas baseadas no schema JSON
    await createTables();

      // Executar migrações
      await runMigrations();

      // Aplicar seeds
      await applySeeds();

      isInitialized = true;
    console.log('✅ Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
      // Reseta a promise em caso de erro para permitir nova tentativa
      initPromise = null;
    throw error;
  }
  })();

  return initPromise;
}

/**
 * Verifica se uma tabela já existe no banco de dados
 */
async function tableExists(tableName: string): Promise<boolean> {
  const result = await getFirstAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    tableName
  );
  return result !== null;
}

/**
 * Verifica se uma coluna existe em uma tabela
 */
async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  const result = await getFirstAsync<{ sql: string }>(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`,
    tableName
  );
  if (!result || !result.sql) {
    return false;
  }
  return result.sql.toLowerCase().includes(columnName.toLowerCase());
}

/**
 * Executa migrações do banco de dados
 */
async function runMigrations(): Promise<void> {
  console.log('🔄 Verificando migrações...');

  // Migração: Remover colunas quantidade e unidade da tabela lista_compras
  if (await tableExists('lista_compras')) {
    const hasQuantidade = await columnExists('lista_compras', 'quantidade');
    const hasUnidade = await columnExists('lista_compras', 'unidade');

    if (hasQuantidade || hasUnidade) {
      console.log('🔄 Removendo colunas quantidade e unidade de lista_compras...');
      
      // SQLite não suporta DROP COLUMN diretamente, então precisamos:
      // 1. Criar nova tabela sem essas colunas
      // 2. Copiar dados
      // 3. Remover tabela antiga
      // 4. Renomear nova tabela

  await execAsync(`
        CREATE TABLE IF NOT EXISTS lista_compras_new (
          usuario_id TEXT NOT NULL,
          ingrediente_id INTEGER NOT NULL,
          marcado BOOLEAN NOT NULL,
          local TEXT CHECK (local IN ('frutas_vegetais','laticinios_queijos','carnes_peixes','padaria','graos_cereais','bebidas','congelados','outro')),
          precisa_sincronizar BOOLEAN NOT NULL DEFAULT FALSE,
          atualizado_em INTEGER NOT NULL,
          deletado_em INTEGER,
          PRIMARY KEY (usuario_id, ingrediente_id)
    );
  `);

      // Copia dados da tabela antiga para a nova (sem quantidade e unidade)
  await execAsync(`
        INSERT INTO lista_compras_new (usuario_id, ingrediente_id, marcado, local, precisa_sincronizar, atualizado_em, deletado_em)
        SELECT usuario_id, ingrediente_id, marcado, local, precisa_sincronizar, atualizado_em, deletado_em
        FROM lista_compras;
      `);

      // Remove tabela antiga
      await execAsync(`DROP TABLE lista_compras;`);

      // Renomeia nova tabela
      await execAsync(`ALTER TABLE lista_compras_new RENAME TO lista_compras;`);

      console.log('✅ Migração concluída: colunas quantidade e unidade removidas de lista_compras');
    }
  }

  console.log('✅ Verificação de migrações concluída');
}

/**
 * Cria todas as tabelas do banco de dados baseadas no schema JSON
 */
async function createTables(): Promise<void> {
  const schema = tabelasSchema as TableSchema;
  console.log("Verificando schema de tabelas");

  for (const [tableName, columns] of Object.entries(schema)) {
    const exists = await tableExists(tableName);

    if (exists) {
      console.log(`⏭️  Tabela '${tableName}' já existe, pulando criação`);
      continue;
    }

    console.log(`Criando tabela ${tableName}`);
    await createTable(tableName, columns);
    console.log(`✅ Tabela '${tableName}' criada com sucesso`);

    if (tableName === 'usuario') {
      //criar uuid
      await getOrCreateLocalUser();
    }
  }
}
/**
 * Cria uma tabela individual baseada no schema
 */
async function createTable(
  tableName: string,
  columns: Array<Record<string, string>>
): Promise<void> {
  const columnDefinitions: string[] = [];
  let compositePrimaryKey: string | null = null;

  // Cada tabela tem um array com um único objeto contendo todas as colunas
  for (const column of columns) {
    // Processa cada coluna
    for (const [columnName, columnDef] of Object.entries(column)) {
      // Ignora a chave "PRIMARY KEY" que será tratada separadamente
      if (columnName === 'PRIMARY KEY') {
        compositePrimaryKey = columnDef;
        continue;
      }

      columnDefinitions.push(`${columnName} ${columnDef}`);
    }
  }

  // Adiciona PRIMARY KEY composta no final se existir
  if (compositePrimaryKey) {
    columnDefinitions.push(`PRIMARY KEY ${compositePrimaryKey}`);
  }

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columnDefinitions.join(',\n      ')}
    );
  `;

  await execAsync(createTableSQL);
}

/**
 * Verifica se uma seed já foi aplicada
 */
async function seedApplied(version: number): Promise<boolean> {
  const result = await getFirstAsync<{ version: number }>(
    `SELECT version FROM seeds_applied WHERE version = ?`,
    version
  );
  return result !== null;
}

/**
 * Registra que uma seed foi aplicada
 */
async function markSeedApplied(version: number): Promise<void> {
  await runAsync(
    `INSERT INTO seeds_applied (version, data) VALUES (?, ?)`,
    [version, Date.now()]
  );

}

/**
 * Mapeamento de versões de seeds para seus dados
 * Adicione novos imports e mapeamentos aqui quando criar novas seeds
 */
const seedsMap: Record<number, any> = {
  1: seedV1,
  // Adicione novas versões aqui:
  // 2: seedV2,
  // 3: seedV3,
};

/**
 * Aplica uma seed específica
 */
async function applySeed(version: number): Promise<void> {
  try {
    // Obtém os dados da seed do mapeamento
    const seedData = seedsMap[version];

    if (!seedData) {
      console.log(`⏭️  Seed v${version} não encontrada, pulando...`);
      return;
    }

    console.log(`🌱 Aplicando seed v${version}...`);

    // Aplica cada tabela do seed
    for (const [tableName, records] of Object.entries(seedData)) {
      if (!Array.isArray(records) || records.length === 0) {
        continue;
      }
      // se for ingredientes quero o console de cada ingrediente
      if (tableName === 'ingredientes') {
        for (const record of records) {
          console.log(record, "(<<<<<<<<< Ingrediente <<<<<<<<<)");
        }
      }
      // Pega as colunas do primeiro registro para construir o INSERT
      const firstRecord = records[0];
      const columns = Object.keys(firstRecord);
      const placeholders = columns.map(() => '?').join(', ');
      const columnNames = columns.join(', ');

      // Insere cada registro
      for (const record of records) {
        const values = columns.map(col => {
          const value = record[col];
          // Converte null explícito para NULL do SQL
          if (value === null || value === undefined) {
            return null;
          }
          return value;
        });

        await runAsync(
          `INSERT OR IGNORE INTO ${tableName} (${columnNames}) VALUES (${placeholders})`,
          values
        );
      }

      console.log(`  ✅ ${records.length} registro(s) inserido(s) em '${tableName}'`);
    }

    // Marca a seed como aplicada
    await markSeedApplied(version);
    console.log(`✅ Seed v${version} aplicada com sucesso`);
  } catch (error: any) {
    console.error(`❌ Erro ao aplicar seed v${version}:`, error);
    throw error;
  }
}

/**
 * Aplica todas as seeds disponíveis que ainda não foram aplicadas
 */
async function applySeeds(): Promise<void> {
  console.log('🌱 Verificando seeds...');

  // Lista de versões de seeds disponíveis
  // Adicione novas versões aqui quando criar novos arquivos de seed
  const seedVersions = [1];

  for (const version of seedVersions) {
    const applied = await seedApplied(version);

    if (applied) {
      console.log(`⏭️  Seed v${version} já foi aplicada, pulando...`);
      continue;
    }
    await applySeed(version);
  }

  console.log('✅ Verificação de seeds concluída');
}

// Drop database (teste)
export async function dropDatabase(): Promise<void> {
  await deleteDatabaseAsync('app.db');
}