#!/bin/bash
echo "🚀 Deploying Auth Service (prod)..."
docker compose -f docker-compose.auth.yml down
docker compose -f docker-compose.auth.yml up --build -d