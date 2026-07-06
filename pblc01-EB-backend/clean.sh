#!/bin/bash

echo "Parando containers..."
docker compose down -v

echo "Removendo node_modules..."
rm -rf node_modules

echo "Removendo generated..."
rm -rf generated

echo "Removendo migrations..."
rm -rf prisma/migrations

echo "Removendo volumes..."
rm -rf volumes

echo "Limpeza concluida!"