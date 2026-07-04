import type { AgentConfig, AgentId } from "@/types";

export const AGENTS: AgentConfig[] = [
  {
    id: "internal",
    name: "Internal",
    description: "Policies & team knowledge",
    tagline: "Your policies and procedures — answered in seconds.",
    icon: "Building2",
  },
  {
    id: "support",
    name: "Support",
    description: "Tickets & customer answers",
    tagline: "Resolve customer questions with cited, grounded answers.",
    icon: "Headphones",
  },
  {
    id: "report",
    name: "Report",
    description: "Analytics summaries",
    tagline: "Draft executive summaries — you approve before they ship.",
    icon: "FileBarChart",
  },
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Training & ramp guides",
    tagline: "Get new hires productive without digging through docs.",
    icon: "UserPlus",
  },
  {
    id: "contract",
    name: "Contract",
    description: "Review & compliance",
    tagline: "Flag risky clauses against policy — human sign-off required.",
    icon: "FileSignature",
  },
];

export const AGENT_GLYPH: Record<AgentId, string> = {
  internal: "IN",
  support: "SU",
  report: "RE",
  onboarding: "ON",
  contract: "CO",
};

export const AGENT_GLYPH_CLASS: Record<AgentId, string> = {
  internal: "g-int",
  support: "g-sup",
  report: "g-rep",
  onboarding: "g-onb",
  contract: "g-con",
};

/** @deprecated Use AGENT_GLYPH_CLASS / AgentGlyph */
export const AGENT_GRADIENT_CLASS: Record<AgentId, string> = {
  internal: "g-int",
  support: "g-sup",
  report: "g-rep",
  onboarding: "g-onb",
  contract: "g-con",
};

export const GATED_AGENTS: AgentId[] = ["report", "contract"];

export function getAgentTagline(agentId: AgentId): string {
  return AGENTS.find((a) => a.id === agentId)?.tagline ?? "";
}

export function getAgentByName(name?: string) {
  if (!name) return AGENTS[0];
  const match = AGENTS.find((a) => a.name === name);
  if (!match) {
    console.warn(`Unknown agent name: ${name}`);
    return {
      id: "internal" as AgentId,
      name: "Agent",
      description: "",
      tagline: "",
      icon: "Building2",
    };
  }
  return match;
}

export function getAgentById(id: AgentId) {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}
