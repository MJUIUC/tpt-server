#!/bin/bash

set -e

# Check if the postgres container is running
if ! docker ps --filter "name=tpt-postgres" --filter "status=running" | grep tpt-postgres > /dev/null; then
  echo "Starting PostgreSQL and MinIO containers (local compose)..."
  docker compose -f docker-compose.local.yml up -d
else
  echo "PostgreSQL container already running."
fi

# Wait for the database to be ready
DB_HOST="localhost"
DB_PORT="5432"
echo "Waiting for PostgreSQL to be available on $DB_HOST:$DB_PORT..."
until nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "PostgreSQL is available."

# Run Prisma migrate dev before seeding
echo "Running Prisma migrations..."
pnpm prisma migrate dev --name dev-init --skip-seed

# Run Prisma seed before starting the server
echo "Seeding the database with Prisma..."
pnpm prisma db seed

# Function to start nodemon and retry if it fails
start_nodemon() {
  while true; do
    echo "Starting Nodemon..."
    npx nodemon --signal SIGTERM
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 0 ]; then
      break
    else
      echo "Nodemon crashed. Retrying in 2 seconds..."
      sleep 2
    fi
  done
}

start_nodemon
