import { METRIC_EXPLANATIONS } from "@/lib/ragas-quality";

export function MetricExplanationGrid() {
  return (
    <section>
      <h2 className="mb-6 font-display text-lg font-semibold text-[var(--text)]">
        Understanding Your AI Quality Scores
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {METRIC_EXPLANATIONS.map((item) => (
          <article
            key={item.heading}
            className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-[var(--text)]">{item.heading}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-2)]">{item.body}</p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-[var(--text-2)]">
              {item.example}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
