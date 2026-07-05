"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AgentId } from "@/types";
import { useAgents } from "@/hooks/useAgents";

const STORAGE_KEY = "opsiq_selected_agent";
const DEFAULT_AGENT: AgentId = "internal";

const agentListeners = new Set<() => void>();

function emitAgentChange() {
  agentListeners.forEach((listener) => listener());
}

function subscribeAgent(listener: () => void) {
  agentListeners.add(listener);
  return () => agentListeners.delete(listener);
}

function readStoredAgent(): AgentId {
  const stored = localStorage.getItem(STORAGE_KEY);
  const ids: AgentId[] = ["internal", "support", "report", "onboarding", "contract"];
  return ids.includes(stored as AgentId) ? (stored as AgentId) : DEFAULT_AGENT;
}

function getAgentSnapshot(): AgentId {
  return readStoredAgent();
}

function getServerAgentSnapshot(): AgentId {
  return DEFAULT_AGENT;
}

export function useAgent() {
  const { agents } = useAgents();
  const selectedAgent = useSyncExternalStore(
    subscribeAgent,
    getAgentSnapshot,
    getServerAgentSnapshot
  );

  const agent = agents.find((a) => a.id === selectedAgent) ?? agents[0];

  const selectAgent = useCallback((id: AgentId) => {
    localStorage.setItem(STORAGE_KEY, id);
    emitAgentChange();
  }, []);

  const context = {
    agent: selectedAgent,
    agent_name: agent.name,
  };

  return { selectedAgent, agent, agents, selectAgent, context };
}
