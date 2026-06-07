import type { ChatResponse, SessionDetail, StatsResponse } from "@/types";
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

export async function sendChat(payload: {
  query: string;
  session_id: string;
  context: Record<string, unknown>;
}): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
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
  notes?: string;
}): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/agent/report/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
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
  return handleResponse(res);
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
