"use client";

import { useQuality } from "@/hooks/useQuality";
import { FAITHFULNESS_GATE } from "@/types";
import { cn } from "@/lib/utils";

const METRICS = [
  { key: "faithfulness" as const, label: "Faithfulness", warnBelow: FAITHFULNESS_GATE },
  { key: "answer_relevancy" as const, label: "Relevancy", warnBelow: 0.85 },
  { key: "context_precision" as const, label: "Ctx precision", warnBelow: 0.75 },
  { key: "context_recall" as const, label: "Ctx recall", warnBelow: 0.8 },
];

function MetricRow({
  label,
  value,
  warnBelow,
}: {
  label: string;
  value: number | null;
  warnBelow: number;
}) {
  const pct = value != null ? Math.round(value * 100) : 0;
  const warn = value != null && value < warnBelow;

  return (
    <div className="mb-2 flex items-center gap-2 last:mb-0">
      <span className="w-[88px] shrink-0 text-[10.5px] text-[var(--text-inv)]">{label}</span>
      <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-[#0b1322]">
        <div
          className={cn("block h-full rounded-[3px]", warn ? "bg-[var(--amber)]" : "bg-[var(--teal)]")}
          style={{ width: value != null ? `${pct}%` : "0%" }}
        />
      </div>
      <b className="w-[30px] shrink-0 text-right font-mono text-[10.5px] font-medium text-[var(--text-inv)]">
        {value != null ? `.${String(Math.round(value * 100)).padStart(2, "0")}` : "—"}
      </b>
    </div>
  );
}

function QualityStripSkeleton() {
  return (
    <div className="mx-3 mb-3 mt-auto animate-pulse rounded-xl border border-[var(--line-ink)] bg-[var(--ink-2)] p-3.5">
      <div className="mb-3 h-3 w-32 rounded bg-[#0b1322]" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="mb-2 flex gap-2">
          <div className="h-3 w-20 rounded bg-[#0b1322]" />
          <div className="h-[5px] flex-1 rounded bg-[#0b1322]" />
        </div>
      ))}
    </div>
  );
}

export function SidebarQualityStrip() {
  const { latest, isLoading, sampleCount } = useQuality();

  if (isLoading) return <QualityStripSkeleton />;

  return (
    <div
      className="mx-3 mb-3 mt-auto rounded-xl border border-[var(--line-ink)] bg-[var(--ink-2)] p-3.5"
      aria-label="Live answer quality"
    >
      <h3 className="mb-[11px] flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-inv-2)]">
        Answer quality · live
        <span className="text-[var(--teal)]">
          {sampleCount > 0 ? `n=${sampleCount}` : "RAGAS"}
        </span>
      </h3>
      {METRICS.map(({ key, label, warnBelow }) => (
        <MetricRow key={key} label={label} value={latest?.[key] ?? null} warnBelow={warnBelow} />
      ))}
      <p className="mt-[11px] border-t border-[var(--line-ink)] pt-2.5 text-[10.5px] leading-snug text-[var(--text-inv-2)]">
        Answers below{" "}
        <b className="font-semibold text-[var(--amber)]">{FAITHFULNESS_GATE.toFixed(2)} faithfulness</b>{" "}
        are held for review, not shown.
      </p>
    </div>
  );
}
