import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({ label, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white p-6 shadow-design-sm transition-shadow hover:shadow-design-md",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-gradient shadow-design-sm">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        </div>
      </div>
    </div>
  );
}
