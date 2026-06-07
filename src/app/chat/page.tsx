"use client";

import { useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { useSession } from "@/hooks/useSession";
import { useAgent } from "@/hooks/useAgent";
import { useChat } from "@/hooks/useChat";
import { useApproval } from "@/hooks/useApproval";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { sessionId, ready, resetSession } = useSession();
  const { selectedAgent, agent, selectAgent } = useAgent();
  const [input, setInput] = useState("");
  const [approvalDraft, setApprovalDraft] = useState<string | null>(null);

  const { isSubmitting, setApproval, submitApproval } = useApproval(sessionId);

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
    onAwaitingApproval: (threadId, draft) => {
      setApproval(threadId, draft);
      setApprovalDraft(draft);
    },
  });

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
      const content =
        result.answer ?? result.response ?? result.message ?? (approved ? "Approved." : "Revision requested.");
      addAssistantMessage(content, result.sources);
    }
  };

  const handleNewSession = () => {
    resetSession();
    clearMessages();
    setApprovalDraft(null);
  };

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-[var(--text-secondary)]">
        Loading session...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <ChatSidebar selectedAgent={selectedAgent} onSelectAgent={selectAgent} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--bg-main)]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-white px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
              {agent.name} Agent
            </h2>
            <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
              {sessionId.slice(0, 12)}…
            </span>
          </div>
          <button
            type="button"
            onClick={handleNewSession}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Session
          </button>
        </header>

        <ChatWindow
          messages={messages}
          streamingContent={streamingContent}
          isLoading={isLoading}
          agentName={agent.name}
          approvalDraft={approvalDraft}
          isApprovalSubmitting={isSubmitting}
          onApprove={(notes) => handleApproval(true, notes)}
          onRevise={(notes) => handleApproval(false, notes)}
          onSuggestionSelect={(text) => handleSend(text)}
        />

        {error && (
          <p className="shrink-0 border-t border-red-100 bg-red-50 px-6 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="shrink-0 border-t border-[var(--border)] bg-white px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative mx-auto max-w-[780px]"
          >
            <input
              type="text"
              placeholder={`Message ${agent.name} agent...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || !!approvalDraft}
              className={cn(
                "h-auto w-full rounded-xl border-[1.5px] border-[var(--border)] bg-white py-3.5 pl-4 pr-14 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all",
                "focus:border-[var(--accent-primary)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(99,102,241,0.1)]",
                "disabled:opacity-60"
              )}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !!approvalDraft}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-accent-gradient text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
