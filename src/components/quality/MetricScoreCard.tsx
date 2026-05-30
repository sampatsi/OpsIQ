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
      ? { bg: "#DCFCE7", text: "#166534", label: "✓ Pass" }
      : status === "warn"
        ? { bg: "#FEF3C7", text: "#92400E", label: "⚠ Warning" }
        : { bg: "#FEE2E2", text: "#991B1B", label: "✗ Fail" };

  return (
    <article
      className="relative rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-design-sm"
      title={config.tooltip}
    >
      <MetricCardHeader config={config} Icon={Icon} />

      <p className="mt-4 font-display text-5xl font-bold" style={{ color }}>
        {formatScorePercent(score)}
      </p>

      <div className="mt-5">
        <p className="text-xs text-[#6B7280]">
          Target: &gt; {formatThresholdPercent(threshold)}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
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
      <p className="text-sm font-medium uppercase tracking-wide text-[#6B7280]">
        {config.name}
      </p>
    </div>
  );
}
