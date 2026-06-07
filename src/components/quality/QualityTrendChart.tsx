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
      <div className="flex h-80 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2 text-[#6B7280]">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-primary)]" />
          Loading chart…
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-sm text-[#6B7280]">
        No saved evaluation history yet. Scores appear here after a backend evaluation completes.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
      <h2 className="mb-6 font-display text-lg font-semibold text-[#0A0A0F]">
        Quality Trends — Last 30 Evaluations
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6B7280" }} />
          <YAxis
            domain={[0, 1]}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine
            y={thresholds.faithfulness}
            stroke="#10B981"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <ReferenceLine
            y={thresholds.answer_relevancy}
            stroke="#6366F1"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <ReferenceLine
            y={thresholds.context_precision}
            stroke="#8B5CF6"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <ReferenceLine
            y={thresholds.context_recall}
            stroke="#F59E0B"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
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
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-design-md">
      <p className="mb-2 text-xs font-medium text-[#6B7280]">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-sm" style={{ color: item.color }}>
          {item.name}: {formatScorePercent(item.value)}
        </p>
      ))}
    </div>
  );
}
