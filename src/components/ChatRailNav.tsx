"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CircleHelp,
  Clock,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/knowledge-base", label: "Knowledge", icon: BookOpen },
  { href: "/sessions", label: "Sessions", icon: Clock },
  { href: "/quality", label: "AI Quality", icon: Sparkles },
  { href: "/settings", label: "RAG Settings", icon: Settings },
  { href: "/about", label: "About", icon: CircleHelp },
] as const;

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ChatRailNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="border-t border-[var(--line-ink)] px-3 py-3" aria-label="Console navigation">
      <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-inv-2)]">
        Console
      </p>
      <div className="grid grid-cols-2 gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "bg-[var(--ink-2)] text-[var(--text-inv)] shadow-[inset_2px_0_0_var(--teal)]"
                  : "text-[var(--text-inv-2)] hover:bg-[var(--ink-2)] hover:text-[var(--text-inv)]"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
