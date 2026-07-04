export function ScoreCardSkeleton() {
  return (
    <div className="console-card animate-pulse p-7">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[var(--line)]" />
        <div className="h-4 w-24 rounded bg-[var(--line)]" />
      </div>
      <div className="mt-4 h-12 w-20 rounded bg-[var(--line)]" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-28 rounded bg-[var(--paper)]" />
        <div className="h-1.5 w-full rounded-full bg-[var(--paper)]" />
        <div className="h-5 w-16 rounded-full bg-[var(--paper)]" />
      </div>
    </div>
  );
}
