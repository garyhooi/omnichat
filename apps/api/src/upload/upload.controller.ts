import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { Request } from 'express';
import * as sharp from 'sharp';

@Controller('upload')
export class UploadController {
  @Post()
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
        fileSize: 10 * 1024 * 1024, // Increased to 10MB just in case, compression handles the rest
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
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
