"use client";

import { useCallback, useEffect, useState } from "react";
import { getRagasHistory, getRagasLatest, getRagasThresholds } from "@/lib/api";
import { DEFAULT_THRESHOLDS, mergeThresholds } from "@/lib/ragas-quality";
import type { RagasHistoryEntry, RagasLatest, RagasThresholds } from "@/types/ragas";

export function useQuality() {
  const [latest, setLatest] = useState<RagasLatest | null>(null);
  const [history, setHistory] = useState<RagasHistoryEntry[]>([]);
  const [thresholds, setThresholds] = useState<RagasThresholds>(DEFAULT_THRESHOLDS);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [latestData, historyData, thresholdData] = await Promise.all([
      getRagasLatest(),
      getRagasHistory(30),
      getRagasThresholds(),
    ]);
    setLatest(latestData);
    setHistory(historyData);
    if (thresholdData) setThresholds(mergeThresholds(thresholdData));
    return { latestData, historyData };
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

  return {
    latest,
    history,
    thresholds,
    isLoading,
    refresh,
  };
}
