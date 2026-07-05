import type {
  AgentQueryResponse,
  ApprovalRequestRecord,
  AuditEntry,
  ChatResponse,
  LiveQualityMetrics,
  PlatformConfig,
  AnalyticsDashboard,
  SessionCreateResponse,
  SessionDetail,
  StatsResponse,
} from "@/types";
import type {
  RagasHistoryEntry,
  RagasLatest,
  RagasThresholds,
} from "@/types/ragas";

const API_BASE = "/api/v1";

function parseApiError(text: string, status: number): string {
  try {
    const json = JSON.parse(text) as { detail?: string | { msg?: string }[] };
    if (typeof json.detail === "string") return json.detail;
    if (Array.isArray(json.detail) && json.detail[0]?.msg) {
      return json.detail[0].msg;
    }
  } catch {
    // not JSON
  }
  return text || `Request failed: ${status}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(parseApiError(text, res.status));
  }
  return res.json() as Promise<T>;
}

function idempotencyKey(): string {
  return `idem_${crypto.randomUUID()}`;
}

export async function checkHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function getApiFailureHint(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      return "The API is running, but PostgreSQL is unavailable. Start Docker Desktop, then run: cd opsiq/docker && docker compose up -d pgvector";
    }
  } catch {
    // backend unreachable
  }
  return "Ensure the FastAPI backend is running at http://localhost:8000";
}

export async function createSession(payload: {
  agent_type: string;
}): Promise<SessionCreateResponse> {
  const res = await fetch(`${API_BASE}/agent/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getAgents(): Promise<{
  agents: Array<{
    id: string;
    name: string;
    description: string;
    gated: boolean;
    indexStats: { chunkCount: number; sourceDomains: string[] };
  }>;
}> {
  const res = await fetch(`${API_BASE}/agents`);
  return handleResponse(res);
}

export async function queryAgent(
  agentId: string,
  payload: { query: string; sessionId: string }
): Promise<AgentQueryResponse> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: payload.query, sessionId: payload.sessionId }),
  });
  return handleResponse(res);
}

/** @deprecated Use queryAgent — kept for legacy /agent/chat callers */
export async function sendChat(payload: {
  query: string;
  session_id: string;
  context: Record<string, unknown>;
}): Promise<ChatResponse> {
  const agentId = String(payload.context?.agent ?? "internal");
  const platform = await queryAgent(agentId, {
    query: payload.query,
    sessionId: payload.session_id,
  });
  return mapPlatformToChat(platform);
}

function mapPlatformToChat(data: AgentQueryResponse): ChatResponse {
  const guardrailStatus =
    data.status === "blocked"
      ? "blocked"
      : data.status === "held_for_review"
        ? "held"
        : "passed";

  return {
    answer: data.answer ?? undefined,
    agent_used: data.agentId,
    session_id: data.sessionId,
    status: data.status,
    sources: data.citations,
    guardrail: data.guardrail
      ? {
          status: guardrailStatus,
          reason_code: data.guardrail.reason,
          message: data.guardrail.message,
          audit_id: data.guardrail.auditId,
          restricted_fields: data.guardrail.restrictedFields,
        }
      : guardrailStatus !== "passed"
        ? { status: guardrailStatus }
        : undefined,
    grounding: data.ragas
      ? {
          faithfulness: data.ragas.faithfulness,
          sources_used: data.citations?.length ?? 0,
        }
      : undefined,
    guardrail_blocked: guardrailStatus === "blocked" || guardrailStatus === "held",
  };
}

export async function getLiveQuality(window = 20): Promise<LiveQualityMetrics | null> {
  try {
    const res = await fetch(`${API_BASE}/telemetry/quality?window=${window}`);
    if (!res.ok) return null;
    return res.json() as Promise<LiveQualityMetrics>;
  } catch {
    return null;
  }
}

export async function getPlatformConfig(): Promise<PlatformConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) return null;
    return res.json() as Promise<PlatformConfig>;
  } catch {
    return null;
  }
}

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboard | null> {
  try {
    const res = await fetch(`${API_BASE}/telemetry/analytics`);
    if (!res.ok) return null;
    return res.json() as Promise<AnalyticsDashboard>;
  } catch {
    return null;
  }
}

export async function approveAction(payload: {
  threadId: string;
  sessionId: string;
  notes?: string;
}): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/approvals/${payload.threadId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey(),
    },
    body: JSON.stringify({ sessionId: payload.sessionId, notes: payload.notes }),
  });
  return handleResponse(res);
}

export async function requestApprovalChanges(payload: {
  threadId: string;
  sessionId: string;
  notes?: string;
}): Promise<unknown> {
  const res = await fetch(`${API_BASE}/approvals/${payload.threadId}/request-changes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: payload.sessionId, notes: payload.notes }),
  });
  return handleResponse(res);
}

export async function listPendingApprovals(): Promise<ApprovalRequestRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/approvals/pending`);
    if (!res.ok) return [];
    return res.json() as Promise<ApprovalRequestRecord[]>;
  } catch {
    return [];
  }
}

export async function createActionDraft(payload: {
  actionId: string;
  sessionId: string;
  draftPayload?: Record<string, unknown>;
}): Promise<ApprovalRequestRecord> {
  const res = await fetch(`${API_BASE}/actions/${payload.actionId}/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: payload.sessionId,
      payload: payload.draftPayload ?? {},
    }),
  });
  return handleResponse(res);
}

export async function getAuditEvents(limit = 50): Promise<AuditEntry[]> {
  try {
    const res = await fetch(`${API_BASE}/audit/events?limit=${Math.min(limit, 100)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { events: AuditEntry[] };
    return data.events ?? [];
  } catch {
    return [];
  }
}

export async function ingestDocument(formData: FormData): Promise<unknown> {
  const res = await fetch(`${API_BASE}/ingest`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function approveReport(payload: {
  session_id: string;
  thread_id: string;
  approved: boolean;
  revision_notes?: string;
}): Promise<ChatResponse> {
  if (payload.approved) {
    return approveAction({
      threadId: payload.thread_id,
      sessionId: payload.session_id,
      notes: payload.revision_notes,
    });
  }
  await requestApprovalChanges({
    threadId: payload.thread_id,
    sessionId: payload.session_id,
    notes: payload.revision_notes,
  });
  return { answer: "Revision requested.", session_id: payload.session_id };
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/stats`);
  return handleResponse(res);
}

export async function listSessions(): Promise<{
  sessions: Array<{
    session_id: string;
    agent?: string;
    created_at?: string;
    updated_at?: string;
    message_count?: number;
    preview?: string;
  }>;
}> {
  const res = await fetch(`${API_BASE}/agent/sessions`);
  return handleResponse(res);
}

export async function getSession(sessionId: string): Promise<SessionDetail> {
  const res = await fetch(`${API_BASE}/agent/sessions/${sessionId}`);
  const data = await handleResponse<{ session: Record<string, unknown> }>(res);
  const session = data.session;
  const runs = (session.runs as Array<{ query?: string; answer?: string; agent?: string; ran_at?: string }>) ?? [];
  return {
    session_id: String(session.session_id ?? sessionId),
    messages: runs.flatMap((run) => {
      const msgs: SessionDetail["messages"] = [];
      if (run.query) {
        msgs.push({ role: "user", content: run.query, timestamp: run.ran_at });
      }
      if (run.answer) {
        msgs.push({
          role: "assistant",
          content: run.answer,
          agent: run.agent,
          timestamp: run.ran_at,
        });
      }
      return msgs;
    }),
  };
}

export async function getRagasThresholds(): Promise<RagasThresholds | null> {
  try {
    const res = await fetch(`${API_BASE}/ragas/thresholds`);
    if (!res.ok) return null;
    return res.json() as Promise<RagasThresholds>;
  } catch {
    return null;
  }
}

export async function getRagasLatest(): Promise<RagasLatest | null> {
  try {
    const res = await fetch(`${API_BASE}/ragas/latest`);
    if (!res.ok) return null;
    return res.json() as Promise<RagasLatest>;
  } catch {
    return null;
  }
}

export async function getRagasHistory(limit = 30): Promise<RagasHistoryEntry[]> {
  try {
    const res = await fetch(
      `${API_BASE}/ragas/history?limit=${Math.min(Math.max(limit, 1), 100)}`
    );
    if (!res.ok) return [];
    return res.json() as Promise<RagasHistoryEntry[]>;
  } catch {
    return [];
  }
}
