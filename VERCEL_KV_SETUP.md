# Configuração do Vercel KV

## 🚀 Como ativar o Vercel KV no seu projeto

### 1. Após fazer o deploy no Vercel:

1. Acesse o painel do seu projeto no Vercel
2. Vá para a aba **"Storage"**
3. Clique em **"Connect Store"**
4. Selecione **"KV"**
5. Clique em **"Continue"**
6. Dê um nome para seu banco (ex: `linkrastreavel-kv`)
7. Selecione a região mais próxima
8. Clique em **"Create & Connect"**

### 2. As variáveis de ambiente serão adicionadas automaticamente:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. Faça um redeploy:

Após conectar o KV, faça um novo deploy para que as variáveis sejam aplicadas.

## ✅ Como funciona o código:

O sistema detecta automaticamente se o Vercel KV está disponível:

```typescript
// Em produção com KV: usa Vercel KV (persistente)
// Em desenvolvimento: usa memória (temporário)
```

## 📊 Limites do plano gratuito:

- **3,000 comandos/mês**
- **256 MB de armazenamento**
- **1 GB de transferência**

Para um site de links de pagamento, isso permite aproximadamente:
- Criar 1,000 links por mês
- 2,000 acessos a esses links

## 🔍 Monitoramento:

No painel do Vercel, você pode ver:
- Quantidade de comandos usados
- Armazenamento utilizado
- Performance das requisições

## 💡 Dicas:

1. Os links são permanentes após configurar o KV
2. Não precisa mudar nada no código
3. O sistema funciona automaticamente
4. Em desenvolvimento, continua usando memória
