#!/bin/bash

echo "Instalando dependencias do projeto..."
npm install

echo ""
echo "Iniciando Docker Desktop..."
open -a Docker
sleep 2

echo ""
echo "Iniciando os containers (Docker)..."
docker compose up -d

echo ""
echo "Aguardando o banco de dados inicializar..."
sleep 18

echo ""
echo "Gerando o Prisma Client..."
npx prisma generate

echo ""
echo "Rodando as migrations..."
npx prisma migrate dev --name init

echo ""
echo "Executando o seed do banco de dados..."
npx prisma db seed

echo ""
echo "Iniciou o servidor http://localhost:3000/"
npm run dev