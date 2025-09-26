# Instruções para Deploy no Vercel

## 1. Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `linkrastreavel` (ou outro de sua preferência)
3. Deixe como público ou privado
4. **NÃO** inicialize com README, .gitignore ou licença
5. Clique em "Create repository"

## 2. Conectar e fazer push

Após criar o repositório, execute estes comandos no terminal:

```bash
# Substitua SEU_USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/linkrastreavel.git
git branch -M main
git push -u origin main
```

## 3. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Importe o repositório `linkrastreavel`
5. Configure as variáveis de ambiente:
   - Nome: `NEXT_PUBLIC_BASE_URL`
   - Valor: deixe vazio por enquanto (será preenchido após o deploy)
6. Clique em "Deploy"

## 4. Após o deploy

1. Copie a URL do seu projeto (ex: `linkrastreavel.vercel.app`)
2. Vá em Settings → Environment Variables
3. Edite `NEXT_PUBLIC_BASE_URL` e coloque a URL do projeto (sem https://)
4. Faça um redeploy para aplicar as mudanças

## Variáveis de Ambiente

- `NEXT_PUBLIC_BASE_URL`: URL base do seu site (ex: `linkrastreavel.vercel.app`)
  - Usado para gerar os links curtos corretos
  - Em desenvolvimento local, deixe vazio ou use `localhost:3000`

## Estrutura de Links

- Link original: `https://checkout.infinitepay.io/checkout/...`
- Link encurtado: `https://seu-dominio.vercel.app/p/ABC123`

## Notas Importantes

1. O armazenamento de links está em memória (temporário)
   - Para produção, considere usar um banco de dados (Vercel KV, PostgreSQL, etc.)
   
2. A API da InfinitePay é pública e não requer autenticação
   - Os pagamentos são direcionados para o handle especificado no formulário

3. Para personalizar o domínio:
   - Vá em Settings → Domains no Vercel
   - Adicione seu domínio personalizado
