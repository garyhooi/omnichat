import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import express = require('express');
import { join } from 'path';

async function bootstrap() {
  // Reject known default secrets in production
  if (process.env.NODE_ENV === 'production') {
    const KNOWN_DEFAULTS = [
      'omnichat-local-dev-secret-change-in-production',
      'omnichat-admin-key-change-in-production',
      'change-me-to-a-random-64-char-string',
    ];
    if (KNOWN_DEFAULTS.includes(process.env.JWT_SECRET || '')) {
      console.error('FATAL: JWT_SECRET is using the default development value. Set a strong, unique secret for production.');
      process.exit(1);
    }
    if (KNOWN_DEFAULTS.includes(process.env.ADMIN_API_KEY || '')) {
      console.error('FATAL: ADMIN_API_KEY is using the default development value. Set a strong, unique key for production.');
      process.exit(1);
    }
    if (KNOWN_DEFAULTS.includes(process.env.EXTERNAL_SITE_JWT_SECRET || '')) {
      console.error('FATAL: EXTERNAL_SITE_JWT_SECRET is using the default value. Set a strong, unique key for production.');
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // 'unsafe-inline' removed: the API serves no inline-script HTML (only JSON
        // + static uploads/rag-templates), so inline scripts are never legitimate.
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    xFrameOptions: { action: "deny" },
    xContentTypeOptions: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }));

  app.use(cookieParser());

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Non-image uploads are served as attachments (never inlined as a document),
  // so a masquerading file under /uploads cannot execute as HTML/SVG. Raster
  // images keep inline rendering for the chat lightbox/thumbnails.
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads'), {
    setHeaders: (res, filePath) => {
      if (!/\.(png|jpe?g|webp|gif|bmp)$/i.test(filePath)) {
        res.setHeader('Content-Disposition', 'attachment');
      }
    },
  }));
  expressApp.use('/rag-templates', express.static(join(process.cwd(), '..', '..', 'rag_templates')));

  const prisma = app.get(PrismaService);
  
  app.enableCors({
    origin: async (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
          if (!origin) {
        return callback(null, true);
      }

      // Allow localhost (hostname-precise — startsWith matched "http://localhost.attacker.com")
      try {
        const host = new URL(origin).hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
          return callback(null, true);
        }
      } catch { /* not a URL origin — fall through to the DB allowlist */ }

      try {
        const config = await prisma.siteConfig.findFirst({
          where: { isActive: true },
        });

        if (!config || !config.allowedOrigins) {
          return callback(new Error('CORS not configured in database'));
        }

        if (config.allowedOrigins === '*') {
          return callback(null, true);
        }

        const allowed = config.allowedOrigins.split(',').map((s: string) => s.trim());
        
        // Exact match or genuine subdomain match
        const isAllowed = allowed.some((allowedOrigin: string) => {
          try {
            const candidateHost = new URL(origin).hostname;
            const allowedHost = new URL(allowedOrigin).hostname;
            if (candidateHost === allowedHost) return true;
            return candidateHost.endsWith('.' + allowedHost);
          } catch {
            return origin === allowedOrigin;
          }
        });

        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } catch (err) {
        callback(new Error('CORS check failed'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`OmniChat API running on port ${port}`);
}

bootstrap();
