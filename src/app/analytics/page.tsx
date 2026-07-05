"use client";

import { Loader2, BarChart3 } from "lucide-react";
import { AnalyticsBarChart } from "@/components/analytics/AnalyticsBarChart";
import { QualityRingGrid } from "@/components/analytics/QualityRingGrid";
import { RecentQueriesTable } from "@/components/analytics/RecentQueriesTable";
import { PageHeader } from "@/components/PageHeader";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuditEvents } from "@/hooks/useAuditEvents";

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();
  const { events: auditEvents, isLoading: auditLoading } = useAuditEvents(50);

  return (
    <div className="console-page">
      <PageHeader
        icon={BarChart3}
        title="Analytics Dashboard"
        description="Query quality, knowledge coverage, and system performance — from GET /telemetry/analytics and GET /audit/events."
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

        <section className="rounded-xl border border-[var(--line)] bg-[var(--card)] overflow-hidden">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[var(--ink)]">
              Audit trail
            </h2>
            <p className="text-xs text-[var(--text-2)] mt-0.5">
              Guardrail and approval decisions from GET /audit/events
            </p>
          </div>
          {auditLoading && auditEvents.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-[var(--text-2)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--teal)]" />
              Loading audit events…
            </div>
          ) : auditEvents.length === 0 ? (
            <p className="px-5 py-8 text-sm text-[var(--text-2)] text-center">
              No audit events yet
            </p>
          ) : (
            <ul className="divide-y divide-[var(--line)] max-h-80 overflow-y-auto">
              {auditEvents.map((e) => (
                <li key={e.auditId} className="px-5 py-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-mono text-xs text-[var(--teal)]">{e.action}</span>
                    <span className="font-mono text-[10px] text-[var(--text-2)] shrink-0">
                      {new Date(e.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-2)] mt-1">
                    {e.agentId && <>Agent: {e.agentId} · </>}
                    Audit {e.auditId.slice(0, 8)}…
                    {e.restrictedFields.length > 0 &&
                      ` · Restricted: ${e.restrictedFields.join(", ")}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
