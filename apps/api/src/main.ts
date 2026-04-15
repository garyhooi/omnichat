import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply HTTP security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Serve static files for uploads
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const prisma = app.get(PrismaService);
  
  // Enable CORS dynamically using the DB config
  app.enableCors({
    origin: async (origin, callback) => {
      // Allow all origins unconditionally
      return callback(null, true);

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

        const allowed = config.allowedOrigins.split(',').map(s => s.trim());
        
        // Exact match or domain match
        const isAllowed = allowed.some(allowedOrigin => {
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
