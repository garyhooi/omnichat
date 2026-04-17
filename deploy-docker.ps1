# OmniChat Docker Deployment Script for Windows
# Run with: PowerShell -ExecutionPolicy Bypass -File deploy-docker.ps1

Write-Host "🚀 OmniChat Docker Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop from https://www.docker.com/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is installed" -ForegroundColor Green

# Check if Docker Compose is available
$dockerComposeAvailable = docker compose version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Compose is not available. Please ensure Docker Desktop is running." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker Compose is available" -ForegroundColor Green

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "apps/api/uploads" | Out-Null
New-Item -ItemType Directory -Force -Path "apps/api/prisma" | Out-Null

Write-Host "✅ Directories created" -ForegroundColor Green

# Stop existing container if running
$existingContainer = docker compose ps --format json | ConvertFrom-Json | Where-Object { $_.State -eq "running" -and $_.Service -eq "api" }
if ($existingContainer) {
    Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
    docker compose down | Out-Null
}

# Build and start the container
Write-Host "🏗️  Building Docker image with Bun and ImageMagick..." -ForegroundColor Yellow
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed. Check error messages above." -ForegroundColor Red
    exit 1
}

# Wait for container to start
Write-Host "⏳ Waiting for container to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check if container is running
$runningContainer = docker compose ps --format json | ConvertFrom-Json | Where-Object { $_.State -eq "running" -and $_.Service -eq "api" }
if ($runningContainer) {
    Write-Host "✅ Container is running successfully!" -ForegroundColor Green
    
    # Show container status
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Cyan
    docker compose ps
    
    # Show logs
    Write-Host ""
    Write-Host "📋 Recent Logs:" -ForegroundColor Cyan
    docker compose logs --tail=20 api
    
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access the application at: http://localhost:3001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Useful commands:" -ForegroundColor Cyan
    Write-Host "   View logs:         docker compose logs -f api"
    Write-Host "   Stop container:    docker compose down"
    Write-Host "   Restart:           docker compose restart api"
    Write-Host "   Check status:      docker compose ps"
    Write-Host "   Container shell:   docker compose exec api sh"
    Write-Host ""
    Write-Host "🧪 Test HEIC upload functionality by uploading a .heic file" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "❌ Container failed to start. Check logs:" -ForegroundColor Red
    docker compose logs api
    exit 1
}