import type { AgentId } from "@/types";
import { cn } from "@/lib/utils";

/** Wireframe duotone tokens — opsiq-enhanced-ui.html / OpsIQ Console.html */
export const AGENT_GLYPH_COLORS: Record<
  AgentId,
  { bg: string; fg: string; wireframeClass: string }
> = {
  internal: { bg: "#1F4E46", fg: "#7FD4C7", wireframeClass: "g-int" },
  support: { bg: "#2A3F63", fg: "#9BB8E8", wireframeClass: "g-sup" },
  report: { bg: "#4E3A1E", fg: "#E4C079", wireframeClass: "g-rep" },
  onboarding: { bg: "#3C2E52", fg: "#C1A8E8", wireframeClass: "g-onb" },
  contract: { bg: "#4E2A2A", fg: "#E09C9C", wireframeClass: "g-con" },
};

interface AgentGlyphProps {
  agentId: AgentId;
  label: string;
  size?: "menu" | "header" | "message";
  className?: string;
}

/** Agent prefix tile — matches wireframe `.glyph.g-*` */
export function AgentGlyph({ agentId, label, size = "menu", className }: AgentGlyphProps) {
  const colors = AGENT_GLYPH_COLORS[agentId];

  return (
    <span
      className={cn(
        "agent-glyph shrink-0 font-display font-semibold leading-none",
        colors.wireframeClass,
        size === "header"
          ? "agent-glyph-header"
          : size === "menu"
            ? "agent-glyph-menu"
            : "agent-glyph-message",
        className
      )}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
      aria-hidden
    >
      {label}
    </span>
  );
}
