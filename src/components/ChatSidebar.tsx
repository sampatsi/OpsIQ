"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarLogo } from "@/components/SidebarLogo";
import { SidebarNav } from "@/components/SidebarNav";
import { LiveBackendBadge } from "@/components/LiveBackendBadge";
import { AgentSelector } from "@/components/AgentSelector";
import { FileUpload } from "@/components/FileUpload";
import type { AgentId } from "@/types";

interface ChatSidebarProps {
  selectedAgent: AgentId;
  onSelectAgent: (id: AgentId) => void;
}

export function ChatSidebar({ selectedAgent, onSelectAgent }: ChatSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <SidebarLogo />
      <SidebarNav onNavigate={() => setMobileOpen(false)} className="mt-1" />
      <div className="mt-4 flex-1 overflow-y-auto px-3 pb-2">
        <AgentSelector selected={selectedAgent} onSelect={onSelectAgent} />
      </div>
      <div className="shrink-0 border-t border-[var(--border-sidebar)] p-3">
        <FileUpload compact variant="sidebar" />
      </div>
      <LiveBackendBadge />
    </>
  );

  return (
    <>
      <header className="flex h-14 items-center justify-between bg-sidebar-surface px-4 shadow-design-md md:hidden">
        <span className="font-display text-lg font-bold text-white">OpsIQ</span>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#E5E7EB] hover:bg-[var(--bg-sidebar-hover)]"
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-sidebar-surface shadow-design-md transition-transform duration-200 md:static md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0 top-14 h-[calc(100%-3.5rem)]" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
}
