import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Headers, ForbiddenException, Optional, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { Request } from 'express';
import * as sharp from 'sharp';
import { UploadTokenService } from './upload-token.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadTokenService: UploadTokenService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Restrict uploads to 10 per minute
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = randomUUID();
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
    @Optional() uploadToken?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check for upload token or JWT auth
    let token = uploadToken;
    
    // Extract token from Authorization header if present (Bearer token or just the token)
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    // Validate token if provided (for visitor uploads)
    if (token && token.startsWith('upload_')) {
      try {
        const conversationId = await this.uploadTokenService.validateToken(token);
        await this.uploadTokenService.markTokenAsUsed(token);
      } catch (error) {
        throw new ForbiddenException('Invalid or expired upload token');
      }
    }

    // Generate a thumbnail
    const ext = extname(file.filename);
    const thumbFilename = file.filename.replace(ext, `-thumb${ext}`);
    const thumbPath = join(file.destination, thumbFilename);

    try {
      await sharp(file.path)
        .resize(150, 150, { fit: 'cover' })
        .toFile(thumbPath);
    } catch (err) {
      console.error('Failed to generate thumbnail', err);
      // Fallback: If thumbnail generation fails, return the original URL as thumbnail
      return {
        url: `/uploads/${file.filename}`,
        thumbnailUrl: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      };
    }

    return {
      url: `/uploads/${file.filename}`,
      thumbnailUrl: `/uploads/${thumbFilename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
