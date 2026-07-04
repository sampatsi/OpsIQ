"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";
import { AgentChatHeader } from "@/components/AgentChatHeader";
import { useSession } from "@/hooks/useSession";
import { useAgent } from "@/context/AgentContext";
import { useChat } from "@/hooks/useChat";
import { useApproval } from "@/hooks/useApproval";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { cn } from "@/lib/utils";

const DEFAULT_MAX_QUERY_CHARS = 2000;

export default function ChatPage() {
  const { sessionId, ready, resetSession } = useSession();
  const { selectedAgent, agent } = useAgent();
  const { config: platformConfig } = usePlatformConfig();
  const maxQueryChars = Math.max(
    1,
    Number(platformConfig?.guardrails.maxQueryChars) || DEFAULT_MAX_QUERY_CHARS
  );
  const faithfulnessThreshold = platformConfig?.guardrails.confidenceThreshold ?? 0.7;
  const chatRateLimit = (platformConfig?.guardrails.chatRateLimit ?? "30/minute").replace(
    "/minute",
    "/min"
  );
  const [input, setInput] = useState("");
  const [approvalDraft, setApprovalDraft] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { pending, isSubmitting, setApproval, submitApproval } = useApproval(sessionId);

  const {
    messages,
    isLoading,
    error,
    streamingContent,
    sendMessage,
    addAssistantMessage,
    clearMessages,
  } = useChat({
    sessionId,
    agentId: selectedAgent,
    onAwaitingApproval: (id, draft) => {
      setApproval(id, draft);
      setApprovalDraft(draft);
    },
  });

  useEffect(() => {
    if (ready) textareaRef.current?.focus();
  }, [ready]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleSend = async (query?: string) => {
    const text = (query ?? input).trim();
    if (!text || isLoading) return;
    setInput("");
    setApprovalDraft(null);
    await sendMessage(text);
  };

  const handleApproval = async (approved: boolean, notes?: string) => {
    const result = await submitApproval(approved, notes);
    setApprovalDraft(null);
    if (result) {
      addAssistantMessage(
        result.answer ?? (approved ? "Approved." : "Revision requested."),
        result.sources,
        result.grounding
      );
    }
  };

  const handleNewSession = () => {
    void resetSession(selectedAgent);
    clearMessages();
    setApprovalDraft(null);
  };

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center font-mono text-sm text-[var(--text-2)]">
        Loading session…
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AgentChatHeader
        agent={agent}
        sessionId={sessionId}
        platformConfig={platformConfig}
        onNewSession={handleNewSession}
      />

        <ChatWindow
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
          agentName={agent.name}
          approvalDraft={approvalDraft}
          approvalThreadId={pending?.threadId ?? null}
          isApprovalSubmitting={isSubmitting}
          onApprove={(notes) => handleApproval(true, notes)}
          onRevise={(notes) => handleApproval(false, notes)}
          onSuggestionSelect={(text) => handleSend(text)}
        />

        {error && (
          <p className="shrink-0 border-t border-[var(--red-bg)] bg-[var(--red-bg)] px-6 py-2 text-sm text-[var(--red)]" role="alert">
            {error}
          </p>
        )}

        <div className="relative z-10 shrink-0 border-t border-[var(--line)] bg-[var(--card)] px-6 py-3 max-[820px]:px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mx-auto max-w-chat"
          >
            <div
              className="mb-1.5 flex flex-wrap gap-3.5 px-1 font-mono text-[0.6rem] text-[var(--text-2)]"
              aria-label="Active protections"
            >
              {[
                "Prompt-injection filter",
                "PII redaction",
                `Grounding gate ≥ ${faithfulnessThreshold.toFixed(2)}`,
                `Rate limit ${chatRateLimit}`,
              ].map((label) => (
                <span key={label} className="flex items-center gap-1.5">
                  <i className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
            {approvalDraft && (
              <p className="mb-2 px-1 text-[11px] text-[var(--amber)]">
                Draft awaiting approval above — you can still type a new question, or use Approve /
                Revise on the draft.
              </p>
            )}
            <div className="flex items-end gap-2.5 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 shadow-design-md">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={`Ask the ${agent.name} agent…`}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, maxQueryChars))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                maxLength={maxQueryChars}
                aria-label="Message"
                aria-disabled={isLoading}
                className={cn(
                  "pointer-events-auto max-h-[120px] min-h-[24px] flex-1 resize-none border-none bg-[var(--card)] text-[0.88rem] leading-[1.5] text-[var(--text)] outline-none placeholder:text-[var(--text-2)]",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              />
              <span className="self-center font-mono text-[0.6rem] text-[var(--text-2)]">
                {input.length} / {maxQueryChars}
              </span>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[var(--ink)] text-white transition-colors hover:bg-[var(--ink-2)] disabled:opacity-40"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
    </div>
  );
}
