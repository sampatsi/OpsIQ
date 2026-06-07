export function QualityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-8 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        📊
      </span>
      <h2 className="mt-5 font-display text-xl font-semibold text-[#0A0A0F]">
        No Saved Evaluations
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6B7280]">
        No RAGAS results are stored yet, or the database is unavailable. This dashboard
        only reads existing scores — it does not run evaluations or use API tokens.
      </p>
      <p className="mt-4 text-xs text-[#9CA3AF]">
        Start PostgreSQL and the FastAPI backend to load saved results from{" "}
        <code className="rounded bg-[#F3F4F6] px-1">ragas_history</code>.
      </p>
    </div>
  );
}
