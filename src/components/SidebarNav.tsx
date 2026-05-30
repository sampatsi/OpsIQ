"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Database, History, Info, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/knowledge-base", label: "Knowledge Base", icon: Database },
  { href: "/sessions", label: "Sessions", icon: History },
  { href: "/about", label: "About", icon: Info },
  { href: "/quality", label: "AI Quality", icon: Sparkles },
];

interface SidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({ onNavigate, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-0.5 px-3", className)}>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-150",
              active
                ? "border-l-2 border-[var(--accent-primary)] bg-[var(--bg-sidebar-active)] font-medium text-white"
                : "border-l-2 border-transparent text-[#9CA3AF] hover:bg-[var(--bg-sidebar-hover)] hover:text-[#E5E7EB]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
