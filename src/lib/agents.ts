import type { AgentConfig, AgentId } from "@/types";

export const AGENTS: AgentConfig[] = [
  {
    id: "internal",
    name: "Internal",
    description: "Internal ops, policies, and team knowledge",
    icon: "Building2",
  },
  {
    id: "support",
    name: "Support",
    description: "Customer support and ticket assistance",
    icon: "Headphones",
  },
  {
    id: "report",
    name: "Report",
    description: "Generate reports and analytics summaries",
    icon: "FileBarChart",
  },
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Employee onboarding and training guides",
    icon: "UserPlus",
  },
  {
    id: "contract",
    name: "Contract",
    description: "Contract review and compliance checks",
    icon: "FileSignature",
  },
];

export const AGENT_GRADIENT_CLASS: Record<AgentId, string> = {
  internal: "agent-gradient-internal",
  support: "agent-gradient-support",
  report: "agent-gradient-report",
  onboarding: "agent-gradient-onboarding",
  contract: "agent-gradient-contract",
};

export function getAgentByName(name?: string) {
  if (!name) return AGENTS[0];
  return AGENTS.find((a) => a.name === name) ?? AGENTS[0];
}
