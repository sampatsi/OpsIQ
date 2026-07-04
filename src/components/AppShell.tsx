"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { ConsoleSidebar } from "@/components/ConsoleSidebar";
import { OpsIQLogo } from "@/components/OpsIQLogo";
import { AgentProvider, useAgent } from "@/context/AgentContext";
import type { AgentId } from "@/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </AgentProvider>
  );
}

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedAgent, selectAgent } = useAgent();

  const handleSelectAgent = useCallback(
    (id: AgentId) => {
      selectAgent(id);
      if (pathname !== "/chat") {
        router.push("/chat");
      }
    },
    [pathname, router, selectAgent]
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line-ink)] bg-[var(--ink)] px-4 max-[820px]:flex md:hidden">
        <Link href="/" aria-label="OpsIQ home">
          <OpsIQLogo markOnly size={30} loop variant="dark" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-[var(--line-ink)] bg-[var(--ink-2)] text-[var(--text-inv)]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <ConsoleSidebar
        selectedAgent={selectedAgent}
        onSelectAgent={handleSelectAgent}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <main
        className={cn(
          "flex min-h-0 min-h-screen flex-1 flex-col overflow-hidden bg-[var(--paper)]",
          pathname === "/chat" && "max-[820px]:min-h-[calc(100dvh-3.5rem)]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
