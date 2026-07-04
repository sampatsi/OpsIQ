export function QualityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-8 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        📊
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold text-[var(--text)]">
        No Saved Evaluations
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-2)]">
        No RAGAS results are stored yet, or the database is unavailable. This dashboard
        only reads existing scores — it does not run evaluations or use API tokens.
      </p>
      <p className="mt-4 font-mono text-xs text-[var(--text-2)]">
        Start PostgreSQL and the FastAPI backend to load saved results from{" "}
        <code className="rounded bg-[var(--paper)] px-1">ragas_history</code>.
      </p>
    </div>
  );
}
