"use client";

import { Loader2, Sparkles, X } from "lucide-react";
import { EvaluationHistoryTable } from "@/components/quality/EvaluationHistoryTable";
import { MetricExplanationGrid } from "@/components/quality/MetricExplanationGrid";
import { MetricScoreCard } from "@/components/quality/MetricScoreCard";
import { QualityEmptyState } from "@/components/quality/QualityEmptyState";
import { QualityTrendChart } from "@/components/quality/QualityTrendChart";
import { ScoreCardSkeleton } from "@/components/quality/ScoreCardSkeleton";
import { useQuality } from "@/hooks/useQuality";
import { METRIC_CONFIGS, formatTimeAgo } from "@/lib/ragas-quality";

export default function QualityPage() {
  const {
    latest,
    history,
    thresholds,
    isLoading,
    isRunning,
    error,
    successMessage,
    runEvaluation,
    dismissSuccess,
  } = useQuality();

  const hasData = !!latest;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-main)]">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0A0A0F]">
              AI Quality Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B7280]">
              Real-time evaluation of retrieval accuracy and answer quality across your
              knowledge base.
            </p>
            {latest?.evaluated_at && (
              <p className="mt-2 text-xs text-[#9CA3AF]">
                Last evaluated: {formatTimeAgo(latest.evaluated_at)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={runEvaluation}
            disabled={isRunning || isLoading}
            className="btn-gradient inline-flex shrink-0 items-center gap-2 self-start rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running evaluation...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run Evaluation
              </>
            )}
          </button>
        </div>

        {successMessage && (
          <div className="flex items-center justify-between rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
            <span>{successMessage}</span>
            <button type="button" onClick={dismissSuccess} aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <p className="mt-1 text-xs">
              Backend: http://localhost:8000/api/v1/ragas — ensure the FastAPI server is running.
            </p>
          </div>
        )}

        {!isLoading && !hasData ? (
          <QualityEmptyState onRun={runEvaluation} isRunning={isRunning} />
        ) : (
          <>
            {/* Score cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <ScoreCardSkeleton key={i} />)
                : latest &&
                  METRIC_CONFIGS.map((config) => (
                    <MetricScoreCard
                      key={config.key}
                      config={config}
                      score={latest[config.key] ?? 0}
                      thresholds={thresholds}
                    />
                  ))}
            </section>

            <QualityTrendChart history={history} thresholds={thresholds} isLoading={isLoading} />

            <MetricExplanationGrid />

            <EvaluationHistoryTable history={history} thresholds={thresholds} />
          </>
        )}
      </div>
    </div>
  );
}
