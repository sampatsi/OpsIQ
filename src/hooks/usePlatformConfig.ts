"use client";

import { useCallback, useEffect, useState } from "react";
import { getPlatformConfig } from "@/lib/api";
import type { PlatformConfig } from "@/types";

const POLL_MS = 120_000;

export function usePlatformConfig() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getPlatformConfig();
    setConfig(data);
    return data;
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

  return { config, isLoading, refresh };
}
