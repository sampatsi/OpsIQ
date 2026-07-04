"use client";

import type { AnalyticsQualityRing } from "@/types";

const RING_COLORS = ["#1a8a7a", "#5b8fd4", "#c9a227"];
const CIRCUMFERENCE = 163.4;

interface QualityRingGridProps {
  title: string;
  rings: AnalyticsQualityRing[];
}

function QualityRing({ percent, color }: { percent: number; color: string }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(percent, 100) / 100);
  return (
    <div className="relative mx-auto h-16 w-16">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[13px] font-semibold text-[var(--text)]">
        {percent}%
      </span>
    </div>
  );
}

export function QualityRingGrid({ title, rings }: QualityRingGridProps) {
  return (
    <section className="console-card p-[18px]">
      <h3 className="mb-3.5 text-[12px] font-semibold text-[var(--text-2)]">{title}</h3>
      {rings.length === 0 ? (
        <p className="text-[12px] text-[var(--text-2)]">No quality samples yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {rings.map((ring, index) => (
            <div key={ring.label} className="text-center">
              <QualityRing percent={ring.percent} color={RING_COLORS[index % RING_COLORS.length]} />
              <p className="mt-1.5 text-[10px] text-[var(--text-2)]">{ring.label}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
