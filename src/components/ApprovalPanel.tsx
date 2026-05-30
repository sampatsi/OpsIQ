"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ApprovalPanelProps {
  draft: string;
  isSubmitting?: boolean;
  onApprove: (notes?: string) => void;
  onRevise: (notes?: string) => void;
}

export function ApprovalPanel({
  draft,
  isSubmitting,
  onApprove,
  onRevise,
}: ApprovalPanelProps) {
  const [notes, setNotes] = useState("");

  return (
    <div className="my-4 rounded-2xl border border-[#E0E7FF] bg-white p-6 shadow-design-md">
      <span className="inline-flex items-center rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#92400E]">
        ⏳ Awaiting Approval
      </span>

      <div className="mt-4 max-h-[400px] overflow-y-auto rounded-xl bg-[#F9FAFB] p-5 text-sm leading-[1.7] whitespace-pre-wrap text-[var(--text-primary)]">
        {draft}
      </div>

      <div className="mt-5 space-y-3">
        <Textarea
          placeholder="Add revision notes (optional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="resize-y border-[var(--border)] text-[13px]"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApprove(notes || undefined)}
            disabled={isSubmitting}
            className="btn-approve-gradient inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "✅"
            )}
            Approve & Finalize
          </button>
          <button
            type="button"
            onClick={() => onRevise(notes || undefined)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            ✏️ Request Revision
          </button>
        </div>
      </div>
    </div>
  );
}
