# OmniChat API — production image (PostgreSQL)
# Build context: repository root. Used by Openship (see openship.json).
FROM oven/bun:1-alpine

# Runtime deps: HEIC image conversion (upload pipeline) + Prisma (needs openssl)
RUN apk add --no-cache \
    imagemagick \
    imagemagick-heic \
    ghostscript-fonts \
    libheif \
    openssl

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api ./apps/api
COPY rag_templates ./rag_templates
COPY deploy/docker-entrypoint.sh ./deploy/docker-entrypoint.sh

# The checked-in Prisma schema is the MongoDB variant (switched via
# scripts/use-provider.sh). Production runs PostgreSQL.
RUN cp apps/api/prisma/schema.postgresql.prisma apps/api/prisma/schema.prisma

RUN bun install --frozen-lockfile
RUN cd apps/api && bunx prisma generate
RUN bun run build:api

EXPOSE 3001
WORKDIR /app/apps/api

ENTRYPOINT ["sh", "/app/deploy/docker-entrypoint.sh"]
