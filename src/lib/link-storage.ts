// Sistema de armazenamento que usa Vercel KV em produção
// e fallback para memória em desenvolvimento

import { kv } from '@vercel/kv';

// Interface para o storage
interface LinkStorage {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  exists(key: string): Promise<boolean>;
}

// Storage em memória para desenvolvimento
class MemoryStorage implements LinkStorage {
  private storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async exists(key: string): Promise<boolean> {
    return this.storage.has(key);
  }
}

// Storage usando Vercel KV
class VercelKVStorage implements LinkStorage {
  async set(key: string, value: string): Promise<void> {
    await kv.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await kv.get<string>(key);
  }

  async exists(key: string): Promise<boolean> {
    const value = await kv.get(key);
    return value !== null;
  }
}

// Detectar qual storage usar
let storage: LinkStorage;

// Verificar se estamos em produção com KV configurado
if (process.env.KV_URL && process.env.KV_REST_API_URL) {
  console.log('Usando Vercel KV para armazenamento');
  storage = new VercelKVStorage();
} else {
  console.log('Usando armazenamento em memória (desenvolvimento)');
  storage = new MemoryStorage();
}

// Funções exportadas
export async function saveLink(code: string, url: string): Promise<void> {
  await storage.set(`link:${code}`, url);
}

export async function getLink(code: string): Promise<string | null> {
  return await storage.get(`link:${code}`);
}

export async function linkExists(code: string): Promise<boolean> {
  return await storage.exists(`link:${code}`);
}
