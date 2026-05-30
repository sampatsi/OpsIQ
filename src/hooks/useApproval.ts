"use client";

import { useCallback, useState } from "react";
import type { ApprovalState } from "@/types";
import { approveReport } from "@/lib/api";

export function useApproval(sessionId: string) {
  const [pending, setPending] = useState<ApprovalState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setApproval = useCallback(
    (threadId: string, draft: string) => {
      setPending({ threadId, draft, sessionId });
    },
    [sessionId]
  );

  const clearApproval = useCallback(() => {
    setPending(null);
  }, []);

  const submitApproval = useCallback(
    async (approved: boolean, notes?: string) => {
      if (!pending) return null;
      setIsSubmitting(true);
      try {
        const result = await approveReport({
          session_id: pending.sessionId,
          thread_id: pending.threadId,
          approved,
          notes,
        });
        setPending(null);
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [pending]
  );

  return {
    pending,
    isSubmitting,
    setApproval,
    clearApproval,
    submitApproval,
  };
}
