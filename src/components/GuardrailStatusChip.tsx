"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuardrailConfigStatus } from "@/types";

interface GuardrailStatusChipProps {
  guardrails?: GuardrailConfigStatus | null;
  isLoading?: boolean;
  className?: string;
}

export function GuardrailStatusChip({
  guardrails,
  isLoading,
  className,
}: GuardrailStatusChipProps) {
  const active = guardrails?.active ?? true;
  const label = guardrails?.label ?? (isLoading ? "Guardrails…" : "Guardrails ON");

  return (
    <span
      title="Guardrail status"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[0.7rem] font-medium",
        active
          ? "border-[#c3e4de] bg-[var(--teal-bg)] text-[var(--teal)]"
          : "border-[var(--line)] bg-[var(--paper)] text-[var(--text-2)]",
        className
      )}
    >
      <Lock className="h-3 w-3 shrink-0" aria-hidden />
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          active ? "animate-pulse bg-[var(--teal)]" : "bg-[var(--text-2)]"
        )}
        aria-hidden
      />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
}

interface ModelChipProps {
  model?: string | null;
  className?: string;
}

export function ModelChip({ model, className }: ModelChipProps) {
  if (!model) return null;

  return (
    <span
      className={cn(
        "hidden shrink-0 rounded-md border border-[var(--line)] bg-[var(--paper)] px-2 py-1 font-mono text-[0.64rem] text-[var(--text-2)] sm:inline",
        className
      )}
      title="Active LLM model"
    >
      {model}
    </span>
  );
}
