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
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentName?: string;
  sources?: SourceCitation[];
  timestamp: Date;
}

export interface SourceCitation {
  document_id: string;
  title: string;
  department?: string;
  snippet?: string;
  score?: number;
}

export interface ChatResponse {
  answer?: string;
  response?: string;
  message?: string;
  status?: string;
  session_id?: string;
  thread_id?: string;
  draft?: string;
  sources?: SourceCitation[];
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
