import type { MetricConfig } from "@/lib/ragas-quality";
import {
  formatScorePercent,
  formatThresholdPercent,
  getColor,
  getStatus,
} from "@/lib/ragas-quality";
import type { RagasThresholds } from "@/types/ragas";
import { cn } from "@/lib/utils";

interface MetricScoreCardProps {
  config: MetricConfig;
  score: number;
  thresholds: RagasThresholds;
}

export function MetricScoreCard({ config, score, thresholds }: MetricScoreCardProps) {
  const threshold = thresholds[config.key];
  const status = getStatus(score, threshold);
  const color = getColor(status);
  const Icon = config.icon;

  const badge =
    status === "pass"
      ? { bg: "var(--teal-bg)", text: "var(--teal)", label: "✓ Pass" }
      : status === "warn"
        ? { bg: "var(--amber-bg)", text: "var(--amber)", label: "⚠ Warning" }
        : { bg: "var(--red-bg)", text: "var(--red)", label: "✗ Fail" };

  return (
    <article
      className="console-card p-7"
      title={config.tooltip}
    >
      <MetricCardHeader config={config} Icon={Icon} />

      <p className="mt-4 font-display text-5xl font-bold" style={{ color }}>
        {formatScorePercent(score)}
      </p>

      <div className="mt-5">
        <p className="text-xs text-[var(--text-2)]">
          Target: &gt; {formatThresholdPercent(threshold)}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(score, 1) * 100}%`, backgroundColor: color }}
          />
        </div>
        <span
          className="mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>
    </article>
  );
}

function MetricCardHeader({
  config,
  Icon,
}: {
  config: MetricConfig;
  Icon: MetricConfig["icon"];
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          config.gradientClass
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-2)]">
        {config.name}
      </p>
    </div>
  );
}
