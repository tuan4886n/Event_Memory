#!/bin/bash
echo "Deploying Event Service (prod)..."
docker compose -f docker-compose.event.yml down
docker compose -f docker-compose.event.yml up --build -d