export interface RagasThresholds {
  faithfulness: number;
  answer_relevancy: number;
  context_precision: number;
  context_recall: number;
}

export interface RagasLatest {
  id?: string;
  evaluated_at: string;
  faithfulness: number;
  answer_relevancy: number;
  context_precision: number;
  context_recall: number;
  total_queries?: number;
  passed_queries?: number;
  duration_seconds?: number;
  alert_fired: boolean;
  run_label?: string;
}

export interface RagasHistoryEntry {
  id?: string;
  evaluated_at: string;
  faithfulness: number;
  answer_relevancy: number;
  context_precision: number;
  context_recall: number;
  total_queries?: number;
  passed_queries?: number;
  alert_fired: boolean;
  run_label?: string;
}

export interface RagasStatus {
  running: boolean;
  started_at?: number | null;
  last_result?: unknown;
  error?: string | null;
}

export interface RagasEvaluateResponse {
  status: string;
  message?: string;
}

export type RagasMetricKey = keyof RagasThresholds;
