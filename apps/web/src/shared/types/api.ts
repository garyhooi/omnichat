// =============================================================================
// REST API contracts — exact DTO shapes of the NestJS controllers.
// =============================================================================

import type { AdminUser, Role } from './models'

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  siteToken: string
  user: { id: string; username: string; role: Role }
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  displayName: string
}

export interface VisitorRequest {
  visitorId?: string
  externalToken?: string
}

export interface VisitorResponse {
  visitorId: string
}

export interface MeResponse {
  user: { id: string; username: string; displayName: string; role: Role }
}

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------
export interface SiteConfig {
  id: string
  siteName: string
  bubbleColor: string
  welcomeMessage: string
  offlineMessage: string
  greetingMessage?: string | null
  visitorLanguage: string
  adminLanguage: string
  bubbleSize: 'small' | 'medium' | 'large'
  bubblePattern: 'solid' | 'gradient' | 'stripes' | 'dots'
  websitePosition: string
  bubbleIcon: string
  aiAvatar: string
  agentAvatar: string
  visitorAvatar: string
  allowedOrigins: string
  adminAllowedIps?: string | null
  isActive: boolean
  isOfflineMode: boolean
  enableReadReceipts: boolean
  /** Sound played on the visitor widget/chat page when an agent/AI replies. */
  visitorNotificationSoundUrl?: string | null
  /** Sound played on the agent console/widget when a new message arrives. Falls back to visitorNotificationSoundUrl when unset. */
  agentNotificationSoundUrl?: string | null
  showAdminWidget: boolean
  showVisitorWidget: boolean
  createdAt: string
  updatedAt: string
}

/** GET /config/active — public config without security fields, plus injected booleans. */
export interface PublicSiteConfig
  extends Omit<SiteConfig, 'allowedOrigins' | 'adminAllowedIps'> {
  aiEnabled: boolean
  translationEnabled: boolean
  autoTranslationEnabled: boolean
}

export interface CreateSiteConfigRequest {
  siteName: string
  allowedOrigins: string
  bubbleColor?: string
  welcomeMessage?: string
  offlineMessage?: string
  greetingMessage?: string
  visitorLanguage?: string
  adminLanguage?: string
  bubbleSize?: string
  bubblePattern?: string
  websitePosition?: string
  bubbleIcon?: string
  aiAvatar?: string
  agentAvatar?: string
  visitorAvatar?: string
  visitorNotificationSoundUrl?: string
  agentNotificationSoundUrl?: string
  showAdminWidget?: boolean
  showVisitorWidget?: boolean
  adminAllowedIps?: string
  enableReadReceipts?: boolean
  isOfflineMode?: boolean
}

export type UpdateSiteConfigRequest = Partial<CreateSiteConfigRequest> & {
  isActive?: boolean
}

// ---------------------------------------------------------------------------
// Quick replies
// ---------------------------------------------------------------------------
export interface QuickReply {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface QuickReplyRequest {
  title: string
  content: string
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------
export interface ImageUploadResponse {
  url: string
  thumbnailUrl: string
  filename: string
  mimetype: string
  size: number
  uploadToken?: string
}

export interface AudioUploadResponse {
  url: string
  filename: string
  mimetype: string
  size: number
  uploadToken?: string
}

// ---------------------------------------------------------------------------
// AI config
// ---------------------------------------------------------------------------
export type AiProviderType =
  | 'openai'
  | 'anthropic'
  | 'openrouter'
  | 'ollama'
  | 'deepseek'
  | 'gemini'
  | 'grok'

export interface AiProvider {
  id: string
  name: string
  providerType: AiProviderType
  /** Masked as '••••••••' or null when read from the API. */
  apiKey: string | null
  baseUrl?: string | null
  chatModelId: string
  embeddingModelId?: string | null
  /** USD per 1M tokens — used by the token-usage reports. */
  inputPricePerM?: number
  outputPricePerM?: number
  /** Token spend budget per period (null = unlimited). */
  maxTokensPerDay?: number | null
  maxTokensPerWeek?: number | null
  maxTokensPerMonth?: number | null
  maxTokensPerQuarter?: number | null
  maxTokensPerHalfYear?: number | null
  maxTokensPerYear?: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AiProviderRequest {
  name: string
  providerType: AiProviderType
  apiKey?: string
  baseUrl?: string
  chatModelId: string
  embeddingModelId?: string
  inputPricePerM?: number
  outputPricePerM?: number
  maxTokensPerDay?: number | null
  maxTokensPerWeek?: number | null
  maxTokensPerMonth?: number | null
  maxTokensPerQuarter?: number | null
  maxTokensPerHalfYear?: number | null
  maxTokensPerYear?: number | null
}

export type AiProviderUpdateRequest = Partial<AiProviderRequest> & { isActive?: boolean }

export interface AiReviewRequest {
  from?: string
  to?: string
  username?: string
  /** A configured AI provider id; defaults to the active provider. */
  providerId?: string
  /** Reply language name; defaults to English. */
  lang?: string
}

export interface AiReviewResponse {
  review: string
  provider: { name: string; model: string } | null
  conversationCount: number
  agentCount: number
}

export interface AiAgentConfig {
  id: string
  enabled: boolean
  systemPrompt: string
  greetingMessage?: string | null
  humanRequestKeywords?: string | null
  maxTokensPerResponse: number
  temperature: number
  maxTurnsPerConversation: number
  maxTokensPerSession: number
  ragFailureThreshold: number
  humanRequestThreshold: number
  aiRateLimitPerMinute: number
  spamIpBlacklistMinutes: number
  embeddingProviderId?: string | null
  translateProviderId?: string | null
  /** Failover providers — used automatically when the primary provider errors. */
  chatFailoverProviderId?: string | null
  embeddingFailoverProviderId?: string | null
  translateFailoverProviderId?: string | null
  translationEnabled: boolean
  autoTranslationEnabled: boolean
  /** Global token spend budget per period (null = unlimited). */
  maxTokensPerDay?: number | null
  maxTokensPerWeek?: number | null
  maxTokensPerMonth?: number | null
  maxTokensPerQuarter?: number | null
  maxTokensPerHalfYear?: number | null
  maxTokensPerYear?: number | null
  createdAt: string
  updatedAt: string
}

export type AiAgentConfigRequest = Partial<{
  enabled: boolean
  systemPrompt: string
  greetingMessage: string | null
  humanRequestKeywords: string
  maxTokensPerResponse: number
  temperature: number
  maxTurnsPerConversation: number
  maxTokensPerSession: number
  ragFailureThreshold: number
  humanRequestThreshold: number
  aiRateLimitPerMinute: number
  spamIpBlacklistMinutes: number
  embeddingProviderId: string | null
  translateProviderId: string | null
  chatFailoverProviderId?: string | null
  embeddingFailoverProviderId?: string | null
  translateFailoverProviderId?: string | null
  translationEnabled: boolean
  autoTranslationEnabled: boolean
  maxTokensPerDay: number | null
  maxTokensPerWeek: number | null
  maxTokensPerMonth: number | null
  maxTokensPerQuarter: number | null
  maxTokensPerHalfYear: number | null
  maxTokensPerYear: number | null
}>

export type BudgetPeriod = 'day' | 'week' | 'month' | 'quarter' | 'halfYear' | 'year'

export interface BudgetPeriodStatus {
  period: BudgetPeriod
  /** Configured limit in tokens (null = unlimited). */
  limit: number | null
  /** Tokens used in the current period. */
  used: number
  exceeded: boolean
}

export interface BudgetCheckResult {
  exceeded: boolean
  /** e.g. "Global month budget (120000/100000 tokens)" — first exceeded limit. */
  reason?: string
  global: BudgetPeriodStatus[]
  provider: { name: string; periods: BudgetPeriodStatus[] } | null
}

export type ToolAuthType = 'none' | 'static' | 'token-exchange'

export interface ToolRegistration {
  id: string
  name: string
  description: string
  /** JSON string in DB — object in DTO. */
  parametersSchema: string
  handlerType: 'builtin' | 'external'
  endpoint?: string | null
  authType?: ToolAuthType | null
  /** JSON string in DB — object in DTO. */
  authConfig?: string | null
  isActive: boolean
  requiredPermission?: string | null
  createdAt: string
  updatedAt: string
}

export interface ToolRegistrationRequest {
  name: string
  description: string
  parametersSchema: object
  handlerType?: 'builtin' | 'external'
  endpoint?: string
  authType?: ToolAuthType
  authConfig?: object
  isActive?: boolean
}

export type ToolRegistrationUpdateRequest = Partial<ToolRegistrationRequest>

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------
export type EmbeddingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface KnowledgeDocument {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  content: string
  embeddingStatus: EmbeddingStatus
  errorMessage?: string | null
  chunkCount: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeDocumentListItem {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: number
  embeddingStatus: EmbeddingStatus
  errorMessage?: string | null
  chunkCount: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeSearchResult {
  id: string
  documentId: string
  content: string
  chunkIndex: number
  score: number
  metadata?: string | null
}

// ---------------------------------------------------------------------------
// Logs (shared pagination envelope)
// ---------------------------------------------------------------------------
export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface HttpLogEntry {
  id: string
  method: string
  url: string
  statusCode?: number | null
  clientIp?: string | null
  userAgent?: string | null
  userId?: string | null
  username?: string | null
  requestHeaders?: string | null
  requestBody?: string | null
  responseBody?: string | null
  contentLength?: number | null
  duration?: number | null
  createdAt: string
}

export interface AiLogEntry {
  id: string
  conversationId?: string | null
  providerId?: string | null
  eventType: string
  message?: string | null
  details?: string | null
  createdAt: string
}

export interface ToolLogEntry {
  id: string
  toolName: string
  handlerType: 'builtin' | 'external'
  conversationId?: string | null
  requestUrl?: string | null
  requestMethod?: string | null
  requestHeaders?: string | null
  requestBody?: string | null
  responseStatus?: number | null
  responseBody?: string | null
  duration?: number | null
  success: boolean
  errorMessage?: string | null
  createdAt: string
}

export interface AdminUsersResponse extends Array<AdminUser> {}

// ---------------------------------------------------------------------------
// Reports (token usage & spend analytics)
// ---------------------------------------------------------------------------
export interface UsageTotals {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  calls: number
  conversations: number
}

export interface ConversationUsageRow {
  conversationId: string
  visitorName: string
  ticketId: string
  agent: string
  assignedUsername?: string | null
  status: string
  calls: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  lastUsedAt: string
}

export interface TokenUsageReport {
  rows: ConversationUsageRow[]
  totals: UsageTotals
}

export interface MonthlyUsageRow {
  date: string
  calls: number
  conversations: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

export interface DailySummaryRow {
  date: string
  messages: number
  tokens: number
  cost: number
}

export interface ReportSummary {
  totals: UsageTotals
  conversationsTotal: number
  conversationsByStatus: Record<string, number>
  daily: DailySummaryRow[]
}
