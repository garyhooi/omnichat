# OmniChat Docker Deployment Guide

This guide covers deploying OmniChat with HEIC image conversion support using Docker and Bun.

## 🎯 Docker vs Manual Deployment

**Choose Docker deployment if:**
- ✅ You want simplified, single-command setup
- ✅ You need cross-platform consistency
- ✅ You prefer containerized environments
- ✅ You want automatic dependency management

**Choose manual deployment if:**
- ✅ You need full system control
- ✅ You want to avoid containerization overhead
- ✅ You have specific system requirements
- ✅ You prefer traditional deployment methods

**Both methods provide:**
- ✅ Identical HEIC conversion functionality
- ✅ Same application features
- ✅ Cross-platform support
- ✅ Production-ready performance

For manual deployment instructions, see [Manual Deployment Guide](MANUAL_DEPLOYMENT.md).

## Overview

This guide covers deploying OmniChat with HEIC image conversion support using Docker and Bun.

### Docker Deployment Benefits

- **Simplified Setup**: Single command deployment
- **Pre-configured Environment**: ImageMagick with HEIC support pre-installed
- **Cross-platform Consistency**: Same Docker image works everywhere
- **Dependency Management**: All dependencies in container
- **Isolated Environment**: No system conflicts

### Manual Deployment Alternative

For developers who prefer manual installation without Docker, comprehensive instructions are available in the [Manual Deployment Guide](MANUAL_DEPLOYMENT.md). Manual deployment requires:
- Manual ImageMagick installation on server OS
- Platform-specific configuration steps
- Direct system access
- More setup and maintenance effort

Both deployment methods provide identical HEIC conversion functionality and application features.

## Quick Start

### Local Development
```bash
# Build and start the container
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f api

# Stop the container
docker compose down
```

### Ubuntu Server
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose (if not included)
sudo apt install docker-compose
```

### Windows Server
1. Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/
2. Enable WSL 2 integration
3. Restart the server

### macOS (Development)
1. Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop

## Quick Start

### Local Development
```bash
# Build and start the container
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f api

# Stop the container
docker compose down
```

### Production Deployment
```bash
# Build and deploy
docker compose up -d --build --force-recreate

# Check container status
docker compose ps

# View logs
docker compose logs -f api

# Restart the service
docker compose restart api

# Stop the service
docker compose down
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional):

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=file:./dev.db
```

### Volume Mounts

The following volumes are configured for data persistence:

- `./apps/api/uploads:/app/apps/api/uploads` - Uploaded files
- `./apps/api/prisma/dev.db:/app/apps/api/prisma/dev.db` - SQLite database

## HEIC Image Support

The Docker container includes:

- **ImageMagick** with HEIC support
- **libheif** for HEIF/HEIC decoding
- **ghostscript-fonts** for font rendering

### HEIC Conversion Process

1. Image is uploaded in HEIC format
2. ImageMagick converts HEIC → JPEG
3. Sharp optimizes JPEG → WebP
4. WebP image is stored and served

### Supported Formats

- **Input**: HEIC, HEIF, JPEG, PNG, WEBP
- **Output**: WEBP (optimized)

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker compose logs api

# Verify ImageMagick is available
docker compose exec api convert --version

# Check disk space
df -h
```

### HEIC Conversion Fails
```bash
# Verify ImageMagick HEIC support
docker compose exec api identify -list format | grep HEIC

# Test HEIC conversion manually
docker compose exec api convert /path/to/test.heic /tmp/test.jpg

# Check ImageMagick configuration
docker compose exec api convert -list policy
```

### Permission Issues
```bash
# Fix upload directory permissions
chmod 755 ./apps/api/uploads
chown -R $USER:$USER ./apps/api/uploads
```

### Performance Issues
```bash
# Monitor container resources
docker stats

# Check logs for conversion errors
docker compose logs -f api | grep -i error
```

## Production Considerations

### Security
- Use environment variables for sensitive data
- Implement rate limiting (already configured)
- Keep images up to date: `docker compose pull && docker compose up -d`

### Backup Strategy
```bash
# Backup uploads
tar -czf uploads-backup.tar.gz ./apps/api/uploads

# Backup database
cp ./apps/api/prisma/dev.db ./apps/api/prisma/dev.db.backup

# Restore
tar -xzf uploads-backup.tar.gz
cp ./apps/api/prisma/dev.db.backup ./apps/api/prisma/dev.db
```

### Monitoring
```bash
# Container health
docker compose ps

# Resource usage
docker stats

# Application logs
docker compose logs -f api

# Recent logs (last 100 lines)
docker compose logs --tail=100 api
```

### Scaling
For higher traffic, consider:

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api:
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Platform-Specific Notes

### Ubuntu Server
- Works out of the box with Docker installed
- Uses Alpine Linux for smaller image size
- Full ImageMagick support

### Windows Server
- Run via WSL 2 or Docker Desktop
- Same functionality as Ubuntu
- May need to adjust volume paths

### macOS
- Perfect for local development
- Works with Docker Desktop
- Native macOS sips command as fallback

## Updates and Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build --force-recreate
```

### Update Docker Images
```bash
# Update base images
docker pull oven/bun:1-alpine

# Rebuild with new base image
docker compose build --no-cache
docker compose up -d
```

### Clean Up
```bash
# Remove old images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Clean build cache
docker builder prune
```

## Support

For issues related to:
- **HEIC conversion**: Check ImageMagick logs
- **Bun runtime**: Check application logs
- **Docker**: Use Docker troubleshooting commands
- **Application**: Check API logs and error messages

## Useful Commands

```bash
# Container shell access
docker compose exec api sh

# ImageMagick version
docker compose exec api convert --version

# Test ImageMagick
docker compose exec api identify -list format

# Database access
docker compose exec api bun prisma studio

# Run commands in container
docker compose exec api bun run prisma:push

# View container details
docker compose api inspect
```

## Performance Optimization

### Build Optimization
The `.dockerignore` file ensures:
- Smaller build context
- Faster build times
- Smaller final image size

### Runtime Optimization
- Bun provides faster runtime than Node.js
- ImageMagick with HEIC support is efficient
- Sharp optimizes WebP conversion
- Volume mounts for persistent storage

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Updates**: Keep images and dependencies updated
3. **Monitoring**: Monitor logs and resource usage
4. **Backups**: Regular backups of uploads and database
5. **Rate Limiting**: Already configured (10 uploads/minute)
6. **File Size Limits**: 5MB limit configured

## Next Steps

1. Configure environment variables
2. Set up volume mounts for data persistence
3. Test HEIC upload functionality
4. Set up monitoring and logging
5. Configure backup strategy
6. Plan for scaling if needed