"use client";

import { AGENTS, AGENT_GLYPH, GATED_AGENTS } from "@/lib/agents";
import { AgentGlyph } from "@/components/AgentGlyph";
import type { AgentId } from "@/types";
import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  selected: AgentId;
  onSelect: (id: AgentId) => void;
}

export function AgentSelector({ selected, onSelect }: AgentSelectorProps) {
  return (
    <section className="px-3 pb-1.5 pt-4" aria-label="Agents">
      <p className="px-2.5 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-inv-2)]">
        Agents
      </p>
      <div className="space-y-0.5">
        {AGENTS.map((agent) => {
          const isActive = selected === agent.id;
          const isGated = GATED_AGENTS.includes(agent.id);

          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelect(agent.id)}
              className={cn(
                "agent-row flex w-full items-center gap-[11px] rounded-[10px] px-2.5 py-[9px] text-left transition-colors duration-150",
                isActive
                  ? "bg-[var(--ink-2)] shadow-[inset_2px_0_0_var(--teal)]"
                  : "text-[var(--text-inv)] hover:bg-[var(--ink-2)]"
              )}
            >
              <AgentGlyph agentId={agent.id} label={AGENT_GLYPH[agent.id]} size="menu" />
              <span className="min-w-0 flex-1 leading-snug">
                <span className="block text-[0.85rem] font-semibold leading-[1.2] text-[var(--text-inv)]">
                  {agent.name}
                </span>
                <span className="block text-[0.7rem] leading-[1.3] text-[var(--text-inv-2)]">
                  {agent.tagline}
                </span>
              </span>
              {isGated && (
                <span className="agent-gate ml-auto shrink-0">
                  GATED
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
