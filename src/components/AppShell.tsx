"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarLogo } from "@/components/SidebarLogo";
import { SidebarNav } from "@/components/SidebarNav";
import { LiveBackendBadge } from "@/components/LiveBackendBadge";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isChat = pathname === "/chat";

  if (isChat) {
    return <main className="flex min-h-0 min-h-screen flex-1 flex-col">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex h-14 items-center justify-between bg-sidebar-surface px-4 shadow-design-md md:hidden">
        <SidebarLogo />
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#E5E7EB] transition-colors hover:bg-[var(--bg-sidebar-hover)]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-sidebar-surface shadow-design-md transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarLogo />
        <SidebarNav onNavigate={() => setMobileOpen(false)} className="mt-2" />
        <div className="mt-auto">
          <LiveBackendBadge />
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <main className="flex min-h-0 min-h-screen flex-1 flex-col bg-[var(--bg-main)]">
        {children}
      </main>
    </div>
  );
}
