# RAG (Retrieval-Augmented Generation) Setup

OmniChat's RAG system lets the AI agent answer questions using your uploaded documents. It chunks documents, generates embeddings, stores them in your database's vector search, and retrieves relevant context at query time.

## Supported Document Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Plain Text | `.txt` | Direct text processing |
| Markdown | `.md` | Parsed as plain text |
| PDF | `.pdf` | Extracted via `pdf-parse` |
| Word Document | `.docx` | Extracted via `mammoth` |
| CSV | `.csv` | Each row becomes a chunk |

## Supported Vector Stores

The vector store is chosen automatically based on your database:

| Database | Vector Implementation | Notes |
|----------|----------------------|-------|
| **MongoDB** | Atlas Vector Search | Requires Atlas M10+ with vector search index |
| **PostgreSQL** | pgvector extension | Requires `pgvector` extension installed |
| **MySQL** | Native VECTOR (9.0+) / JSON fallback (8.x) | MySQL 9.0 has native vector; 8.x uses JSON array with app-level cosine similarity |

## Quick Start

### 1. Upload Documents

Navigate to **Knowledge Base** in the admin sidebar:

1. Click **Upload Document**
2. Select a file (TXT, MD, PDF, DOCX, or CSV)
3. The document is automatically chunked and embedded
4. Status shows processing progress

### 2. Use Pre-made Templates

OmniChat includes starter templates at `/rag-templates/`:

- `company-info.md` — Company details, contact info, mission
- `product-faq.md` — Product features, pricing, integrations
- `return-policy.md` — Return/refund/cancellation policies
- `general-faq.md` — Common questions about accounts, billing, support

Download a template, customize it with your information, then upload.

### 3. Test

Open the visitor widget and ask a question covered by your documents. The AI will search the knowledge base and cite relevant information.

## How It Works

```
Visitor asks a question
  → AI calls search_knowledge_base tool
  → RagService generates embedding for the query
  → Vector store finds top-K similar chunks
  → Relevant chunks returned as context
  → AI generates answer using the context
```

### Chunking

Documents are split into overlapping chunks:
- **Chunk size:** ~500 tokens
- **Overlap:** ~50 tokens
- Each chunk stores metadata (document ID, position, source filename)

### Embedding

Embeddings are generated using the configured AI provider's embedding model (e.g., `text-embedding-3-small` for OpenAI). Dimension: 1536.

## MongoDB Atlas Vector Search

### Index Setup

Create a vector search index on the `DocumentChunk` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

Name the index `default` or configure via the admin panel.

## PostgreSQL pgvector

### Extension Setup

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The `DocumentChunk` table uses `vector(1536)` column type. Prisma manages this via `Unsupported("vector(1536)")`.

### Index (optional, improves performance)

```sql
CREATE INDEX ON "DocumentChunk" 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

## MySQL

### MySQL 9.0+
Native `VECTOR` type is used. Create the column manually:

```sql
ALTER TABLE DocumentChunk ADD COLUMN embedding VECTOR(1536);
```

### MySQL 8.x (Fallback)
Embeddings are stored as JSON arrays. Cosine similarity is computed in application code. This works but is slower for large document sets.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ai/knowledge/documents` | List all documents |
| `POST` | `/ai/knowledge/upload` | Upload a document |
| `DELETE` | `/ai/knowledge/documents/:id` | Delete a document and its chunks |
| `GET` | `/ai/knowledge/search?q=query` | Search the knowledge base |

All endpoints require admin authentication.

## Document Management

### Viewing Documents

The Knowledge Base page shows all uploaded documents with:
- Filename and format
- Upload date
- Number of chunks
- Processing status

### Deleting Documents

Deleting a document removes it and all associated chunks/embeddings from the database.

### Re-uploading

Upload a new version of the same document. The old version is not automatically replaced — delete the old one first if needed.

## Troubleshooting

### "No relevant results found"
- Check that documents are fully processed (status: `completed`)
- Verify the embedding model is working (test via AI Setup page)
- Ensure vector search index exists (MongoDB Atlas / pgvector)

### Slow search performance
- Add a vector index (see database-specific sections above)
- Reduce the number of chunks by using larger chunk sizes
- MySQL 8.x JSON fallback is inherently slower — upgrade to 9.0 or switch to PostgreSQL/MongoDB

### Upload fails
- Check file size (max depends on server config)
- Verify the file format is supported
- Check server logs for parsing errors
