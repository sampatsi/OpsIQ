"use client";

import { Loader2, BarChart3 } from "lucide-react";
import { AnalyticsBarChart } from "@/components/analytics/AnalyticsBarChart";
import { QualityRingGrid } from "@/components/analytics/QualityRingGrid";
import { RecentQueriesTable } from "@/components/analytics/RecentQueriesTable";
import { PageHeader } from "@/components/PageHeader";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="console-page">
      <PageHeader
        icon={BarChart3}
        title="Analytics Dashboard"
        description="Query quality, knowledge coverage, and system performance — aggregated from live telemetry, agent runs, and the knowledge index."
        meta={
          data?.summary ? (
            <p className="font-mono text-xs text-[var(--text-2)]">
              Rolling window: {data.summary.totalQueries} scored queries · faithfulness gate ≥
              {data.summary.faithfulnessThreshold.toFixed(2)}
            </p>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8 md:px-8">
        {isLoading && !data ? (
          <div className="flex h-48 items-center justify-center text-sm text-[var(--text-2)]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--teal)]" />
            Loading analytics…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnalyticsBarChart
              title="📊 Query Volume by Agent"
              items={data?.queryVolumeByAgent ?? []}
            />
            <QualityRingGrid
              title="🎯 Output Quality Scores"
              rings={data?.qualityScores ?? []}
            />
            <AnalyticsBarChart
              title="📂 Knowledge Coverage by Domain"
              items={data?.knowledgeCoverageByDomain ?? []}
              emptyMessage="No indexed documents yet — upload to the Knowledge Base."
            />
            <AnalyticsBarChart
              title="⚡ System Performance"
              items={data?.systemPerformance ?? []}
            />
            <RecentQueriesTable
              queries={data?.recentQueries ?? []}
              faithfulnessThreshold={data?.summary.faithfulnessThreshold ?? 0.7}
            />
          </div>
        )}
      </div>
    </div>
  );
}
