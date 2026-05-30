import { Loader2 } from "lucide-react";

interface QualityEmptyStateProps {
  onRun: () => void;
  isRunning?: boolean;
}

export function QualityEmptyState({ onRun, isRunning }: QualityEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-8 py-20 text-center">
      <span className="text-6xl" aria-hidden>
        📊
      </span>
      <h2 className="mt-6 font-display text-2xl font-semibold text-[#0A0A0F]">
        No Evaluations Yet
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B7280]">
        Run your first evaluation to see how well OpsIQ is performing on your knowledge base.
      </p>
      <button
        type="button"
        onClick={onRun}
        disabled={isRunning}
        className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running evaluation...
          </>
        ) : (
          "Run First Evaluation"
        )}
      </button>
    </div>
  );
}
