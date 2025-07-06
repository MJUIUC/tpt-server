#!/bin/bash

set -e

# Check if the postgres container is running
if ! docker ps --filter "name=tpt-postgres" --filter "status=running" | grep tpt-postgres > /dev/null; then
  echo "Starting PostgreSQL container..."
  docker compose up -d
else
  echo "PostgreSQL container already running."
fi

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
