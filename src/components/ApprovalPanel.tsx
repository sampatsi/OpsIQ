"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ApprovalPanelProps {
  draft: string;
  threadId?: string;
  isSubmitting?: boolean;
  onApprove: (notes?: string) => void;
  onRevise: (notes?: string) => void;
}

export function ApprovalPanel({
  draft,
  threadId,
  isSubmitting,
  onApprove,
  onRevise,
}: ApprovalPanelProps) {
  const [notes, setNotes] = useState("");

  return (
    <div className="animate-rise w-full max-w-[78%] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] max-[820px]:max-w-[94%]">
      <div className="flex items-center gap-2 border-b border-[#ead3a4] bg-[var(--amber-bg)] px-4 py-2.5">
        <span
          className="gate-pulse h-2 w-2 shrink-0 rounded-full bg-[var(--amber)]"
          aria-hidden
        />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--amber)]">
          Human approval required
        </span>
        {threadId && (
          <small className="ml-auto font-mono text-[10px] text-[#9a7a38]">
            {threadId.slice(0, 16)} · expires 24 h
          </small>
        )}
      </div>

      <div className="px-4 py-4 text-[13px] leading-relaxed text-[var(--text)]">
        <p className="text-[var(--text-2)]">
          Review the draft below. Nothing is sent until you approve.
        </p>
        <div className="mt-2.5 max-h-[320px] overflow-y-auto whitespace-pre-wrap rounded-[10px] border border-[var(--line)] bg-[var(--paper)] p-3.5 text-[13px] text-[var(--text-2)]">
          {draft}
        </div>
        <Textarea
          placeholder="Revision notes (optional)…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-3 resize-y border-[var(--line)] font-sans text-[13px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={() => onApprove(notes || undefined)}
          disabled={isSubmitting}
          className="btn-teal inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[13px] font-semibold disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Approve & send
        </button>
        <button
          type="button"
          onClick={() => onRevise(notes || undefined)}
          disabled={isSubmitting}
          className="rounded-[9px] border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-[13px] font-semibold text-[var(--text)] transition-transform active:scale-[0.97] disabled:opacity-50"
        >
          Request changes
        </button>
        <span className="ml-auto self-center font-mono text-[11px] text-[var(--text-2)]">
          approver: you · logged
        </span>
      </div>
    </div>
  );
}
