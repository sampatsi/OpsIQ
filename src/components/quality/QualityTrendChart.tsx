"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import {
  METRIC_CONFIGS,
  formatChartDate,
  formatScorePercent,
} from "@/lib/ragas-quality";
import type { RagasHistoryEntry, RagasThresholds } from "@/types/ragas";

interface QualityTrendChartProps {
  history: RagasHistoryEntry[];
  thresholds: RagasThresholds;
  isLoading?: boolean;
}

export function QualityTrendChart({ history, thresholds, isLoading }: QualityTrendChartProps) {
  const chartData = [...history]
    .reverse()
    .map((entry) => ({
      label: formatChartDate(entry.evaluated_at),
      faithfulness: entry.faithfulness,
      answer_relevancy: entry.answer_relevancy,
      context_precision: entry.context_precision,
      context_recall: entry.context_recall,
    }));

  if (isLoading) {
    return (
      <div className="console-card flex h-80 items-center justify-center">
        <div className="flex items-center gap-2 text-[var(--text-2)]">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--teal)]" />
          Loading chart…
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="console-card flex h-80 items-center justify-center text-sm text-[var(--text-2)]">
        No saved evaluation history yet. Scores appear here after a backend evaluation completes.
      </div>
    );
  }

  return (
    <div className="console-card p-6">
      <h2 className="mb-6 font-display text-lg font-semibold text-[var(--text)]">
        Quality Trends — Last 30 Evaluations
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-2)" }} />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 12, fill: "var(--text-2)" }}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {METRIC_CONFIGS.map((metric) => (
            <ReferenceLine
              key={`ref-${metric.key}`}
              y={thresholds[metric.key]}
              stroke={metric.chartColor}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />
          ))}
          {METRIC_CONFIGS.map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              name={metric.name}
              stroke={metric.chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 shadow-design-md">
      <p className="mb-2 font-mono text-xs text-[var(--text-2)]">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-sm" style={{ color: item.color }}>
          {item.name}: {formatScorePercent(item.value)}
        </p>
      ))}
    </div>
  );
}
