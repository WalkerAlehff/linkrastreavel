#!/bin/bash

# Script para criar repositório no GitHub e fazer push

echo "🚀 Configurando repositório GitHub para WalkerAlehff/linkrastreavel"

# Adicionar remote origin
git remote add origin https://github.com/WalkerAlehff/linkrastreavel.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push inicial
echo "📤 Enviando código para o GitHub..."
echo "Você será solicitado a inserir suas credenciais do GitHub"
git push -u origin main

echo "✅ Pronto! Seu código está no GitHub!"
echo "📎 URL do repositório: https://github.com/WalkerAlehff/linkrastreavel"
echo ""
echo "⚠️  IMPORTANTE: Antes de executar este script, você precisa:"
echo "1. Criar o repositório em: https://github.com/new"
echo "2. Nome do repositório: linkrastreavel"
echo "3. NÃO inicialize com README, .gitignore ou licença"

