import type { RagasMetricKey, RagasThresholds } from "@/types/ragas";
import {
  ShieldCheck,
  Target,
  Filter,
  Search,
  type LucideIcon,
} from "lucide-react";

export const DEFAULT_THRESHOLDS: RagasThresholds = {
  faithfulness: 0.8,
  answer_relevancy: 0.85,
  context_precision: 0.75,
  context_recall: 0.8,
};

/** @deprecated use DEFAULT_THRESHOLDS or API thresholds */
export const THRESHOLDS = DEFAULT_THRESHOLDS;

export function mergeThresholds(api?: RagasThresholds | null): RagasThresholds {
  return api ? { ...DEFAULT_THRESHOLDS, ...api } : DEFAULT_THRESHOLDS;
}

export type QualityStatus = "pass" | "warn" | "fail";

export function formatScorePercent(score: number | null | undefined): string {
  if (score == null || Number.isNaN(score)) return "—";
  return `${Math.round(score * 100)}%`;
}

export function getStatus(score: number | null | undefined, threshold: number): QualityStatus {
  if (score == null || Number.isNaN(score)) return "fail";
  if (score >= threshold) return "pass";
  if (score >= threshold - 0.05) return "warn";
  return "fail";
}

export function getColor(status: QualityStatus): string {
  return { pass: "#0E8C7F", warn: "#C4881A", fail: "#B54141" }[status];
}

export function formatThresholdPercent(threshold: number): string {
  return `${Math.round(threshold * 100)}%`;
}

export interface MetricConfig {
  key: RagasMetricKey;
  name: string;
  tooltip: string;
  icon: LucideIcon;
  gradientClass: string;
  chartColor: string;
}

export const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: "faithfulness",
    name: "Faithfulness",
    tooltip: "Are answers grounded in retrieved documents?",
    icon: ShieldCheck,
    gradientClass: "agent-gradient-internal",
    chartColor: "#0E8C7F",
  },
  {
    key: "answer_relevancy",
    name: "Answer Relevancy",
    tooltip: "Do answers address the question asked?",
    icon: Target,
    gradientClass: "agent-gradient-support",
    chartColor: "#2E5FA3",
  },
  {
    key: "context_precision",
    name: "Context Precision",
    tooltip: "Are retrieved chunks actually relevant?",
    icon: Filter,
    gradientClass: "agent-gradient-report",
    chartColor: "#C98A1B",
  },
  {
    key: "context_recall",
    name: "Context Recall",
    tooltip: "Was all needed information retrieved?",
    icon: Search,
    gradientClass: "agent-gradient-onboarding",
    chartColor: "#1F4E46",
  },
];

export const METRIC_EXPLANATIONS = [
  {
    icon: "🛡️",
    heading: "Faithfulness",
    body: "Measures whether every claim in the AI's answer is supported by the retrieved documents. A low score means the AI is adding information not found in your knowledge base — hallucinating.",
    example: "Score 0.87 means 87% of answer statements are directly traceable to source documents.",
  },
  {
    icon: "🎯",
    heading: "Answer Relevancy",
    body: "Measures whether the answer actually addresses the question that was asked. A low score means the AI gives technically accurate but off-topic responses.",
    example: "Score 0.91 means answers are highly focused on what was actually asked.",
  },
  {
    icon: "🔍",
    heading: "Context Precision",
    body: "Measures what proportion of retrieved document chunks were actually useful for answering. A low score means retrieval is returning too much irrelevant content.",
    example: "Score 0.76 means 76% of retrieved chunks contributed to the answer.",
  },
  {
    icon: "📚",
    heading: "Context Recall",
    body: "Measures whether retrieval found ALL the information needed to answer completely. A low score means important context was missed.",
    example: "Score 0.82 means 82% of required information was successfully retrieved.",
  },
] as const;

export function formatEvaluatedAt(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatEvaluatedAt(dateStr);
}

export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function allMetricsPass(
  entry: {
    faithfulness: number;
    answer_relevancy: number;
    context_precision: number;
    context_recall: number;
  },
  thresholds: RagasThresholds = DEFAULT_THRESHOLDS
): boolean {
  return (
    getStatus(entry.faithfulness, thresholds.faithfulness) === "pass" &&
    getStatus(entry.answer_relevancy, thresholds.answer_relevancy) === "pass" &&
    getStatus(entry.context_precision, thresholds.context_precision) === "pass" &&
    getStatus(entry.context_recall, thresholds.context_recall) === "pass"
  );
}

export function countFailedMetrics(
  entry: {
    faithfulness: number;
    answer_relevancy: number;
    context_precision: number;
    context_recall: number;
  },
  thresholds: RagasThresholds = DEFAULT_THRESHOLDS
): number {
  return [
    getStatus(entry.faithfulness, thresholds.faithfulness),
    getStatus(entry.answer_relevancy, thresholds.answer_relevancy),
    getStatus(entry.context_precision, thresholds.context_precision),
    getStatus(entry.context_recall, thresholds.context_recall),
  ].filter((s) => s === "fail").length;
}
