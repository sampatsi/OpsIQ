import { FAITHFULNESS_GATE } from "@/types";

interface GuardrailHeldProps {
  message: string;
  faithfulness?: number;
  reasonCode?: string;
}

export function GuardrailHeld({ message, faithfulness, reasonCode }: GuardrailHeldProps) {
  return (
    <div
      className="animate-rise max-w-[78%] self-start rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 shadow-design-sm max-[820px]:max-w-[94%]"
      role="status"
    >
      <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-2)]">
        Answer held for review
        {reasonCode && (
          <span className="ml-2 text-[var(--amber)]">{reasonCode}</span>
        )}
      </h4>
      <p className="text-[13px] leading-relaxed text-[var(--text-2)]">{message}</p>
      {faithfulness != null && (
        <p className="mt-2 font-mono text-[10px] text-[var(--text-2)]">
          Faithfulness {faithfulness.toFixed(2)} · gate ≥ {FAITHFULNESS_GATE.toFixed(2)}
        </p>
      )}
    </div>
  );
}
