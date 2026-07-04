"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/about/SectionHeader";
import { ScrollReveal, ScrollRevealItem } from "@/components/about/ScrollReveal";
import {
  ABOUT_AGENTS,
  ABOUT_BENEFITS,
  ABOUT_FEATURES,
  ABOUT_METRICS,
  ABOUT_STACK,
} from "@/lib/about-content";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="console-page">
      <div className="mx-auto flex max-w-[900px] flex-col gap-16 px-6 py-12 md:gap-16 md:px-8 md:py-12">
        <ScrollReveal>
          <section className="flex flex-col items-start">
            <span className="inline-flex rounded-full border border-[#c3e4de] bg-[var(--teal-bg)] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--teal)]">
              AI Operations Hub
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-[var(--text)]">
              OpsIQ
            </h1>
            <p className="mt-4 max-w-[560px] text-xl leading-relaxed text-[var(--text-2)]">
              Turns your existing business documents into a 24/7 AI operations team — for
              less than the cost of one lunch per month.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <SectionHeader label="What it is" heading="Your entire business brain in one place" />
            <p className="mt-4 text-sm leading-[1.7] text-[var(--text-2)]">
              OpsIQ is an AI-powered Operations Hub that transforms a startup&apos;s scattered
              business documents into a 24/7 intelligent assistant. Upload your existing
              documents once — every employee gets instant, accurate answers to operational
              questions without searching, waiting, or asking a colleague.
            </p>
          </section>
        </ScrollReveal>

        <section>
          <ScrollReveal>
            <SectionHeader label="Agents" heading="5 Specialized AI Agents" className="mb-6" />
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {ABOUT_AGENTS.map((agent, index) => (
              <ScrollRevealItem key={agent.name} index={index}>
                <article className="console-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--teal)] hover:shadow-design-md">
                  <div
                    className={cn(
                      "agent-glyph agent-glyph-menu font-display font-semibold",
                      agent.glyphClass
                    )}
                  >
                    {agent.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{agent.name}</h3>
                  <p className="mt-2 text-[13px] leading-snug text-[var(--text-2)]">
                    {agent.description}
                  </p>
                </article>
              </ScrollRevealItem>
            ))}
          </div>
        </section>

        <section>
          <ScrollReveal>
            <SectionHeader label="Features" heading="Core Features" className="mb-6" />
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_FEATURES.map((feature, index) => (
              <ScrollRevealItem key={feature.title} index={index}>
                <article className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--card)] text-lg shadow-design-sm">
                    {feature.icon}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{feature.title}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-[var(--text-2)]">{feature.body}</p>
                </article>
              </ScrollRevealItem>
            ))}
          </div>
        </section>

        <ScrollReveal>
          <section>
            <SectionHeader label="Benefits" heading="Who Benefits" className="mb-6" />
            <div className="console-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="console-table-head">
                    <th className="px-5 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-2)]">
                      Who
                    </th>
                    <th className="px-5 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-2)]">
                      Benefit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ABOUT_BENEFITS.map(([who, benefit]) => (
                    <tr key={who} className="border-t border-[var(--line)]">
                      <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-[var(--text)] md:w-[200px]">
                        {who}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text-2)]">{benefit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </ScrollReveal>

        <section>
          <ScrollReveal>
            <SectionHeader label="Value" heading="The Numbers" className="mb-6" />
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-4">
            {ABOUT_METRICS.map((metric, index) => (
              <ScrollRevealItem key={metric.label} index={index}>
                <article className="console-card px-6 py-7 text-center">
                  <p className="font-display text-4xl font-bold text-gradient">{metric.number}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-[var(--text-2)]">{metric.label}</p>
                </article>
              </ScrollRevealItem>
            ))}
          </div>
        </section>

        <ScrollReveal>
          <section>
            <SectionHeader label="Stack" heading="Built With" className="mb-6" />
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
              {ABOUT_STACK.map((tech) => (
                <span
                  key={tech}
                  className="shrink-0 rounded-full border border-[var(--line)] bg-[var(--card)] px-3.5 py-1.5 font-mono text-[13px] text-[var(--text)] transition-all duration-150 hover:border-[var(--teal)] hover:bg-[var(--teal-bg)] hover:text-[var(--teal)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="rounded-[20px] bg-accent-gradient px-8 py-12 text-center md:px-12">
            <h2 className="font-display text-[28px] font-bold text-white">Start in minutes</h2>
            <p className="mt-2 text-base text-white/80">
              Upload your first document and ask your first question.
            </p>
            <Link
              href="/chat"
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-white px-7 py-3 text-[15px] font-semibold text-[var(--teal)] transition-all duration-150 hover:-translate-y-px hover:bg-white/90"
            >
              Go to Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
