"use client";

import Link from "next/link";
import { RotateCcw, Settings } from "lucide-react";
import { ConsoleHeader } from "@/components/ConsoleHeader";
import { AgentGlyph, AGENT_GLYPH_COLORS } from "@/components/AgentGlyph";
import { GuardrailStatusChip, ModelChip } from "@/components/GuardrailStatusChip";
import { AGENT_GLYPH, GATED_AGENTS } from "@/lib/agents";
import type { AgentConfig, PlatformConfig } from "@/types";

interface AgentChatHeaderProps {
  agent: AgentConfig;
  sessionId: string;
  platformConfig: PlatformConfig | null | undefined;
  onNewSession: () => void;
}

export function AgentChatHeader({
  agent,
  sessionId,
  platformConfig,
  onNewSession,
}: AgentChatHeaderProps) {
  const colors = AGENT_GLYPH_COLORS[agent.id];
  const isGated = GATED_AGENTS.includes(agent.id);

  return (
    <ConsoleHeader
      accentColor={colors.fg}
      washColor={colors.bg}
      className="console-header"
      data-agent={agent.id}
      icon={
        <AgentGlyph
          agentId={agent.id}
          label={AGENT_GLYPH[agent.id]}
          size="header"
          className="shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]"
        />
      }
      title={
        <>
          <h2 className="truncate font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
            {agent.name} Agent
          </h2>
          {isGated && (
            <span
              className="agent-gate shrink-0"
              title="Human approval required before output ships"
            >
              GATED
            </span>
          )}
        </>
      }
      subtitle={
        agent.tagline ? (
          <p className="truncate text-[0.78rem] leading-snug text-[var(--text-2)]">
            {agent.tagline}
          </p>
        ) : undefined
      }
      trailing={
        <>
          <div className="flex shrink-0 items-center gap-2">
            <GuardrailStatusChip guardrails={platformConfig?.guardrails} />
            <ModelChip model={platformConfig?.models.llmModel} />
          </div>

          <span className="hidden rounded-md border border-[var(--line)] bg-[var(--paper)] px-2 py-1 font-mono text-[0.64rem] text-[var(--text-2)] lg:inline">
            {sessionId.slice(0, 12)}…
          </span>

          <Link
            href="/settings"
            title="RAG Settings"
            className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-[var(--line)] bg-[var(--paper)] text-[var(--text-2)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
            aria-label="RAG Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={onNewSession}
            className="inline-flex items-center gap-1.5 rounded-[9px] border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[12px] text-[var(--text-2)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="max-[640px]:hidden">New session</span>
          </button>
        </>
      }
    />
  );
}
