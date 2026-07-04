"use client";

import { useCallback, useEffect, useState } from "react";
import { getAnalyticsDashboard } from "@/lib/api";
import type { AnalyticsDashboard } from "@/types";

const POLL_MS = 60_000;

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getAnalyticsDashboard();
    setData(next);
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

  return { data, isLoading, refresh };
}
