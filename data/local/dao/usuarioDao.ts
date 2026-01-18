import { Usuario } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { getDatabase, getFirstAsync } from '../database';
import { dropDatabase } from '../initDatabase';

export async function getOrCreateLocalUser(): Promise<Usuario | null> {
    const key = 'localUser';

    // 1. Verificar se existe no AsyncStorage
    const stored = await AsyncStorage.getItem(key);
    if (stored) {
        const usuario = JSON.parse(stored) as Usuario;
        console.log(">>>>>>>>> Usuario encontrado no storage <<<<<<<<<");
        return usuario;
    }

    const db = await getDatabase();
    if (!db) {
        console.error("Database não está disponível");
        return null;
    }

    // 2. Verificar se existe no banco (pode ter sido criado em outra sessão)
    const existingUser = await getFirstAsync<Usuario>(
        `SELECT id, uuid, nome, email FROM usuario LIMIT 1`
    );
    if (existingUser) {
        // Salvar no storage para próximas consultas
        await AsyncStorage.setItem(key, JSON.stringify(existingUser));
        console.log(">>>>>>>>> Usuario encontrado no banco <<<<<<<<<");
        return existingUser;
    }

    // 3. Criar novo usuário
    const id = randomUUID();

    await db.runAsync(
        `INSERT INTO usuario (id, uuid, nome, email) VALUES (?, ?, ?, ?)`,
        [
            id,
            null, // uuid nulo para usuário local
            null,
            null
        ]
    );

    // Buscar a linha inserida
    const newUser = await getFirstAsync<Usuario>(
        `SELECT id, uuid, nome, email FROM usuario WHERE id = ?`,
        id
    );
    console.log(newUser, "newUser");
    if (!newUser) {
        console.error("Erro ao criar usuário no banco");
        return null;
    }

    // Salvar no storage
    await AsyncStorage.setItem(key, JSON.stringify(newUser));

    console.log(">>>>>>>>> Usuario criado com sucesso <<<<<<<<<");
    console.log(newUser);

    return newUser;
}


export async function setLocalUserId(id: string) {
    const key = 'localUserId';
    await AsyncStorage.setItem(key, id);
}