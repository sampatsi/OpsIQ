"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, MessageSquare, Loader2 } from "lucide-react";
import { getSession, listSessions } from "@/lib/api";
import type { ChatMessage, SessionDetail } from "@/types";
import { MessageBubble } from "@/components/MessageBubble";
import { PageHeader } from "@/components/PageHeader";
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
    let cancelled = false;

    (async () => {
      try {
        const data = await listSessions();
        if (!cancelled) setSessions(data.sessions ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load sessions");
          setSessions([]);
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
    <div className="console-page flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageHeader
        icon={Clock}
        title="Sessions"
        description="Browse and replay past agent conversations across all agents."
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-[var(--line)] bg-[var(--card)] md:w-[320px] md:border-b-0 md:border-r">
        <ScrollArea className="h-[200px] min-h-0 flex-1 md:h-auto">
          {loadingList ? (
            <div className="flex items-center justify-center gap-2 p-8 text-[var(--text-2)]">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--teal)]" />
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <p className="p-6 text-center text-sm text-[var(--text-2)]">
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
                      "flex w-full flex-col gap-1 border-b border-[var(--line)] px-6 py-3 text-left transition-colors hover:bg-[var(--bg-card-hover)]",
                      selectedId === s.session_id &&
                        "border-l-2 border-l-[var(--teal)] bg-[var(--teal-bg)]/40 shadow-[inset_2px_0_0_var(--teal)]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-[var(--teal)]" />
                      <span className="truncate text-sm font-medium text-[var(--text)]">
                        {s.agent ? `${s.agent} · ` : ""}
                        {s.session_id.slice(0, 16)}...
                      </span>
                    </div>
                    {s.preview && (
                      <p className="line-clamp-2 text-xs text-[var(--text-2)]">{s.preview}</p>
                    )}
                    <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--text-2)]">
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

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--paper)]">
        {!selectedId ? (
          <div className="flex flex-1 items-center justify-center text-[var(--text-2)]">
            Select a session to view conversation history
          </div>
        ) : loadingDetail ? (
          <div className="flex flex-1 items-center justify-center gap-2 text-[var(--text-2)]">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--teal)]" />
            Loading conversation...
          </div>
        ) : (
          <>
            <header
              className="relative flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--card)] px-6 py-3"
              style={
                {
                  "--header-accent": "var(--teal)",
                  "--header-wash": "#1a3d38",
                } as React.CSSProperties
              }
            >
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-sm bg-[var(--teal)]"
                aria-hidden
              />
              <div className="min-w-0 flex-1 pl-0.5">
                <h2 className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
                  Conversation
                </h2>
                <p className="truncate font-mono text-[0.64rem] text-[var(--text-2)]">{selectedId}</p>
              </div>
            </header>
            <ScrollArea className="flex-1">
              <div className="mx-auto flex max-w-[780px] flex-col gap-5 p-6">
                {messages.length === 0 ? (
                  <p className="py-12 text-center text-sm text-[var(--text-2)]">
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
          <p className="border-t border-[var(--red-bg)] bg-[var(--red-bg)] px-6 py-2 text-sm text-[var(--red)]">
            {error}
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
