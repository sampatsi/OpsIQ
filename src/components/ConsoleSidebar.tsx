"use client";

import { cn } from "@/lib/utils";
import { SidebarLogo } from "@/components/SidebarLogo";
import { AgentSelector } from "@/components/AgentSelector";
import { SidebarQualityStrip } from "@/components/SidebarQualityStrip";
import { ChatRailNav } from "@/components/ChatRailNav";
import type { AgentId } from "@/types";

interface ConsoleSidebarProps {
  selectedAgent: AgentId;
  onSelectAgent: (id: AgentId) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

/** Shared dark rail — logo, agents, console nav, live quality (all pages). */
export function ConsoleSidebar({
  selectedAgent,
  onSelectAgent,
  mobileOpen = false,
  onMobileOpenChange,
}: ConsoleSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[290px] shrink-0 flex-col bg-[var(--ink)] text-[var(--text-inv)] transition-transform duration-300 max-[820px]:z-40 md:static md:h-screen md:translate-x-0",
          mobileOpen
            ? "translate-x-0 top-14 h-[calc(100%-3.5rem)] shadow-[0_0_60px_rgba(0,0,0,0.4)]"
            : "-translate-x-full pointer-events-none max-[820px]:-translate-x-full md:pointer-events-auto md:translate-x-0"
        )}
        id="opsiq-rail"
      >
        <SidebarLogo />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <AgentSelector selected={selectedAgent} onSelect={onSelectAgent} />
        </div>
        <ChatRailNav onNavigate={() => onMobileOpenChange?.(false)} />
        <SidebarQualityStrip />
      </aside>

      {mobileOpen && onMobileOpenChange && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 max-[820px]:block md:hidden"
          onClick={() => onMobileOpenChange(false)}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
