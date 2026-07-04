"use client";

import { useCallback, useState } from "react";
import type { ApprovalState } from "@/types";
import { approveReport } from "@/lib/api";

export function useApproval(sessionId: string) {
  const [pending, setPending] = useState<ApprovalState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApproval = useCallback(
    (threadId: string, draft: string) => {
      setPending({ threadId, draft, sessionId });
      setError(null);
    },
    [sessionId]
  );

  const clearApproval = useCallback(() => {
    setPending(null);
    setError(null);
  }, []);

  const submitApproval = useCallback(
    async (approved: boolean, notes?: string) => {
      if (!pending) return null;
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await approveReport({
          session_id: pending.sessionId,
          thread_id: pending.threadId,
          approved,
          revision_notes: notes,
        });
        setPending(null);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Approval failed");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [pending]
  );

  return {
    pending,
    isSubmitting,
    error,
    setApproval,
    clearApproval,
    submitApproval,
  };
}
