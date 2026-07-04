"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { OpsIQLogo } from "@/components/OpsIQLogo";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  {
    href: "/chat",
    label: "Chat",
    desc: "Agent conversations",
    icon: MessageSquare,
    primary: true,
  },
  {
    href: "/knowledge-base",
    label: "Knowledge Base",
    desc: "Documents & upload",
    icon: BookOpen,
  },
  {
    href: "/sessions",
    label: "Sessions",
    desc: "Conversation history",
    icon: Clock,
  },
  {
    href: "/quality",
    label: "AI Quality",
    desc: "RAGAS dashboard",
    icon: Sparkles,
  },
  {
    href: "/settings",
    label: "RAG Settings",
    desc: "Chunking · retrieval · guardrails",
    icon: Settings,
  },
] as const;

export default function HomePage() {
  const { data: analytics, isLoading } = useAnalytics();

  const topAgents = analytics?.queryVolumeByAgent.filter((a) => a.value > 0).slice(0, 3) ?? [];
  const quality = analytics?.qualityScores ?? [];

  return (
    <div className="console-page">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8 md:py-12">
        <div className="mb-10">
          <OpsIQLogo size={72} loop={false} variant="light" className="mb-6" />
          <span className="inline-flex rounded-full border border-[#c3e4de] bg-[var(--teal-bg)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--teal)]">
            OpsIQ Console
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--text)] md:text-4xl">
            Knowledge Intelligence Platform
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-2)]">
            Query your documents with guarded agents, track quality live, and monitor platform
            health from one place.
          </p>
        </div>

        <Link
          href="/analytics"
          className="group mb-8 block overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-design-md transition-shadow hover:shadow-design-lg"
        >
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--teal-bg)] text-[var(--teal)]">
              <BarChart3 className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-[var(--text)]">
                  Analytics Dashboard
                </h2>
                <span className="rounded-md bg-[var(--teal-bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--teal)]">
                  Featured
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-2)]">
                Query volume by agent, output quality scores, knowledge coverage, and recent
                queries.
              </p>
              {!isLoading && analytics && (
                <div className="mt-4 flex flex-wrap gap-4 font-mono text-[11px] text-[var(--text-2)]">
                  {quality.slice(0, 3).map((q) => (
                    <span key={q.label}>
                      {q.label}: <b className="text-[var(--text)]">{q.percent}%</b>
                    </span>
                  ))}
                  {topAgents.length > 0 && (
                    <span>
                      Top agent: <b className="text-[var(--text)]">{topAgents[0].label}</b>
                    </span>
                  )}
                </div>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--teal)] transition-all group-hover:gap-2.5">
              Open analytics
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </Link>

        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-2)]">
          Quick access
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((item) => {
            const { href, label, desc, icon: Icon } = item;
            const primary = "primary" in item && item.primary;
            return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4 transition-colors",
                primary
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--text-inv)] hover:bg-[var(--ink-2)]"
                  : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--teal)]/40"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  primary
                    ? "bg-[var(--ink-2)] text-[var(--teal)]"
                    : "bg-[var(--paper)] text-[var(--teal)]"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs",
                    primary ? "text-[var(--text-inv-2)]" : "text-[var(--text-2)]"
                  )}
                >
                  {desc}
                </span>
              </span>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
