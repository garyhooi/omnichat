import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { VECTOR_STORE_PROVIDER, VectorStoreProvider, VectorChunk } from './vector-store.interface';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    @Inject(VECTOR_STORE_PROVIDER)
    private readonly vectorStore: VectorStoreProvider,
  ) {}

  /**
   * List all knowledge documents.
   */
  async listDocuments() {
    return this.prisma.knowledgeDocument.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        embeddingStatus: true,
        errorMessage: true,
        chunkCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Upload and process a document: extract text, chunk, embed, store.
   */
  async uploadDocument(file: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }, title?: string): Promise<any> {
    const fileType = this.getFileType(file.originalname);
    const content = await this.extractText(file.buffer, fileType);

    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        title: title || file.originalname,
        fileName: file.originalname,
        fileType,
        fileSize: file.size,
        content,
        embeddingStatus: 'processing',
      },
    });

    // Process embeddings asynchronously
    this.processEmbeddings(doc.id, content).catch((err) => {
      this.logger.error(`Failed to process embeddings for ${doc.id}: ${err.message}`);
    });

    return doc;
  }

  /**
   * Delete a document and its chunks.
   */
  async deleteDocument(id: string) {
    await this.vectorStore.deleteByDocumentId(id);
    return this.prisma.knowledgeDocument.delete({ where: { id } });
  }

  /**
   * Get a document by ID with chunk count.
   */
  async getDocument(id: string) {
    return this.prisma.knowledgeDocument.findUnique({
      where: { id },
      include: { _count: { select: { chunks: true } } },
    });
  }

  // =========================================================================
  // Text Extraction
  // =========================================================================

  private getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      txt: 'txt', text: 'txt',
      md: 'md', markdown: 'md',
      pdf: 'pdf',
      docx: 'docx', doc: 'docx',
      csv: 'csv',
    };
    return typeMap[ext] || 'txt';
  }

  private async extractText(buffer: Buffer, fileType: string): Promise<string> {
    switch (fileType) {
      case 'txt':
      case 'md':
        return buffer.toString('utf-8');

      case 'pdf': {
        try {
          const pdfParse = (await import('pdf-parse')).default;
          const data = await pdfParse(buffer);
          return data.text;
        } catch (err: any) {
          this.logger.error(`PDF parsing failed: ${err.message}`);
          throw new Error('Failed to parse PDF file');
        }
      }

      case 'docx': {
        try {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ buffer });
          return result.value;
        } catch (err: any) {
          this.logger.error(`DOCX parsing failed: ${err.message}`);
          throw new Error('Failed to parse DOCX file');
        }
      }

      case 'csv': {
        try {
          const { parse } = await import('csv-parse/sync');
          const records = parse(buffer.toString('utf-8'), {
            columns: true,
            skip_empty_lines: true,
          });
          // Convert CSV rows to readable text
          return records
            .map((row: Record<string, string>) =>
              Object.entries(row)
                .map(([key, val]) => `${key}: ${val}`)
                .join(', ')
            )
            .join('\n');
        } catch (err: any) {
          this.logger.error(`CSV parsing failed: ${err.message}`);
          throw new Error('Failed to parse CSV file');
        }
      }

      default:
        return buffer.toString('utf-8');
    }
  }

  // =========================================================================
  // Chunking & Embedding Pipeline
  // =========================================================================

  /**
   * Split text into chunks with overlap.
   */
  private chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?\n])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + ' ' + sentence).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        // Keep overlap from end of current chunk
        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(overlap / 5));
        currentChunk = overlapWords.join(' ') + ' ' + sentence;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Process document: chunk text, generate embeddings, store in vector store.
   */
  private async processEmbeddings(documentId: string, content: string): Promise<void> {
    try {
      const textChunks = this.chunkText(content);
      this.logger.log(`Processing ${textChunks.length} chunks for document ${documentId}`);

      // Generate embeddings in batches of 10
      const batchSize = 10;
      const vectorChunks: VectorChunk[] = [];

      for (let i = 0; i < textChunks.length; i += batchSize) {
        const batch = textChunks.slice(i, i + batchSize);
        const embeddings = await this.aiService.generateEmbeddings(batch);

        for (let j = 0; j < batch.length; j++) {
          vectorChunks.push({
            documentId,
            content: batch[j],
            embedding: embeddings[j],
            chunkIndex: i + j,
            metadata: JSON.stringify({ documentId, chunkIndex: i + j }),
          });
        }
      }

      // Store in vector store
      await this.vectorStore.upsertEmbeddings(vectorChunks);

      // Update document status
      await this.prisma.knowledgeDocument.update({
        where: { id: documentId },
        data: {
          embeddingStatus: 'completed',
          chunkCount: vectorChunks.length,
        },
      });

      this.logger.log(`Document ${documentId} embedding complete: ${vectorChunks.length} chunks`);
    } catch (error: any) {
      this.logger.error(`Embedding failed for document ${documentId}: ${error.message}`);
      await this.prisma.knowledgeDocument.update({
        where: { id: documentId },
        data: {
          embeddingStatus: 'failed',
          errorMessage: error.message,
        },
      });
    }
  }
}
