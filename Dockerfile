# OmniChat API — production image (PostgreSQL by default)
# The checked-in Prisma schema is the MongoDB variant (switched via
# scripts/use-provider.sh); this image selects DATABASE_PROVIDER at build time.
FROM oven/bun:1-alpine

ARG DATABASE_PROVIDER=postgresql

# Runtime deps: HEIC image conversion (upload pipeline) + Prisma (needs openssl)
RUN apk add --no-cache \
    imagemagick \
    imagemagick-heic \
    ghostscript-fonts \
    libheif \
    openssl

WORKDIR /app

# bun.lock is gitignored in this repo, so resolve from package.json.
COPY package.json ./
COPY apps/api ./apps/api
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web/dist ./apps/web/dist
COPY rag_templates ./rag_templates
COPY deploy/docker-entrypoint.sh ./deploy/docker-entrypoint.sh

RUN cp "apps/api/prisma/schema.${DATABASE_PROVIDER}.prisma" apps/api/prisma/schema.prisma

RUN bun install
RUN cd apps/api && ./node_modules/.bin/prisma generate
RUN bun run build:api

EXPOSE 3001
WORKDIR /app/apps/api

ENTRYPOINT ["sh", "/app/deploy/docker-entrypoint.sh"]
