#!/bin/bash
# minio-utils.sh
# Utility functions for MinIO bucket management and file uploads

# Set these to match your MinIO setup
export MINIO_ENDPOINT="http://localhost:9000"
export MINIO_ACCESS_KEY="minioadmin"
export MINIO_SECRET_KEY="minioadmin"

# Upload a file to a bucket
minio_upload_file() {
  local LOCAL_FILE="$1"
  local BUCKET="$2"
  local OBJECT_KEY="${3:-$(basename "$LOCAL_FILE")}" 
  if [[ -z "$LOCAL_FILE" || -z "$BUCKET" ]]; then
    echo "Usage: minio_upload_file <local-file-path> <bucket-name> [object-key]"
    return 1
  fi
  aws --endpoint-url "$MINIO_ENDPOINT" s3 cp "$LOCAL_FILE" "s3://$BUCKET/$OBJECT_KEY"
  if [[ $? -eq 0 ]]; then
    echo "Upload successful!"
    echo "Resource path: s3://$BUCKET/$OBJECT_KEY"
    echo "Direct URL: $MINIO_ENDPOINT/$BUCKET/$OBJECT_KEY"
  else
    echo "Upload failed."
    return 1
  fi
}

# List all buckets
minio_list_buckets() {
  aws --endpoint-url "$MINIO_ENDPOINT" s3 ls
}

# Create a bucket if it doesn't exist
minio_create_bucket() {
  local BUCKET="$1"
  if [[ -z "$BUCKET" ]]; then
    echo "Usage: minio_create_bucket <bucket-name>"
    return 1
  fi
  aws --endpoint-url "$MINIO_ENDPOINT" s3 mb "s3://$BUCKET"
}

# Delete a bucket (must be empty)
minio_delete_bucket() {
  local BUCKET="$1"
  if [[ -z "$BUCKET" ]]; then
    echo "Usage: minio_delete_bucket <bucket-name>"
    return 1
  fi
  aws --endpoint-url "$MINIO_ENDPOINT" s3 rb "s3://$BUCKET"
}

# List objects in a bucket
minio_list_objects() {
  local BUCKET="$1"
  if [[ -z "$BUCKET" ]]; then
    echo "Usage: minio_list_objects <bucket-name>"
    return 1
  fi
  aws --endpoint-url "$MINIO_ENDPOINT" s3 ls "s3://$BUCKET/"
}

if [[ "${BASH_SOURCE[0]}" != "$0" ]]; then
  echo "MinIO utility functions loaded!"
  echo "Available commands:"
  echo "  minio_upload_file <local-file-path> <bucket-name> [object-key]"
  echo "  minio_list_buckets"
  echo "  minio_create_bucket <bucket-name>"
  echo "  minio_delete_bucket <bucket-name>"
  echo "  minio_list_objects <bucket-name>"
fi
