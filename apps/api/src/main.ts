import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import express = require('express');
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply HTTP security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
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

  // Serve static files for uploads
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const prisma = app.get(PrismaService);
  
  // Enable CORS dynamically using the DB config
  app.enableCors({
    origin: async (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost for development
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }

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
        
        // Exact match or domain match
        const isAllowed = allowed.some((allowedOrigin: string) => {
          return origin === allowedOrigin || origin.endsWith('.' + allowedOrigin.replace(/^https?:\/\//, ''));
        });

        if (isAllowed) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } catch (err) {
        callback(new Error('CORS check failed'));
      }
    },
    credentials: true,
  });

  // Global validation pipe for DTO validation
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
