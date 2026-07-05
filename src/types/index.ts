export type AgentId =
  | "internal"
  | "support"
  | "report"
  | "onboarding"
  | "contract";

export interface AgentConfig {
  id: AgentId;
  name: string;
  description: string;
  tagline: string;
  icon: string;
  gated?: boolean;
  chunkCount?: number;
  sourceDomains?: string[];
}

export interface GuardrailBlock {
  reason: string;
  restrictedFields?: string[];
  auditId?: string;
  message?: string;
}

export interface RagasMetrics {
  faithfulness: number;
  answer_relevancy: number;
  context_precision: number;
  context_recall: number;
}

export interface AgentQueryResponse {
  status: "passed" | "held_for_review" | "blocked";
  answer?: string | null;
  citations?: SourceCitation[];
  ragas?: RagasMetrics;
  guardrail?: GuardrailBlock;
  sessionId: string;
  agentId: string;
  durationMs?: number;
}

export interface LiveQualityMetrics {
  window: number;
  sampleCount: number;
  faithfulness?: number | null;
  answerRelevancy?: number | null;
  contextPrecision?: number | null;
  contextRecall?: number | null;
  faithfulnessThreshold: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
  sources?: SourceCitation[];
  timestamp: Date;
  grounding?: {
    faithfulness?: number;
    sources_used?: number;
  };
  guardrail?: {
    status: "passed" | "blocked" | "held";
    reason_code?: string;
    message?: string;
    audit_id?: string;
    restricted_fields?: string[];
  };
}

export interface SourceCitation {
  document_id: string;
  title: string;
  department?: string;
  snippet?: string;
  score?: number;
  page_number?: number;
}

export interface GuardrailInfo {
  status: "passed" | "blocked" | "held";
  reason_code?: string;
  message?: string;
  audit_id?: string;
  restricted_fields?: string[];
}

export interface GroundingInfo {
  faithfulness?: number;
  sources_used?: number;
}

export interface ChatResponse {
  answer?: string;
  agent_used?: string;
  status?: string;
  session_id?: string;
  thread_id?: string;
  draft?: string;
  sources?: SourceCitation[];
  guardrail?: GuardrailInfo;
  grounding?: GroundingInfo;
  guardrail_blocked?: boolean;
}

export interface SessionCreateResponse {
  session_id: string;
  agent_type: string;
  thread_id: string;
}

export interface ApprovalState {
  threadId: string;
  draft: string;
  sessionId: string;
}

export interface StatsResponse {
  total_documents: number;
  total_chunks: number;
  documents_by_department?: Record<string, number>;
}

export interface SessionSummary {
  session_id: string;
  agent?: string;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
  preview?: string;
}

export interface SessionDetail {
  session_id: string;
  messages: Array<{
    role: string;
    content: string;
    agent?: string;
    timestamp?: string;
    sources?: SourceCitation[];
  }>;
}

export const DEPARTMENTS = [
  "engineering",
  "sales",
  "marketing",
  "hr",
  "finance",
  "legal",
  "operations",
] as const;

export const DOC_TYPES = [
  "policy",
  "procedure",
  "contract",
  "report",
  "faq",
  "other",
] as const;

export const FAITHFULNESS_GATE = 0.7;

export interface GuardrailConfigStatus {
  active: boolean;
  label: string;
  enabledCount: number;
  piiDetection: boolean;
  injectionFilter: boolean;
  scopeEnforcement: boolean;
  faithfulnessGate: boolean;
  nemoEnabled: boolean;
  confidenceThreshold: number;
  citationRequired: boolean;
  retryOnLowConfidence: boolean;
  maxQueryChars: number;
  chatRateLimit: string;
}

export interface ChunkingConfig {
  strategy: string;
  strategyLabel: string;
  chunkSize: number;
  overlap: number;
  minChunkSize: number;
  metadataInjection: boolean;
}

export interface RetrievalConfig {
  algorithm: string;
  algorithmLabel: string;
  topK: number;
  rerankEnabled: boolean;
  rerankModel: string;
  queryDecomposition: boolean;
  hydeEnabled: boolean;
  semanticWeight: number;
  bm25Weight: number;
  candidates: number;
  minScore: number;
}

export interface ModelsConfig {
  llmProvider: string;
  llmModel: string;
  embeddingModel: string;
  embeddingDimensions: number;
  maxContextTokens: number;
  temperature: number;
  selfLearningEnabled: boolean;
}

export interface PlatformConfig {
  guardrails: GuardrailConfigStatus;
  chunking: ChunkingConfig;
  retrieval: RetrievalConfig;
  models: ModelsConfig;
}

export interface AnalyticsBarItem {
  label: string;
  value: number;
  percent: number;
  display: string;
}

export interface AnalyticsQualityRing {
  label: string;
  score: number;
  percent: number;
}

export interface AnalyticsRecentQuery {
  query: string;
  agentId: string;
  agentName: string;
  confidence?: number | null;
  chunks?: number | null;
  status: string;
  durationMs?: number | null;
  recordedAt?: string | null;
}

export interface AnalyticsDashboard {
  queryVolumeByAgent: AnalyticsBarItem[];
  qualityScores: AnalyticsQualityRing[];
  knowledgeCoverageByDomain: AnalyticsBarItem[];
  systemPerformance: AnalyticsBarItem[];
  recentQueries: AnalyticsRecentQuery[];
  summary: {
    totalQueries: number;
    faithfulnessThreshold: number;
  };
}

export interface ApprovalRequestRecord {
  threadId: string;
  actionId: string;
  sessionId: string;
  status: string;
  draftPayload: Record<string, unknown>;
  expiresAt: string;
  approverId?: string;
  createdAt?: string;
}

export interface AuditEntry {
  auditId: string;
  userId?: string;
  agentId?: string;
  sessionId?: string;
  action: string;
  restrictedFields: string[];
  timestamp: string;
  detail: Record<string, unknown>;
}
