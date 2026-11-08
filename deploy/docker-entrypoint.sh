#!/bin/sh
# OmniChat API container entrypoint.
# Keeps the PostgreSQL schema in sync (idempotent) before starting the API.
set -e

attempt=1
while true; do
  if ./node_modules/.bin/prisma db push --skip-generate; then
    break
  fi
  if [ "$attempt" -ge 5 ]; then
    echo "[entrypoint] ERROR: Prisma schema push failed after $attempt attempts"
    exit 1
  fi
  echo "[entrypoint] db push failed (attempt $attempt), retrying in 5s..."
  attempt=$((attempt + 1))
  sleep 5
done

echo "[entrypoint] starting OmniChat API..."
exec bun run start:prod
