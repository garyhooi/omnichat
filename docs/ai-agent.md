# AI Agent Setup Guide

OmniChat supports an AI Agent that can automatically handle visitor conversations using LLM providers (OpenAI, Anthropic, OpenRouter, Ollama). The AI Agent integrates tightly with the platform and includes the following behaviors:

- Greets visitors and answers questions using your knowledge base (RAG)
- Streams responses token-by-token for a ChatGPT-like experience
- Automatically triggers handoff to human agents when needed (safety, turn limits, RAG failures)
- Includes tool support (search_knowledge_base, transfer_to_human, get_business_hours) and a secure tool execution context
- Protects against prompt injection and abusive inputs via AiSecurityService

Important recent behaviors and configuration additions

- Human Offline Mode: a site configuration that marks human agents as unavailable. If Human Offline Mode is ON and the AI Agent is enabled, visitors can still chat with the AI Agent (AI-only mode). If the AI Agent is disabled while Human Offline Mode is ON, the system is fully offline.
- Session-aware agent availability: transfers to humans and availability checks now require agents to be truly online (isOnline = true and active non-revoked sessions). The transfer_to_human tool double-checks availability before executing a handoff.
- Presence & heartbeat: agents emit a heartbeat and the server performs a stale-check. `effectiveOnline` is computed as `isOnline && activeSessions > 0`.
- Read receipts: when enabled, read receipts are only shown to agents (agents can see whether the visitor read their messages). Visitors/customers never see read receipts on their widget.
- Character limits: visitor messages are limited to 100 characters client- and server-side; admin/agent messages are limited to 1000 characters client- and server-side. Quick Replies: title max 200 chars, content max 1000 chars.
- Toast notifications: admin UI now uses bottom-right floating toasts for save success/failure and other transient notices.
- Markdown rendering: both admin and visitor message bubbles render Markdown (sanitized via DOMPurify). Streaming partial markdown is rendered incrementally; final rendering occurs when the stream completes.

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

### Human Offline Mode

If the site is set to Human Offline Mode the system treats human agents as unavailable. When Human Offline Mode is enabled and the AI Agent is enabled, visitors will be served by the AI Agent (AI-only mode). If the AI Agent is disabled as well, visitors see an offline banner and cannot start chats.

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
