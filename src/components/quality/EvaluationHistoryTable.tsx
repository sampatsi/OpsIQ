import {
  allMetricsPass,
  countFailedMetrics,
  formatEvaluatedAt,
  formatScorePercent,
  getColor,
  getStatus,
} from "@/lib/ragas-quality";
import type { RagasHistoryEntry, RagasMetricKey, RagasThresholds } from "@/types/ragas";
import { cn } from "@/lib/utils";

interface EvaluationHistoryTableProps {
  history: RagasHistoryEntry[];
  thresholds: RagasThresholds;
}

const SCORE_COLUMNS: { key: RagasMetricKey; label: string }[] = [
  { key: "faithfulness", label: "Faithfulness" },
  { key: "answer_relevancy", label: "Relevancy" },
  { key: "context_precision", label: "Precision" },
  { key: "context_recall", label: "Recall" },
];

function ScoreCell({
  value,
  metricKey,
  thresholds,
}: {
  value: number;
  metricKey: RagasMetricKey;
  thresholds: RagasThresholds;
}) {
  const status = getStatus(value, thresholds[metricKey]);
  return (
    <span className="font-medium tabular-nums" style={{ color: getColor(status) }}>
      {formatScorePercent(value)}
    </span>
  );
}

export function EvaluationHistoryTable({ history, thresholds }: EvaluationHistoryTableProps) {
  const rows = history.slice(0, 10);

  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-semibold text-[#0A0A0F]">
        Evaluation History
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-[#F9FAFB] text-left">
                {["Date", "Faithfulness", "Relevancy", "Precision", "Recall", "Status", "Alert"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-[#6B7280]"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[#9CA3AF]">
                    No evaluation history yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const passed = allMetricsPass(row, thresholds);
                  const failedCount = countFailedMetrics(row, thresholds);
                  return (
                    <tr
                      key={row.evaluated_at}
                      className={cn(
                        "border-t border-[#F3F4F6]",
                        row.alert_fired ? "bg-[#FFF7ED]" : "bg-white"
                      )}
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-[#0A0A0F]">
                        {formatEvaluatedAt(row.evaluated_at)}
                      </td>
                      {SCORE_COLUMNS.map(({ key }) => (
                        <td key={key} className="px-5 py-3.5">
                          <ScoreCell value={row[key]} metricKey={key} thresholds={thresholds} />
                        </td>
                      ))}
                      <td className="px-5 py-3.5">
                        {passed ? (
                          <span className="inline-flex rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                            All Pass
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-xs font-medium text-[#991B1B]">
                            {failedCount} Failed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {row.alert_fired ? "🔔" : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
