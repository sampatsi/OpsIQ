"use client";

import { cn } from "@/lib/utils";
import type { AnalyticsBarItem } from "@/types";

const BAR_COLORS = [
  "bg-[var(--teal)]",
  "bg-[var(--amber)]",
  "bg-[#5b8fd4]",
  "bg-[var(--ink)]",
  "bg-[#e05a6e]",
  "bg-[#8b6fd4]",
];

interface AnalyticsBarChartProps {
  title: string;
  items: AnalyticsBarItem[];
  className?: string;
  emptyMessage?: string;
}

export function AnalyticsBarChart({
  title,
  items,
  className,
  emptyMessage = "No data yet — run queries to populate analytics.",
}: AnalyticsBarChartProps) {
  return (
    <section className={cn("console-card p-[18px]", className)}>
      <h3 className="mb-3.5 text-[12px] font-semibold text-[var(--text-2)]">{title}</h3>
      {items.length === 0 ? (
        <p className="text-[12px] text-[var(--text-2)]">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="min-w-[88px] truncate text-[11px] text-[var(--text-2)] sm:min-w-[100px]">
                {item.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", BAR_COLORS[index % BAR_COLORS.length])}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
              <span className="min-w-[34px] text-right font-mono text-[10px] text-[var(--text-2)]">
                {item.display}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
