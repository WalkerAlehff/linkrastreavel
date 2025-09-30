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
5. Clique em "Deploy"

## 4. Após o deploy

Seu projeto estará disponível na URL fornecida pelo Vercel (ex: `linkrastreavel.vercel.app`)

## Estrutura de Links

- Link de pagamento: `https://checkout.infinitepay.io/checkout/...`
  - Gerado diretamente pela API da InfinitePay
  - Contém todos os dados do pagamento

## Notas Importantes

1. A API da InfinitePay é pública e não requer autenticação
   - Os pagamentos são direcionados para o handle especificado no formulário

2. Para personalizar o domínio:
   - Vá em Settings → Domains no Vercel
   - Adicione seu domínio personalizado
