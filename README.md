# Link de Pagamento - InfinitePay

Um site minimalista para criar links de pagamento de forma simples e rápida, integrado com a InfinitePay.

## Funcionalidades

- ✨ Interface minimalista e intuitiva
- 💳 Geração de links de pagamento personalizados
- 📦 Opção de associar produtos aos links
- 🖼️ Suporte para imagens de produtos
- 🔗 Integração com checkout da InfinitePay

## Como usar

1. **Preencha o valor**: Digite o valor do pagamento em reais
2. **Informe o recebedor**: Digite o handle do usuário que receberá o pagamento
3. **Produto (opcional)**: Clique em "Associar produto ao link" para adicionar informações do produto
4. **Gere o link**: Clique em "Gerar Link de Pagamento"
5. **Compartilhe**: Copie o link gerado e envie para o pagador

## Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [seu-repositorio]

# Entre na pasta
cd linkrastreavel

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   └── generate-payment-link/    # API para gerar links
│   ├── layout.tsx                    # Layout global
│   └── page.tsx                      # Página principal
├── components/
│   ├── PaymentLinkForm.tsx           # Formulário principal
│   ├── ProductModal.tsx              # Modal de produto
│   └── GeneratedLink.tsx             # Exibição do link gerado
└── types/
    └── index.ts                      # Tipos TypeScript
```

## Integração InfinitePay

O site utiliza a API de checkout da InfinitePay para gerar links de pagamento. Quando um produto não é especificado, usa-se "Link de Pagamento" como descrição padrão.

### Fluxo de Pagamento

1. Usuário preenche o formulário
2. Sistema gera um `order_nsu` único
3. API da InfinitePay cria o link de checkout
4. Link é exibido para o usuário
5. Pagador acessa o link e realiza o pagamento
6. Valor é creditado para o handle especificado

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- API InfinitePay