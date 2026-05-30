"use client";

import {
  Building2,
  Headphones,
  FileBarChart,
  UserPlus,
  FileSignature,
  type LucideIcon,
} from "lucide-react";
import { AGENTS, AGENT_GRADIENT_CLASS } from "@/lib/agents";
import type { AgentId } from "@/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Headphones,
  FileBarChart,
  UserPlus,
  FileSignature,
};

interface AgentSelectorProps {
  selected: AgentId;
  onSelect: (id: AgentId) => void;
}

export function AgentSelector({ selected, onSelect }: AgentSelectorProps) {
  return (
    <div className="space-y-1.5">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
        Agents
      </p>
      <div className="space-y-1">
        {AGENTS.map((agent, index) => {
          const Icon = ICONS[agent.icon] ?? Building2;
          const isActive = selected === agent.id;
          const gradientClass = AGENT_GRADIENT_CLASS[agent.id];

          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelect(agent.id)}
              style={{ animationDelay: `${index * 60}ms` }}
              className={cn(
                "animate-slide-in-left flex w-full items-start gap-2.5 rounded-[10px] border border-transparent p-2.5 text-left transition-all duration-150",
                isActive
                  ? "border-[rgba(99,102,241,0.35)] bg-[var(--bg-sidebar-active)] shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)]"
                  : "bg-transparent hover:bg-[var(--bg-sidebar-hover)]"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  gradientClass
                )}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    isActive ? "text-white" : "text-[#E5E7EB]"
                  )}
                >
                  {agent.name}
                </p>
                <p
                  className={cn(
                    "truncate text-[11px] leading-snug",
                    isActive ? "text-[#D1D5DB]" : "text-[#B0B8C5]"
                  )}
                >
                  {agent.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
