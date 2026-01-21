import { Usuario } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { getDatabase, getFirstAsync } from '../database';

const KEY_LOCAL_USER = 'localUser';

export async function getOrCreateLocalUser(): Promise<Usuario | null> {

    // 1. Verificar se existe no AsyncStorage
    const stored = await AsyncStorage.getItem(KEY_LOCAL_USER);
    if (stored) {
        const usuarioStorage = JSON.parse(stored) as Usuario;
        // Se já tem criado_em no storage, retorna direto sem consultar o banco
        if (usuarioStorage.criado_em) {
            return usuarioStorage;
        }
        // Se não tem criado_em, busca no banco apenas uma vez para atualizar
        const db = await getDatabase();
        if (db) {
            const usuarioBanco = await getFirstAsync<Usuario>(
                `SELECT id, uuid, nome, email, criado_em FROM usuario WHERE id = ?`,
                [usuarioStorage.id]
            );
            if (usuarioBanco) {
                // Atualizar storage com dados do banco (incluindo criado_em)
                await AsyncStorage.setItem(KEY_LOCAL_USER, JSON.stringify(usuarioBanco));
                return usuarioBanco;
            }
        }
        // Se não encontrou no banco mas tem no storage, retorna o do storage mesmo sem criado_em
        return usuarioStorage;
    }

    const db = await getDatabase();
    if (!db) {
        console.error("Database não está disponível");
        return null;
    }

    // 2. Verificar se existe no banco (pode ter sido criado em outra sessão)
    const existingUser = await getFirstAsync<Usuario>(
        `SELECT id, uuid, nome, email, criado_em FROM usuario LIMIT 1`
    );
    if (existingUser) {
        // Salvar no storage para próximas consultas
        await AsyncStorage.setItem(KEY_LOCAL_USER, JSON.stringify(existingUser));
        return existingUser;
    }

    // 3. Criar novo usuário
    const id = randomUUID();

    await db.runAsync(
        `INSERT INTO usuario (id, uuid, nome, email, criado_em) VALUES (?, ?, ?, ?, ?)`,
        [
            id,
            null, // uuid nulo para usuário local
            null,
            null,
            Date.now()
        ]
    );

    // Buscar a linha inserida
    const newUser = await getFirstAsync<Usuario>(
        `SELECT id, uuid, nome, email, criado_em FROM usuario WHERE id = ?`,
        id
    );
    if (!newUser) {
        console.error("Erro ao criar usuário no banco");
        return null;
    }

    // Salvar no storage
    await AsyncStorage.setItem(KEY_LOCAL_USER, JSON.stringify(newUser));

    return newUser;
}


export async function setLocalUserId(id: string) {
    await AsyncStorage.setItem(KEY_LOCAL_USER, id);
}