# =============================================================================
# OmniChat API — Multi-stage Docker build
# =============================================================================

# Stage 1: Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN bun install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN bun prisma generate

# Copy source and build
COPY tsconfig.json nest-cli.json ./
COPY src ./src
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json ./
RUN bun install --production

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose the API port
EXPOSE 3001

# Start the application
CMD ["bun", "dist/main"]