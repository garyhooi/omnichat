#!/usr/bin/env bash
# =============================================================================
# OmniChat — Database Provider Switcher
# =============================================================================
# Usage:
#   ./scripts/use-provider.sh <provider>
#
# Supported providers:
#   mysql       — MySQL 8+ (default)
#   postgresql  — PostgreSQL 14+
#   mongodb     — MongoDB 7+
#
# What this script does:
#   1. Validates the provider argument
#   2. Copies the matching schema overlay into prisma/schema.prisma
#   3. Runs `bun prisma generate` to regenerate the Prisma client
#
# The active schema.prisma is always the file Prisma reads.
# Provider-specific overlays live alongside it:
#   prisma/schema.mysql.prisma
#   prisma/schema.postgresql.prisma
#   prisma/schema.mongodb.prisma
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRISMA_DIR="$PROJECT_ROOT/apps/api/prisma"

# ---------------------------------------------------------------------------
# Argument validation
# ---------------------------------------------------------------------------
PROVIDER="${1:-}"

if [[ -z "$PROVIDER" ]]; then
  # Fall back to DATABASE_PROVIDER env var if no argument is given
  PROVIDER="${DATABASE_PROVIDER:-}"
fi

if [[ -z "$PROVIDER" ]]; then
  echo "Error: No provider specified."
  echo ""
  echo "Usage: $0 <mysql|postgresql|mongodb>"
  echo "  or set DATABASE_PROVIDER environment variable"
  exit 1
fi

# Normalize to lowercase
PROVIDER="$(echo "$PROVIDER" | tr '[:upper:]' '[:lower:]')"

case "$PROVIDER" in
  mysql|postgresql|mongodb)
    ;;
  postgres)
    # Accept "postgres" as an alias for "postgresql"
    PROVIDER="postgresql"
    ;;
  mongo)
    # Accept "mongo" as an alias for "mongodb"
    PROVIDER="mongodb"
    ;;
  *)
    echo "Error: Unsupported provider '$PROVIDER'"
    echo "Supported providers: mysql, postgresql, mongodb"
    exit 1
    ;;
esac

# ---------------------------------------------------------------------------
# Schema swap
# ---------------------------------------------------------------------------
SOURCE_SCHEMA="$PRISMA_DIR/schema.${PROVIDER}.prisma"

if [[ ! -f "$SOURCE_SCHEMA" ]]; then
  echo "Error: Schema file not found: $SOURCE_SCHEMA"
  exit 1
fi

echo "Switching Prisma provider to: $PROVIDER"
cp "$SOURCE_SCHEMA" "$PRISMA_DIR/schema.prisma"
echo "Copied $SOURCE_SCHEMA → $PRISMA_DIR/schema.prisma"

# ---------------------------------------------------------------------------
# Regenerate Prisma client
# ---------------------------------------------------------------------------
echo "Running prisma generate..."
cd "$PROJECT_ROOT/apps/api"
bun prisma generate

echo ""
echo "Done! Prisma client is now configured for: $PROVIDER"
echo "Make sure your DATABASE_URL in .env matches the $PROVIDER connection string."
