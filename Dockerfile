FROM oven/bun:1-alpine

# Install system dependencies including ImageMagick with HEIC support
RUN apk add --no-cache \
    imagemagick \
    imagemagick-heic \
    ghostscript-fonts \
    libheif

# Set up application directory
WORKDIR /app

# Copy package files from root (for workspace setup)
COPY package.json bun.lockb ./

# Copy workspace apps
COPY apps/api ./apps/api
COPY apps/web ./apps/web

# Install dependencies using bun
RUN bun install --frozen-lockfile

# Build both API and web applications
RUN bun run build:api
RUN bun run build:web

# Expose application port
EXPOSE 3001

# Set working directory to API app
WORKDIR /app/apps/api

# Start the API application using bun
CMD ["bun", "run", "start:prod"]