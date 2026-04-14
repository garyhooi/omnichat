import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply HTTP security headers
  app.use(helmet());

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  const prisma = app.get(PrismaService);
  
  // Enable CORS dynamically using the DB config
  app.enableCors({
    origin: async (origin, callback) => {
      // Localhost bypass for development
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
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
