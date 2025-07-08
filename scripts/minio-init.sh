#!/bin/sh
# Entrypoint script to create bucket and set public read policy for MinIO
set -e

BUCKET="tpt-gallery"
MC_ALIAS="local"
MC_HOST="http://localhost:9000"
MC_USER="${MINIO_ROOT_USER:-minioadmin}"
MC_PASS="${MINIO_ROOT_PASSWORD:-minioadmin123}"

# Download mc CLI if not present
if ! command -v mc >/dev/null 2>&1; then
  echo "mc CLI not found, downloading..."
  curl -sSL -o /usr/local/bin/mc "https://dl.min.io/client/mc/release/linux-amd64/mc"
  chmod +x /usr/local/bin/mc
fi

# Wait for MinIO to be up
until curl -s $MC_HOST/minio/health/ready; do
  echo "Waiting for MinIO..."
  sleep 2
done

mc alias set $MC_ALIAS $MC_HOST $MC_USER $MC_PASS
mc mb --ignore-existing $MC_ALIAS/$BUCKET
mc policy set download $MC_ALIAS/$BUCKET
