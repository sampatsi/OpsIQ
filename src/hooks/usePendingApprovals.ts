"use client";

import { useCallback, useEffect, useState } from "react";
import { listPendingApprovals } from "@/lib/api";
import type { ApprovalRequestRecord } from "@/types";

const POLL_MS = 30_000;

export function usePendingApprovals() {
  const [approvals, setApprovals] = useState<ApprovalRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await listPendingApprovals();
    setApprovals(next);
    return next;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        await refresh();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refresh();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { approvals, isLoading, refresh };
}
