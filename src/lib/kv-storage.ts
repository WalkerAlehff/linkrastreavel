// Sistema de armazenamento KV que funciona localmente e pode ser facilmente
// substituído pelo Vercel KV em produção

// Para desenvolvimento: usar Map em memória com persistência opcional
// Para produção: substituir por @vercel/kv

class KVStorage {
  private static instance: KVStorage;
  private storage: Map<string, string>;

  private constructor() {
    this.storage = new Map();
  }

  static getInstance(): KVStorage {
    if (!KVStorage.instance) {
      KVStorage.instance = new KVStorage();
    }
    return KVStorage.instance;
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

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

// Exportar instância única
const kv = KVStorage.getInstance();

export async function saveLink(code: string, url: string): Promise<void> {
  await kv.set(`link:${code}`, url);
}

export async function getLink(code: string): Promise<string | null> {
  return await kv.get(`link:${code}`);
}

export async function linkExists(code: string): Promise<boolean> {
  return await kv.exists(`link:${code}`);
}
