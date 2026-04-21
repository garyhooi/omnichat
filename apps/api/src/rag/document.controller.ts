import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { RagService } from './rag.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminIpAllowlistGuard } from '../auth/admin-ip-allowlist.guard';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

class SearchKnowledgeDto {
  @IsString() @IsNotEmpty() query: string;
  @IsNumber() @IsOptional() @Min(1) @Max(20) topK?: number;
}

@Controller('ai/knowledge')
@UseGuards(AdminIpAllowlistGuard, AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly ragService: RagService,
  ) {}

  @Get('documents')
  async listDocuments() {
    return this.documentService.listDocuments();
  }

  @Get('documents/:id')
  async getDocument(@Param('id') id: string) {
    return this.documentService.getDocument(id);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (_req, file, cb) => {
      const allowedTypes = [
        'text/plain', 'text/markdown', 'text/csv',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const allowedExts = ['txt', 'md', 'pdf', 'docx', 'csv'];
      const ext = file.originalname.split('.').pop()?.toLowerCase();

      if (allowedTypes.includes(file.mimetype) || (ext && allowedExts.includes(ext))) {
        cb(null, true);
      } else {
        cb(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
      }
    },
  }))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.documentService.uploadDocument(file, title);
  }

  @Delete('documents/:id')
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.deleteDocument(id);
  }

  @Post('search')
  async searchKnowledge(@Body() dto: SearchKnowledgeDto) {
    return this.ragService.searchKnowledgeBase(dto.query, dto.topK);
  }
}
