"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getRagasHistory,
  getRagasLatest,
  getRagasStatus,
  getRagasThresholds,
  runRagasEvaluation,
} from "@/lib/api";
import { DEFAULT_THRESHOLDS, mergeThresholds } from "@/lib/ragas-quality";
import type { RagasHistoryEntry, RagasLatest, RagasThresholds } from "@/types/ragas";

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

export function useQuality() {
  const [latest, setLatest] = useState<RagasLatest | null>(null);
  const [history, setHistory] = useState<RagasHistoryEntry[]>([]);
  const [thresholds, setThresholds] = useState<RagasThresholds>(DEFAULT_THRESHOLDS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baselineEvaluatedAt = useRef<string | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const refresh = useCallback(async () => {
    const [latestData, historyData, thresholdData] = await Promise.all([
      getRagasLatest(),
      getRagasHistory(30),
      getRagasThresholds().catch(() => null),
    ]);
    setLatest(latestData);
    setHistory(historyData);
    if (thresholdData) setThresholds(mergeThresholds(thresholdData));
    return latestData;
  }, []);

  const pollUntilComplete = useCallback(() => {
    clearPoll();
    pollRef.current = setInterval(async () => {
      try {
        const status = await getRagasStatus();
        if (status.error) {
          clearPoll();
          setIsRunning(false);
          setError(status.error);
          return;
        }

        const latestData = await refresh();
        const evalFinished = !status.running;
        const hasNewResult =
          latestData && latestData.evaluated_at !== baselineEvaluatedAt.current;

        if (evalFinished && (hasNewResult || !baselineEvaluatedAt.current)) {
          clearPoll();
          setIsRunning(false);
          if (latestData) setSuccessMessage("Evaluation complete");
        }
      } catch {
        // keep polling until timeout
      }
    }, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      clearPoll();
      setIsRunning(false);
    }, POLL_TIMEOUT_MS);
  }, [clearPoll, refresh]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latestData = await refresh();
      const status = await getRagasStatus();
      if (status.running) {
        baselineEvaluatedAt.current = latestData?.evaluated_at ?? null;
        setIsRunning(true);
        pollUntilComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quality data");
    } finally {
      setIsLoading(false);
    }
  }, [refresh, pollUntilComplete]);

  useEffect(() => {
    load();
    return () => clearPoll();
  }, [load, clearPoll]);

  const runEvaluation = useCallback(async () => {
    setIsRunning(true);
    setSuccessMessage(null);
    setError(null);
    baselineEvaluatedAt.current = latest?.evaluated_at ?? null;

    try {
      const result = await runRagasEvaluation();
      if (result.status === "completed") {
        await refresh();
        setIsRunning(false);
        setSuccessMessage("Evaluation complete");
        return;
      }
      pollUntilComplete();
    } catch (err) {
      setIsRunning(false);
      setError(err instanceof Error ? err.message : "Failed to start evaluation");
    }
  }, [latest?.evaluated_at, refresh, pollUntilComplete]);

  return {
    latest,
    history,
    thresholds,
    isLoading,
    isRunning,
    error,
    successMessage,
    runEvaluation,
    refresh,
    dismissSuccess: () => setSuccessMessage(null),
  };
}
