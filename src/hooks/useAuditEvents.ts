"use client";

import { useCallback, useEffect, useState } from "react";
import { getAuditEvents } from "@/lib/api";
import type { AuditEntry } from "@/types";

const POLL_MS = 60_000;

export function useAuditEvents(limit = 50) {
  const [events, setEvents] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getAuditEvents(limit);
    setEvents(next);
    return next;
  }, [limit]);

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

  return { events, isLoading, refresh };
}
