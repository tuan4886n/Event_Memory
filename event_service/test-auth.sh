#!/bin/bash
echo "Running Event Service tests..."
docker compose -f docker-compose.event.test.yml down
docker compose -f docker-compose.event.test.yml run --rm event-service-test