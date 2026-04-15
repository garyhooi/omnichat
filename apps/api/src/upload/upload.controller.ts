import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Headers, ForbiddenException, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { Request } from 'express';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import { UploadTokenService } from './upload-token.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadTokenService: UploadTokenService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Restrict uploads to 10 per minute
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        // Enforce the mimetype check, but we will also verify content with sharp
        if (!file.mimetype.match(/\/(webp)$/) && !file.mimetype.startsWith('audio/')) {
          return callback(new BadRequestException('Only WebP images and audio files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
    @Body('conversationId') conversationId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check for upload token or JWT auth
    let token = '';
    
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    if (token && token.startsWith('upload_')) {
      try {
        await this.uploadTokenService.validateToken(token);
        // allow reusing the token for subsequent uploads
      } catch (error) {
        throw new ForbiddenException('Invalid or expired upload token');
      }
    }

    
    const isAudio = file.mimetype.startsWith('audio/');
    const uniqueSuffix = randomUUID();
    const prefix = conversationId ? `${conversationId}-` : '';
    
    if (isAudio) {
      const ext = file.originalname.split('.').pop()?.toLowerCase() || 'mp3';
      const filename = `${prefix}${uniqueSuffix}.${ext}`;
      const uploadDir = join('./uploads', 'sounds');
      const filePath = join(uploadDir, filename);
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filePath, file.buffer);
        
        return {
          url: `/uploads/sounds/${filename}`,
          filename: filename,
          mimetype: file.mimetype,
          size: file.size,
        };
      } catch (err) {
        console.error('Audio processing failed:', err);
        throw new BadRequestException('Invalid or corrupt audio file');
      }
    }

    // Process image strictly with sharp (memory buffer)
    const filename = `${prefix}${uniqueSuffix}.webp`;

    const thumbFilename = `${prefix}${uniqueSuffix}-thumb.webp`;
    const subfolder = conversationId ? 'conversations' : 'icons';
    const uploadDir = join('./uploads', subfolder);
    const filePath = join(uploadDir, filename);
    const thumbPath = join(uploadDir, thumbFilename);

    try {
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Ensure valid dimensions
      let width = metadata.width;
      let height = metadata.height;

      // Force resize if width > 1200
      if (width && width > 1200) {
        width = 1200;
        // sharp automatically maintains aspect ratio if only width is passed
      }

      // Write primary image (forces strip of EXIF data & ensures pure WebP format)
      const primaryImageInfo = await image
        .resize(width)
        .webp({ quality: 80 })
        .toFile(filePath);

      // Write thumbnail
      await sharp(file.buffer)
        .resize(150, 150, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      return {
        url: `/uploads/${subfolder}/${filename}`,
        thumbnailUrl: `/uploads/${subfolder}/${thumbFilename}`,
        filename: filename,
        mimetype: 'image/webp',
        size: primaryImageInfo.size,
      };
    } catch (err) {
      console.error('Image processing failed:', err);
      throw new BadRequestException('Invalid or corrupt image file');
    }
  }
}
