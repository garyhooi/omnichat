# Manual Deployment Guide

This guide covers deploying OmniChat with HEIC image support **without Docker** using manual system installation and configuration.

## Overview

OmniChat supports both Docker and manual deployment methods. This guide focuses on manual deployment where developers install system dependencies (ImageMagick) directly on their server OS.

## 🎯 Why Choose Manual Deployment?

**Advantages:**
- ✅ Full control over system configuration
- ✅ No containerization overhead
- ✅ Direct access to system resources
- ✅ Familiar deployment process
- ✅ Lightweight resource usage

**Disadvantages:**
- ❌ Manual system configuration required
- ❌ Platform-specific setup steps
- ❌ No environment isolation
- ❌ More complex dependency management

## 📋 Prerequisites

### System Requirements

- **Operating System**: Ubuntu 20.04+, Windows Server 2019+, or macOS 10.15+
- **Node.js/Bun**: Bun runtime (recommended) or Node.js 18+
- **Memory**: Minimum 2GB RAM, 4GB recommended
- **Disk Space**: 10GB available space
- **Database**: MongoDB, PostgreSQL, or MySQL
- **ImageMagick**: For HEIC conversion support

### Required Software

- Bun runtime (recommended) or Node.js
- ImageMagick with HEIC support
- Database server (MongoDB/PostgreSQL/MySQL)
- Process manager (PM2, systemd, etc.) for production

## 🚀 Platform-Specific Setup

### Ubuntu Server

#### 1. Install System Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install ImageMagick with HEIC support
sudo apt install -y imagemagick libheif-dev libheif-examples

# Verify ImageMagick installation
convert --version

# Verify HEIC support
convert -list format | grep -i heic
# Expected output: HEIC* rw-- High Efficiency Image Coding (libheif)
```

#### 2. Install Bun Runtime

```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

#### 3. Set Up Database

**MongoDB:**
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**PostgreSQL:**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**MySQL:**
```bash
# Install MySQL
sudo apt install -y mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 4. Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd omnichat

# Install dependencies
bun install

# Configure environment
cp apps/api/.env.example apps/api/.env
nano apps/api/.env

# Update DATABASE_URL with your database connection string
# Example for MongoDB:
# DATABASE_URL="mongodb://localhost:27017/omnichat"

# Example for PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/omnichat"

# Example for MySQL:
# DATABASE_URL="mysql://root:password@localhost:3306/omnichat"

# Run database migrations
bun run prisma:generate
bun run prisma:push

# Build application
bun run build:api
bun run build:web

# Start development server
bun run dev:api
```

### Windows Server

#### 1. Install System Dependencies

**Install ImageMagick:**
1. Download ImageMagick installer: https://imagemagick.org/script/download.php#windows
2. Run the installer with these options:
   - ✅ Install ImageMagick application files
   - ✅ Install development headers and libraries
   - ✅ Add application directory to system path
   - ✅ Associate supported file types with ImageMagick
3. Verify installation:
```powershell
convert --version
```

**Install Git:**
```powershell
# Download Git for Windows
https://git-scm.com/download/win
```

#### 2. Install Bun Runtime

```powershell
# Install Bun using PowerShell
irm bun.sh/install.ps1 | iex

# Verify installation
bun --version
```

#### 3. Set Up Database

**MongoDB:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer and follow prompts
3. Configure MongoDB as Windows Service
4. Start MongoDB service: `Start-Service MongoDB`

**PostgreSQL:**
1. Download PostgreSQL installer: https://www.postgresql.org/download/windows/
2. Run installer and set password
3. Configure PostgreSQL service to start automatically
4. Start PostgreSQL service: `Start-Service postgresql-x64-13`

**MySQL:**
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Run installer and select "Developer Default"
3. Configure root password
4. Start MySQL service: `Start-Service MySQL80`

#### 4. Deploy Application

```powershell
# Clone repository
git clone <repository-url>
cd omnichat

# Install dependencies
bun install

# Configure environment
Copy-Item apps/api/.env.example apps/api/.env
notepad apps/api/.env

# Update DATABASE_URL with your database connection string
# Example for MongoDB:
# DATABASE_URL="mongodb://localhost:27017/omnichat"

# Example for PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/omnichat"

# Example for MySQL:
# DATABASE_URL="mysql://root:password@localhost:3306/omnichat"

# Run database migrations
bun run prisma:generate
bun run prisma:push

# Build application
bun run build:api
bun run build:web

# Start development server
bun run dev:api
```

### macOS

#### 1. Install System Dependencies

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install ImageMagick with HEIC support
brew install imagemagick

# Verify ImageMagick installation
convert --version

# Note: macOS also has built-in sips command that can handle HEIC
sips --version
```

#### 2. Install Bun Runtime

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

#### 3. Set Up Database

**MongoDB:**
```bash
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**PostgreSQL:**
```bash
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14
```

**MySQL:**
```bash
brew install mysql

# Start MySQL
brew services start mysql
```

#### 4. Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd omnichat

# Install dependencies
bun install

# Configure environment
cp apps/api/.env.example apps/api/.env
nano apps/api/.env

# Update DATABASE_URL with your database connection string
# Example for MongoDB:
# DATABASE_URL="mongodb://localhost:27017/omnichat"

# Example for PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/omnichat"

# Example for MySQL:
# DATABASE_URL="mysql://root:password@localhost:3306/omnichat"

# Run database migrations
bun run prisma:generate
bun run prisma:push

# Build application
bun run build:api
bun run build:web

# Start development server
bun run dev:api
```

## 🔧 Production Setup

### Process Management

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
cd apps/api
pm2 start "bun dist/main" --name omnichat-api

# Start application with auto-restart
pm2 startup
pm2 save

# View logs
pm2 logs omnichat-api

# Monitor application
pm2 monit

# Restart application
pm2 restart omnichat-api

# Stop application
pm2 stop omnichat-api
```

#### Using systemd (Linux)

Create systemd service file `/etc/systemd/system/omnichat.service`:

```ini
[Unit]
Description=OmniChat API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/omnichat/apps/api
ExecStart=/usr/local/bin/bun dist/main
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable omnichat
sudo systemctl start omnichat

# View logs
sudo journalctl -u omnichat -f

# Restart service
sudo systemctl restart omnichat
```

### Reverse Proxy Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        client_max_body_size 5M;
    }

    location /uploads/ {
        alias /path/to/omnichat/apps/api/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com

    ProxyPreserveHost On
    ProxyRequests Off

    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/

    ProxyPass /socket.io/ http://localhost:3001/socket.io/
    ProxyPassReverse /socket.io/ http://localhost:3001/socket.io/

    <Location /socket.io/>
        ProxyPass ws://localhost:3001/socket.io/
        ProxyPassReverse ws://localhost:3001/socket.io/
    </Location>

    Alias /uploads/ /path/to/omnichat/apps/api/uploads/

    <Directory /path/to/omnichat/apps/api/uploads/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        ExpiresActive On
        ExpiresDefault "access plus 30 days"
    </Directory>
</VirtualHost>
```

## 🧪 Testing HEIC Conversion

### Manual Testing

```bash
# Test ImageMagick HEIC conversion
convert test.heic test.jpg

# Test HEIC support
identify -list format | grep -i heic

# Test conversion quality
convert test.heic -quality 80 test.webp
```

### Application Testing

1. **Start the application**
```bash
bun run dev:api
```

2. **Upload HEIC file**
   - Open the web application
   - Try uploading a HEIC file
   - Check that conversion succeeds

3. **Check logs**
```bash
# Look for HEIC conversion messages
tail -f apps/api/logs/combined.log | grep -i heic
```

### API Testing

```bash
# Test upload endpoint
curl -X POST http://localhost:3001/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@test.heic"

# Expected response:
{
  "url": "/uploads/conversations/xxx.webp",
  "thumbnailUrl": "/uploads/conversations/xxx-thumb.webp",
  "filename": "xxx.webp",
  "mimetype": "image/webp",
  "size": 123456
}
```

## 🔍 Troubleshooting

### ImageMagick Issues

**ImageMagick not found:**
```bash
# Check if ImageMagick is installed
which convert

# Verify installation
convert --version

# Reinstall ImageMagick
# Ubuntu:
sudo apt reinstall imagemagick libheif-dev

# macOS:
brew reinstall imagemagick

# Windows: Reinstall from installer
```

**HEIC support missing:**
```bash
# Check HEIC format support
convert -list format | grep -i heic

# If missing, install HEIC libraries
# Ubuntu:
sudo apt install libheif-dev libheif-examples

# macOS:
brew install libheif

# Windows: Included in ImageMagick installer
```

### Permission Issues

**Temp directory not writable:**
```bash
# Check /tmp permissions
ls -la /tmp

# Fix permissions
sudo chmod 777 /tmp

# Or specify custom temp directory in code
```

**Uploads directory permissions:**
```bash
# Create uploads directory
mkdir -p apps/api/uploads

# Set proper permissions
chmod 755 apps/api/uploads
chown -R $USER:$USER apps/api/uploads
```

### Database Issues

**Connection refused:**
```bash
# Check database status
# MongoDB:
sudo systemctl status mongod

# PostgreSQL:
sudo systemctl status postgresql

# MySQL:
sudo systemctl status mysql

# Check connection
mongosh --eval "db.adminCommand('ping')"
```

**Prisma errors:**
```bash
# Regenerate Prisma client
bun run prisma:generate

# Push schema changes
bun run prisma:push

# Reset database (be careful!)
bun run prisma:push --force-reset
```

### Performance Issues

**Slow HEIC conversion:**
```bash
# Check system resources
top
htop

# Optimize ImageMagick
# Edit /etc/ImageMagick-6/policy.xml
# Increase memory and disk limits
```

**Memory issues:**
```bash
# Increase swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Add to /etc/fstab for persistence
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 📊 Maintenance

### Updates

```bash
# Update application
git pull
bun install
bun run build:api
pm2 restart omnichat-api

# Update system dependencies
sudo apt update && sudo apt upgrade -y  # Ubuntu
brew upgrade                           # macOS
```

### Backups

```bash
# Backup database
mongodump --out /backup/mongodb-$(date +%Y%m%d)      # MongoDB
pg_dump omnichat > /backup/postgres-$(date +%Y%m%d).sql # PostgreSQL
mysqldump omnichat > /backup/mysql-$(date +%Y%m%d).sql     # MySQL

# Backup uploads
tar -czf /backup/uploads-$(date +%Y%m%d).tar.gz apps/api/uploads

# Restore
mongorestore /backup/mongodb-20241215               # MongoDB
psql omnichat < /backup/postgres-20241215.sql       # PostgreSQL
mysql omnichat < /backup/mysql-20241215.sql         # MySQL
tar -xzf /backup/uploads-20241215.tar.gz
```

### Monitoring

```bash
# Check application logs
pm2 logs omnichat-api

# Monitor system resources
htop
df -h
free -m

# Check ImageMagick conversion logs
tail -f /var/log/omnichat/conversion.log
```

## 🔒 Security

### Firewall Configuration

```bash
# Ubuntu UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Windows Firewall
# Allow HTTP/HTTPS traffic through Windows Firewall
```

### Environment Variables

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use strong secrets
# Generate JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set secure database passwords
# Use environment-specific databases
```

### SSL/TLS Configuration

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (certbot handles this automatically)
sudo certbot renew --dry-run
```

## 📚 Additional Resources

- [Bun Documentation](https://bun.sh/)
- [ImageMagick Documentation](https://imagemagick.org/)
- [NestJS Documentation](https://nestjs.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Prisma Documentation](https://www.prisma.io/)

## 🆘 Getting Help

1. Check logs: `pm2 logs omnichat-api`
2. Verify ImageMagick: `convert --version`
3. Test database connection
4. Check system resources
5. Review this troubleshooting section
6. Open an issue on GitHub

## 🎯 Next Steps

1. Complete platform-specific setup
2. Test HEIC upload functionality
3. Configure reverse proxy
4. Set up SSL certificates
5. Configure monitoring and logging
6. Set up automated backups
7. Implement security best practices

Manual deployment provides full control over your environment but requires more setup and maintenance compared to Docker deployment. Choose the deployment method that best fits your infrastructure and team preferences.