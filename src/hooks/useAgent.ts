"use client";

import { useCallback, useState } from "react";
import type { AgentId } from "@/types";
import { AGENTS } from "@/lib/agents";

export function useAgent(initial: AgentId = "internal") {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(initial);

  const agent = AGENTS.find((a) => a.id === selectedAgent) ?? AGENTS[0];

  const selectAgent = useCallback((id: AgentId) => {
    setSelectedAgent(id);
  }, []);

  const context = {
    agent: selectedAgent,
    agent_name: agent.name,
  };

  return { selectedAgent, agent, selectAgent, context };
}
