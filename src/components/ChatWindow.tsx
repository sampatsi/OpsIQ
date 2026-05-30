"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { MessageBubble } from "@/components/MessageBubble";
import { ApprovalPanel } from "@/components/ApprovalPanel";
import { TypingIndicator } from "@/components/TypingIndicator";
import type { ChatMessage } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const SUGGESTIONS = [
  "What's our leave policy?",
  "Summarize vendor contracts",
  "Generate weekly report",
];

interface ChatWindowProps {
  messages: ChatMessage[];
  streamingContent?: string | null;
  isLoading?: boolean;
  agentName?: string;
  approvalDraft?: string | null;
  isApprovalSubmitting?: boolean;
  onApprove?: (notes?: string) => void;
  onRevise?: (notes?: string) => void;
  onSuggestionSelect?: (text: string) => void;
}

export function ChatWindow({
  messages,
  streamingContent,
  isLoading,
  approvalDraft,
  isApprovalSubmitting,
  onApprove,
  onRevise,
  onSuggestionSelect,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const showEmpty = messages.length === 0 && !streamingContent && !approvalDraft;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, approvalDraft]);

  return (
    <ScrollArea className="h-full flex-1 bg-[var(--bg-main)]">
      <div className="mx-auto flex min-h-full max-w-[780px] flex-col gap-5 px-6 py-6">
        {showEmpty && (
          <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent-gradient shadow-design-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              OpsIQ AI Operations Hub
            </h2>
            <p className="mt-2 max-w-[380px] text-sm text-[var(--text-secondary)]">
              Select an agent and ask a question. Responses are grounded in your
              organization&apos;s knowledge base.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onSuggestionSelect?.(chip)}
                  className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-[13px] text-[#374151] transition-all duration-150 hover:border-[var(--accent-primary)] hover:bg-[#F9FAFB] hover:text-[var(--accent-primary)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {(streamingContent || isLoading) && (
          <div className="flex justify-start animate-message-in">
            <div className="rounded-[18px_18px_18px_4px] border border-[var(--border-subtle)] bg-white px-5 py-4 shadow-design-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {approvalDraft && onApprove && onRevise && (
          <ApprovalPanel
            draft={approvalDraft}
            isSubmitting={isApprovalSubmitting}
            onApprove={onApprove}
            onRevise={onRevise}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
