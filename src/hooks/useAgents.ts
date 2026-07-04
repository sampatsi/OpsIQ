"use client";

import { useCallback, useEffect, useState } from "react";
import type { AgentConfig, AgentId } from "@/types";
import { getAgents } from "@/lib/api";
import { AGENTS, GATED_AGENTS } from "@/lib/agents";

const ICON_BY_ID: Record<AgentId, string> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a.icon])
) as Record<AgentId, string>;

function mergeAgents(
  remote: Awaited<ReturnType<typeof getAgents>>["agents"]
): AgentConfig[] {
  return remote.map((r) => {
    const local = AGENTS.find((a) => a.id === r.id);
    return {
      id: r.id as AgentId,
      name: r.name,
      description: local?.description ?? r.description,
      tagline: local?.tagline ?? r.description,
      icon: ICON_BY_ID[r.id as AgentId] ?? "Building2",
      gated: r.gated,
      chunkCount: r.indexStats.chunkCount,
      sourceDomains: r.indexStats.sourceDomains,
    };
  });
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentConfig[]>(AGENTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getAgents();
      if (data.agents?.length) setAgents(mergeAgents(data.agents));
    } catch {
      setAgents(AGENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getAgents();
        if (cancelled) return;
        if (data.agents?.length) setAgents(mergeAgents(data.agents));
      } catch {
        if (!cancelled) setAgents(AGENTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { agents, loading, refresh, gatedAgents: GATED_AGENTS };
}
