import type { SourceCitation } from "@/types";
import { FAITHFULNESS_GATE } from "@/types";
import { cn } from "@/lib/utils";

const TEAL_THRESHOLD = 0.85;

interface GroundingMeterProps {
  sources?: SourceCitation[];
  faithfulness?: number;
}

function formatCitation(source: SourceCitation): string {
  const page =
    source.page_number != null
      ? ` · p.${source.page_number}`
      : source.department
        ? ` · ${source.department}`
        : "";
  return `${source.title}${page}`;
}

export function GroundingMeter({ sources = [], faithfulness }: GroundingMeterProps) {
  const score = faithfulness ?? null;
  const hasSources = sources.length > 0;

  if (score == null && !hasSources) return null;

  const pct = score != null ? Math.min(100, Math.round(score * 100)) : null;
  const barClass =
    score == null
      ? "bg-[var(--line)]"
      : score >= TEAL_THRESHOLD
        ? "bg-[var(--teal)]"
        : score >= FAITHFULNESS_GATE
          ? "bg-[var(--amber)]"
          : "bg-[var(--red)]";
  const verified = score != null && score >= FAITHFULNESS_GATE;

  return (
    <div
      className="grounding-footer mt-px flex w-full flex-wrap items-center gap-2.5 px-4 py-2.5 font-mono text-[10px]"
      role="group"
      aria-label="Grounding details"
    >
      <span className="flex items-center gap-1.5 text-[var(--text-2)]">
        Faithfulness
        <span
          className="relative h-1 w-[38px] overflow-hidden rounded-sm bg-[var(--line)]"
          aria-label={
            score != null ? `Faithfulness score ${score.toFixed(2)}` : "Faithfulness unavailable"
          }
        >
          {pct != null && (
            <span
              className={cn("absolute inset-y-0 left-0 rounded-sm", barClass)}
              style={{ width: `${pct}%` }}
            />
          )}
        </span>
        <b className="font-medium text-[var(--text)]">
          {score != null ? score.toFixed(2) : "—"}
        </b>
      </span>

      {sources.slice(0, 4).map((source, i) => (
        <span
          key={source.document_id ?? i}
          className="inline-flex items-center gap-1 rounded-md border border-[#c9e6e0] bg-[var(--teal-bg)] px-2 py-0.5 text-[10px] text-[var(--teal)]"
          title={source.snippet}
        >
          {formatCitation(source)}
        </span>
      ))}

      {verified && (
        <span className="ml-auto flex items-center gap-1 text-[var(--teal)]">
          <span aria-hidden>✓</span>
          Grounded
        </span>
      )}
    </div>
  );
}
