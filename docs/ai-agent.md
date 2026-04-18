# AI Agent Setup Guide

OmniChat supports an AI agent that handles visitor conversations automatically using LLM providers (OpenAI, Anthropic, OpenRouter, Ollama). When configured, the AI agent:

- Greets visitors and answers questions using your knowledge base
- Streams responses token-by-token for a ChatGPT-like experience
- Automatically hands off to human agents when needed
- Protects against prompt injection and abuse

## Prerequisites

- A running OmniChat instance
- An API key from at least one supported AI provider

## Supported Providers

| Provider | Models | Notes |
|----------|--------|-------|
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5-Turbo | Best overall quality |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus/Haiku | Strong reasoning |
| **OpenRouter** | Any model on OpenRouter | Unified gateway to 100+ models |
| **Ollama** | Llama 3, Mistral, etc. | Self-hosted, no API key needed |

## Configuration

### 1. Add an AI Provider

Navigate to **AI Agent** in the admin sidebar, then:

1. Click **Add Provider**
2. Select the provider type (OpenAI, Anthropic, etc.)
3. Enter your API key — it will be encrypted at rest using AES-256-CBC
4. Choose a model (e.g., `gpt-4o`)
5. Save

### 2. Configure the Agent

On the same page, configure agent behavior:

| Setting | Description | Default |
|---------|-------------|---------|
| **System Prompt** | Instructions for the AI | General assistant |
| **Greeting Message** | First message sent to visitors | "Hello! How can I help?" |
| **Max Turns Before Handoff** | Auto-handoff after N turns | 10 |
| **Max Tokens Per Session** | Token budget per conversation | 4000 |
| **RAG Failure Threshold** | Failed lookups before handoff | 3 |
| **Temperature** | Response creativity (0-1) | 0.7 |

### 3. Enable the Agent

Toggle **AI Agent Enabled** to activate. When disabled, all conversations go directly to human agents (the default OmniChat behavior).

## How It Works

### Conversation Flow

```
Visitor opens chat
  → AI greets visitor
  → Visitor sends message
  → AI searches knowledge base (RAG)
  → AI streams response via WebSocket
  → Repeat until resolved or handoff triggered
```

### Automatic Handoff Triggers

The AI hands off to a human agent when:

1. **Visitor requests it** — Phrases like "talk to a human" are detected
2. **Too many turns** — Exceeds `maxTurnsBeforeHandoff`
3. **Token budget exhausted** — Exceeds `maxTokensPerSession`
4. **Repeated RAG failures** — Knowledge base can't answer repeatedly
5. **AI errors** — Provider failures or rate limits
6. **AI decides** — The `transfer_to_human` tool is available to the AI

### Streaming

AI responses stream token-by-token to the visitor widget via WebSocket `ai_stream` events. The visitor sees a typing cursor that builds the response in real-time.

## Built-in Tools

The AI agent has access to these tools:

| Tool | Purpose |
|------|---------|
| `search_knowledge_base` | Searches uploaded documents via RAG |
| `transfer_to_human` | Explicitly hands off to a human agent |
| `get_business_hours` | Returns configured support hours |

## Security

### Prompt Injection Protection

The `AiSecurityService` scans every visitor message for injection patterns before forwarding to the LLM. Detected attacks are blocked and logged.

### Rate Limiting

- **Per-conversation:** Max messages per minute
- **Per-IP:** Max conversations per hour
- **Circuit breaker:** Disables AI temporarily after repeated provider failures

### API Key Encryption

All provider API keys are encrypted in the database using AES-256-CBC derived from your `JWT_SECRET` environment variable.

## Environment Variables

```env
# Required for AI features
JWT_SECRET=your-secret-key  # Also used to derive encryption key

# Optional — Redis for session state (falls back to in-memory)
REDIS_URL=redis://localhost:6379
```

Provider API keys are stored in the database (encrypted), not in environment variables.

## Disabling AI

Set **AI Agent Enabled** to off in the admin panel. All conversations will route to human agents as before. No code changes needed.
