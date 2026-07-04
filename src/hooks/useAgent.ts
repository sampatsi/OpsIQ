"use client";

import { useCallback, useState } from "react";
import type { AgentId } from "@/types";
import { useAgents } from "@/hooks/useAgents";

const STORAGE_KEY = "opsiq_selected_agent";

function readStoredAgent(): AgentId {
  if (typeof window === "undefined") return "internal";
  const stored = localStorage.getItem(STORAGE_KEY);
  const ids: AgentId[] = ["internal", "support", "report", "onboarding", "contract"];
  return ids.includes(stored as AgentId) ? (stored as AgentId) : "internal";
}

export function useAgent() {
  const { agents } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(readStoredAgent);

  const agent = agents.find((a) => a.id === selectedAgent) ?? agents[0];

  const selectAgent = useCallback((id: AgentId) => {
    setSelectedAgent(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const context = {
    agent: selectedAgent,
    agent_name: agent.name,
  };

  return { selectedAgent, agent, agents, selectAgent, context };
}
