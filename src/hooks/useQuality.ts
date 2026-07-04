"use client";

import { useCallback, useEffect, useState } from "react";
import { getLiveQuality, getRagasHistory, getRagasLatest, getRagasThresholds } from "@/lib/api";
import { DEFAULT_THRESHOLDS, mergeThresholds } from "@/lib/ragas-quality";
import type { RagasHistoryEntry, RagasLatest, RagasThresholds } from "@/types/ragas";

const POLL_MS = 60_000;

function liveToLatest(live: Awaited<ReturnType<typeof getLiveQuality>>): RagasLatest | null {
  if (!live || live.sampleCount === 0) return null;
  return {
    evaluated_at: new Date().toISOString(),
    faithfulness: live.faithfulness ?? 0,
    answer_relevancy: live.answerRelevancy ?? 0,
    context_precision: live.contextPrecision ?? 0,
    context_recall: live.contextRecall ?? 0,
    alert_fired: false,
  };
}

export function useQuality() {
  const [latest, setLatest] = useState<RagasLatest | null>(null);
  const [history, setHistory] = useState<RagasHistoryEntry[]>([]);
  const [thresholds, setThresholds] = useState<RagasThresholds>(DEFAULT_THRESHOLDS);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleCount, setSampleCount] = useState(0);

  const refresh = useCallback(async () => {
    const [liveData, latestData, historyData, thresholdData] = await Promise.all([
      getLiveQuality(20),
      getRagasLatest(),
      getRagasHistory(30),
      getRagasThresholds(),
    ]);
    setLatest(liveToLatest(liveData) ?? latestData);
    setSampleCount(liveData?.sampleCount ?? 0);
    setHistory(historyData);
    if (thresholdData) setThresholds(mergeThresholds(thresholdData));
    return { latestData, historyData, liveData };
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

  return {
    latest,
    history,
    thresholds,
    isLoading,
    sampleCount,
    refresh,
  };
}
