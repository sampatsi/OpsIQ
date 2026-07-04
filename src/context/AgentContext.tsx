"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAgent as useAgentState } from "@/hooks/useAgent";
import type { AgentId } from "@/types";
import type { AgentConfig } from "@/types";

interface AgentContextValue {
  selectedAgent: AgentId;
  agent: AgentConfig;
  agents: AgentConfig[];
  selectAgent: (id: AgentId) => void;
  context: { agent: AgentId; agent_name: string };
}

const AgentContext = createContext<AgentContextValue | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const value = useAgentState();
  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent(): AgentContextValue {
  const ctx = useContext(AgentContext);
  if (!ctx) {
    throw new Error("useAgent must be used within AgentProvider");
  }
  return ctx;
}
