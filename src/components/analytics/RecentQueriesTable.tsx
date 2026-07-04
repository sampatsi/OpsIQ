"use client";

import { formatTimeAgo } from "@/lib/ragas-quality";
import type { AnalyticsRecentQuery } from "@/types";
import { cn } from "@/lib/utils";

const AGENT_STYLES: Record<string, string> = {
  internal: "bg-[var(--teal-bg)] text-[var(--teal)]",
  support: "bg-[#e8f0fb] text-[#4a7fc4]",
  report: "bg-[var(--amber-bg)] text-[var(--amber)]",
  onboarding: "bg-[#edf7f0] text-[#2d8f5f]",
  contract: "bg-[#f3eef9] text-[#7b5bb8]",
};

function confidenceColor(score: number | null | undefined, threshold: number): string {
  if (score == null) return "text-[var(--text-2)]";
  if (score >= threshold) return "text-[var(--teal)]";
  if (score >= threshold - 0.15) return "text-[var(--amber)]";
  return "text-[var(--red)]";
}

function statusGlyph(status: string): string {
  if (status === "blocked") return "🚫";
  if (status === "held_for_review") return "⏸";
  return "✓";
}

interface RecentQueriesTableProps {
  queries: AnalyticsRecentQuery[];
  faithfulnessThreshold: number;
}

export function RecentQueriesTable({
  queries,
  faithfulnessThreshold,
}: RecentQueriesTableProps) {
  return (
    <section className="console-card col-span-full p-[18px]">
      <h3 className="mb-3.5 text-[12px] font-semibold text-[var(--text-2)]">🕐 Recent Queries</h3>
      {queries.length === 0 ? (
        <p className="text-[12px] text-[var(--text-2)]">
          No queries logged yet. Send messages in Chat to populate this table.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-left">
                {["Query", "Agent", "Confidence", "Chunks", "Status", "Time"].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--text-2)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queries.map((row, index) => (
                <tr
                  key={`${row.recordedAt ?? index}-${row.query.slice(0, 24)}`}
                  className="border-b border-[var(--line)]/60 transition-colors hover:bg-[var(--paper)]"
                >
                  <td className="max-w-[220px] truncate px-3 py-2.5 text-[var(--text)]" title={row.query}>
                    {row.query}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        AGENT_STYLES[row.agentId] ?? "bg-[var(--paper)] text-[var(--text-2)]"
                      )}
                    >
                      {row.agentName}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        confidenceColor(row.confidence, faithfulnessThreshold)
                      )}
                    >
                      {row.confidence != null
                        ? `${Math.round(row.confidence * 100)}%`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[var(--text-2)]">
                    {row.chunks != null ? row.chunks : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm" title={row.status}>
                    {statusGlyph(row.status)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-[var(--text-2)]">
                    {row.recordedAt ? formatTimeAgo(row.recordedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
