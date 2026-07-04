"use client";

import dynamic from "next/dynamic";
import { EvaluationHistoryTable } from "@/components/quality/EvaluationHistoryTable";
import { MetricExplanationGrid } from "@/components/quality/MetricExplanationGrid";
import { MetricScoreCard } from "@/components/quality/MetricScoreCard";
import { QualityEmptyState } from "@/components/quality/QualityEmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ScoreCardSkeleton } from "@/components/quality/ScoreCardSkeleton";
import { useQuality } from "@/hooks/useQuality";
import { METRIC_CONFIGS, formatTimeAgo } from "@/lib/ragas-quality";
import { Loader2, Sparkles } from "lucide-react";

const QualityTrendChart = dynamic(
  () =>
    import("@/components/quality/QualityTrendChart").then((m) => m.QualityTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="console-card flex h-80 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--teal)]" />
      </div>
    ),
  }
);

export default function QualityPage() {
  const { latest, history, thresholds, isLoading } = useQuality();

  const hasData = !!latest || history.length > 0;

  return (
    <div className="console-page">
      <PageHeader
        icon={Sparkles}
        title="AI Quality Dashboard"
        description="Read-only view of stored RAGAS scores. This page never runs evaluations or uses API tokens — it only displays existing results from the database."
        meta={
          latest?.evaluated_at ? (
            <p className="font-mono text-xs text-[var(--text-2)]">
              Last evaluated: {formatTimeAgo(latest.evaluated_at)}
            </p>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-8 md:px-8">
        {isLoading && (
          <div className="space-y-10">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ScoreCardSkeleton key={i} />
              ))}
            </section>
            <div className="flex h-40 items-center justify-center text-sm text-[var(--text-2)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--teal)]" />
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
