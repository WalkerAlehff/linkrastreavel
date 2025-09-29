# Configuração Alternativa do Vercel KV

## Se não aparecer "Connect Store" no seu projeto:

### Opção 1: Criar KV pelo Dashboard Global

1. Acesse: **https://vercel.com/dashboard/stores**
2. Clique em **"Create Database"** ou **"Create Store"**
3. Selecione **"KV"**
4. Configure:
   - Nome: `linkrastreavel-kv`
   - Região: escolha a mais próxima
5. Após criar, clique em **"Connect Project"**
6. Selecione seu projeto `linkrastreavel`

### Opção 2: Via CLI (se tiver Vercel CLI instalado)

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# No diretório do projeto
vercel link

# Adicionar KV
vercel env pull
```

### Opção 3: Configuração Manual

Se nenhuma opção funcionar, você pode:

1. **Usar o site SEM Vercel KV** (funciona perfeitamente!)
   - Os links funcionam durante a sessão
   - Para projetos pequenos é suficiente

2. **Ou adicionar manualmente as variáveis** (se já tiver um KV criado):
   - Vá em Settings → Environment Variables
   - Adicione:
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

## 💡 Importante:

**O site funciona perfeitamente SEM o Vercel KV!**

- Em produção sem KV: Links duram enquanto o servidor estiver ativo
- Com KV: Links são permanentes

Para a maioria dos casos de uso, o sistema em memória é suficiente.

## 🚀 Solução Rápida:

**Faça o deploy sem KV por enquanto!** O site funcionará normalmente e você pode adicionar o KV depois quando precisar de persistência permanente.
