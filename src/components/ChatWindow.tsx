"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { ApprovalPanel } from "@/components/ApprovalPanel";
import { GuardrailIntercept } from "@/components/GuardrailIntercept";
import { GuardrailHeld } from "@/components/GuardrailHeld";
import { TypingIndicator } from "@/components/TypingIndicator";
import { OpsIQLogo } from "@/components/OpsIQLogo";
import type { ChatMessage } from "@/types";

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
  approvalThreadId?: string | null;
  isApprovalSubmitting?: boolean;
  onApprove?: (notes?: string) => void;
  onRevise?: (notes?: string) => void;
  onSuggestionSelect?: (text: string) => void;
}

function renderMessage(msg: ChatMessage) {
  if (msg.guardrail?.status === "blocked") {
    return (
      <GuardrailIntercept
        key={msg.id}
        title={`Guardrail — ${msg.guardrail.reason_code ?? "blocked"}`}
        message={msg.guardrail.message ?? msg.content}
        reasonCode={msg.guardrail.reason_code}
        auditId={msg.guardrail.audit_id}
        restrictedFields={msg.guardrail.restricted_fields}
      />
    );
  }

  if (msg.guardrail?.status === "held") {
    return (
      <GuardrailHeld
        key={msg.id}
        message={msg.content}
        faithfulness={msg.grounding?.faithfulness}
        reasonCode={msg.guardrail.reason_code}
      />
    );
  }

  return <MessageBubble key={msg.id} message={msg} />;
}

export function ChatWindow({
  messages,
  streamingContent,
  isLoading,
  approvalDraft,
  approvalThreadId,
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
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--paper)]">
      <div className="mx-auto flex max-w-chat flex-col gap-5 px-6 py-7 max-[820px]:px-4">
        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <OpsIQLogo size={52} markOnly loop={false} className="mb-5" />
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
              Operations Console
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--text-2)]">
              Select an agent and ask a question. Answers cite your knowledge base
              and pass through active guardrails.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onSuggestionSelect?.(chip)}
                  className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-[13px] text-[var(--text-2)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <span className="self-center font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-2)]">
            Today
          </span>
        )}

        {messages.map(renderMessage)}

        {(streamingContent || isLoading) && (
          <div className="animate-rise mr-auto max-w-[78%] max-[820px]:max-w-[94%]">
            <div className="rounded-2xl rounded-bl-[5px] border border-[var(--line)] bg-[var(--card)] px-4 py-3 shadow-design-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {approvalDraft && onApprove && onRevise && (
          <ApprovalPanel
            draft={approvalDraft}
            threadId={approvalThreadId ?? undefined}
            isSubmitting={isApprovalSubmitting}
            onApprove={onApprove}
            onRevise={onRevise}
          />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
