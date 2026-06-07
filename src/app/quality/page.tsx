"use client";

import dynamic from "next/dynamic";
import { EvaluationHistoryTable } from "@/components/quality/EvaluationHistoryTable";
import { MetricExplanationGrid } from "@/components/quality/MetricExplanationGrid";
import { MetricScoreCard } from "@/components/quality/MetricScoreCard";
import { QualityEmptyState } from "@/components/quality/QualityEmptyState";
import { ScoreCardSkeleton } from "@/components/quality/ScoreCardSkeleton";
import { useQuality } from "@/hooks/useQuality";
import { METRIC_CONFIGS, formatTimeAgo } from "@/lib/ragas-quality";
import { Loader2 } from "lucide-react";

const QualityTrendChart = dynamic(
  () =>
    import("@/components/quality/QualityTrendChart").then((m) => m.QualityTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-primary)]" />
      </div>
    ),
  }
);

export default function QualityPage() {
  const { latest, history, thresholds, isLoading } = useQuality();

  const hasData = !!latest || history.length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-main)]">
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10 md:px-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0A0A0F]">
            AI Quality Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B7280]">
            Read-only view of stored RAGAS scores. This page never runs evaluations or
            uses API tokens — it only displays existing results from the database.
          </p>
          {latest?.evaluated_at && (
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Last evaluated: {formatTimeAgo(latest.evaluated_at)}
            </p>
          )}
        </div>

        {isLoading && (
          <div className="space-y-10">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ScoreCardSkeleton key={i} />
              ))}
            </section>
            <div className="flex h-40 items-center justify-center text-sm text-[#9CA3AF]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading saved scores…
            </div>
          </div>
        )}

        {!isLoading && !hasData && (
          <>
            <QualityEmptyState />
            <MetricExplanationGrid />
          </>
        )}

        {!isLoading && hasData && (
          <>
            {latest && (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {METRIC_CONFIGS.map((config) => (
                  <MetricScoreCard
                    key={config.key}
                    config={config}
                    score={latest[config.key] ?? 0}
                    thresholds={thresholds}
                  />
                ))}
              </section>
            )}

            <QualityTrendChart history={history} thresholds={thresholds} />

            <MetricExplanationGrid />

            {history.length > 0 && (
              <EvaluationHistoryTable history={history} thresholds={thresholds} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
