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
import { exec } from 'child_process';
import { promisify } from 'util';
import { AdminIpAllowlistService } from '../auth/admin-ip-allowlist.service';

const execPromise = promisify(exec);

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadTokenService: UploadTokenService,
    private readonly adminIpAllowlistService: AdminIpAllowlistService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/\/(webp|heic|heif)$/) && !file.mimetype.startsWith('audio/')) {
          return callback(new BadRequestException('Only WebP, HEIC, HEIF images and audio files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') authHeader: string,
    @Headers('x-forwarded-for') forwardedFor: string,
    @Body('conversationId') conversationId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let token = '';
    
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      throw new ForbiddenException('Authentication required: provide an upload token or JWT');
    }

    let convIdFromToken = '';

    if (token.startsWith('upload_')) {
      try {
        const result = await this.uploadTokenService.validateToken(token);
        convIdFromToken = result.conversationId;
      } catch (error) {
        throw new ForbiddenException('Invalid or expired upload token');
      }
    } else {
      // Validate as JWT — this endpoint accepts both token types, so verify manually.
      const requestIp = this.adminIpAllowlistService.extractRequestIp({
        headers: { 'x-forwarded-for': forwardedFor },
      });
      await this.adminIpAllowlistService.assertIpAllowed(requestIp);

      try {
        const { JwtService } = require('@nestjs/jwt');
        const jwt = new JwtService({ secret: process.env.JWT_SECRET });
        jwt.verify(token);
      } catch (error) {
        throw new ForbiddenException('Invalid authentication token');
      }
    }

    // Use token-derived conversationId if not provided in body
    const effectiveConversationId = conversationId || convIdFromToken;
    
    const isAudio = file.mimetype.startsWith('audio/');
    const uniqueSuffix = randomUUID();

    const safeConversationId = effectiveConversationId ? effectiveConversationId.replace(/[^a-zA-Z0-9]/g, '') : '';
    const prefix = safeConversationId ? `${safeConversationId}-` : '';
    
    if (isAudio) {
      const rawExt = file.originalname.split('.').pop()?.toLowerCase() || 'mp3';
      const ext = rawExt.replace(/[^a-z0-9]/g, '') || 'bin';
      const filename = `${prefix}${uniqueSuffix}.${ext}`;
      const uploadDir = join('./uploads', 'sounds');
      const filePath = join(uploadDir, filename);
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(filePath, file.buffer);

        if (convIdFromToken) {
          await this.uploadTokenService.markTokenAsUsed(token);
          const newToken = await this.uploadTokenService.generateToken(convIdFromToken);
          return {
            url: `/uploads/sounds/${filename}`,
            filename: filename,
            mimetype: file.mimetype,
            size: file.size,
            uploadToken: newToken,
          };
        }
        
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

    const filename = `${prefix}${uniqueSuffix}.webp`;

    const thumbFilename = `${prefix}${uniqueSuffix}-thumb.webp`;
    const subfolder = conversationId ? 'conversations' : 'icons';
    const uploadDir = join('./uploads', subfolder);
    const filePath = join(uploadDir, filename);
    const thumbPath = join(uploadDir, thumbFilename);

    try {
      await fs.mkdir(uploadDir, { recursive: true });

      let imageBuffer = file.buffer;
      
      if (file.mimetype.includes('heic') || file.mimetype.includes('heif')) {
        const tempFiles: string[] = [];
        const cleanup = async () => {
          for (const f of tempFiles) {
            try { await fs.unlink(f); } catch {}
          }
        };
        try {
          let jpegBuffer: Buffer | null = null;
          
          try {
            const tempPath = `/tmp/${randomUUID()}.heic`;
            const outputPath = `/tmp/${randomUUID()}.jpg`;
            tempFiles.push(tempPath, outputPath);
            
            await fs.writeFile(tempPath, file.buffer);
            
            try {
              await execPromise(`convert "${tempPath}" "${outputPath}"`);
              jpegBuffer = await fs.readFile(outputPath);
            } catch (magickError) {
              throw magickError;
            }
            await cleanup();
          } catch (magickError) {
            await cleanup();
            try {
              const tempPath = `/tmp/${randomUUID()}.heic`;
              const outputPath = `/tmp/${randomUUID()}.jpg`;
              tempFiles.push(tempPath, outputPath);
              
              await fs.writeFile(tempPath, file.buffer);
              
              try {
                await execPromise(`sips -s format jpeg "${tempPath}" --out "${outputPath}"`);
                jpegBuffer = await fs.readFile(outputPath);
              } catch (sipsError) {
                throw sipsError;
              }
              await cleanup();
            } catch (sipsError) {
              await cleanup();
              try {
                const tempPath = `/tmp/${randomUUID()}.jpg`;
                tempFiles.push(tempPath);
                const tempImage = sharp(file.buffer);
                await tempImage.toFile(tempPath);
                jpegBuffer = await fs.readFile(tempPath);
              } catch (sharpError) {
                throw new Error('All HEIC conversion methods failed. Please ensure ImageMagick is installed.');
              }
              await cleanup();
            }
          }
          
          if (!jpegBuffer) {
            throw new Error('HEIC conversion failed - no buffer produced');
          }
          
          imageBuffer = jpegBuffer;
        } catch (heicError) {
          await cleanup();
          console.error('HEIC conversion failed:', heicError);
          throw new BadRequestException('HEIC file conversion failed. Please try a different format.');
        }
      }

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      let width = metadata.width;
      let height = metadata.height;

      if (width && width > 1200) {
        width = 1200;
      }

      const primaryImageInfo = await image
        .resize(width)
        .webp({ quality: 80 })
        .toFile(filePath);

      await sharp(imageBuffer)
        .resize(150, 150, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      // Rotate token after successful upload so visitor can continue uploading
      if (convIdFromToken) {
        await this.uploadTokenService.markTokenAsUsed(token);
        const newToken = await this.uploadTokenService.generateToken(convIdFromToken);
        return {
          url: `/uploads/${subfolder}/${filename}`,
          thumbnailUrl: `/uploads/${subfolder}/${thumbFilename}`,
          filename: filename,
          mimetype: 'image/webp',
          size: primaryImageInfo.size,
          uploadToken: newToken,
        };
      }

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
