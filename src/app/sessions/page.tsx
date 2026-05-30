"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, MessageSquare, Loader2 } from "lucide-react";
import { getSession, listSessions } from "@/lib/api";
import type { SessionDetail } from "@/types";
import { MessageBubble } from "@/components/MessageBubble";
import type { ChatMessage } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SessionItem {
  session_id: string;
  agent?: string;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
  preview?: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await listSessions();
      setSessions(data.sessions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions");
      setSessions([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadSessionDetail = useCallback(async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    setDetail(null);
    try {
      const data = await getSession(id);
      setDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const messages: ChatMessage[] =
    detail?.messages?.map((m, i) => ({
      id: `hist_${i}`,
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
      agentName: m.agent,
      sources: m.sources,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
    })) ?? [];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:h-screen md:flex-row">
      <aside className="w-full shrink-0 border-b border-[var(--border)] bg-white md:w-[320px] md:border-b-0 md:border-r">
        <div className="border-b border-[var(--border-subtle)] px-6 py-5">
          <h1 className="font-display text-lg font-bold text-[var(--text-primary)]">Sessions</h1>
          <p className="text-xs text-[var(--text-secondary)]">Recent agent conversations</p>
        </div>
        <ScrollArea className="h-[200px] md:h-[calc(100%-73px)]">
          {loadingList ? (
            <div className="flex items-center justify-center gap-2 p-8 text-[var(--text-muted)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-primary)]" />
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <p className="p-6 text-center text-sm text-[var(--text-muted)]">
              No sessions found. Start a chat to create one.
            </p>
          ) : (
            <ul>
              {sessions.map((s) => (
                <li key={s.session_id}>
                  <button
                    type="button"
                    onClick={() => loadSessionDetail(s.session_id)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-[var(--border-subtle)] px-6 py-3 text-left transition-colors hover:bg-[var(--bg-card-hover)]",
                      selectedId === s.session_id &&
                        "border-l-2 border-l-[var(--accent-primary)] bg-[#EEF2FF]/50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                      <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {s.agent ? `${s.agent} · ` : ""}
                        {s.session_id.slice(0, 16)}...
                      </span>
                    </div>
                    {s.preview && (
                      <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">
                        {s.preview}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
                      {s.message_count != null && <span>{s.message_count} messages</span>}
                      {s.updated_at && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(s.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-main)]">
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">
            Select a session to view conversation history
          </div>
        ) : loadingDetail ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-[var(--text-muted)]">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-primary)]" />
            Loading conversation...
          </div>
        ) : (
          <>
            <header className="border-b border-[var(--border)] bg-white px-6 py-4">
              <h2 className="font-display font-semibold text-[var(--text-primary)]">
                Conversation
              </h2>
              <p className="font-mono text-xs text-[var(--text-muted)]">{selectedId}</p>
            </header>
            <ScrollArea className="flex-1">
              <div className="mx-auto flex max-w-[780px] flex-col gap-5 p-6">
                {messages.length === 0 ? (
                  <p className="py-12 text-center text-sm text-[var(--text-muted)]">
                    No messages in this session.
                  </p>
                ) : (
                  messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
                )}
              </div>
            </ScrollArea>
          </>
        )}

        {error && (
          <p className="border-t border-red-100 bg-red-50 px-6 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
