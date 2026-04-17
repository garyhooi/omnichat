#!/bin/bash

# OmniChat Docker Deployment Script
# Supports Ubuntu, Windows Server (WSL2), and macOS

set -e

echo "🚀 OmniChat Docker Deployment Script"
echo "====================================="

# Detect operating system
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGW;;
    MSYS_NT*)   MACHINE=Git;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "Detected OS: ${MACHINE}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Ubuntu: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    echo "   Windows/macOS: Install Docker Desktop from https://www.docker.com/"
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is available
if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose is available"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p apps/api/uploads
mkdir -p apps/api/prisma

# Set permissions for uploads directory
chmod 755 apps/api/uploads

echo "✅ Directories created and permissions set"

# Stop existing container if running
if docker compose ps | grep -q "api.*Up"; then
    echo "🛑 Stopping existing container..."
    docker compose down
fi

# Build and start the container
echo "🏗️  Building Docker image with Bun and ImageMagick..."
docker compose up -d --build

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check if container is running
if docker compose ps | grep -q "api.*Up"; then
    echo "✅ Container is running successfully!"
    
    # Show container status
    echo ""
    echo "📊 Container Status:"
    docker compose ps
    
    # Show logs
    echo ""
    echo "📋 Recent Logs:"
    docker compose logs --tail=20 api
    
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "🌐 Access the application at: http://localhost:3001"
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:         docker compose logs -f api"
    echo "   Stop container:    docker compose down"
    echo "   Restart:           docker compose restart api"
    echo "   Check status:      docker compose ps"
    echo "   Container shell:   docker compose exec api sh"
    echo ""
    echo "🧪 Test HEIC upload functionality by uploading a .heic file"
    echo ""
else
    echo "❌ Container failed to start. Check logs:"
    docker compose logs api
    exit 1
fi