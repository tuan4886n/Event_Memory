#!/bin/bash
echo "🧪 Running Auth Service tests..."
docker compose -f docker-compose.auth.test.yml down
docker compose -f docker-compose.auth.test.yml run --rm auth-service-test