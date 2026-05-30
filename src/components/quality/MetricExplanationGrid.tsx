import { METRIC_EXPLANATIONS } from "@/lib/ragas-quality";

export function MetricExplanationGrid() {
  return (
    <section>
      <h2 className="mb-6 font-display text-lg font-semibold text-[#0A0A0F]">
        Understanding Your AI Quality Scores
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {METRIC_EXPLANATIONS.map((item) => (
          <article
            key={item.heading}
            className="rounded-xl bg-[#F9FAFB] p-5"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-[#0A0A0F]">{item.heading}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6B7280]">{item.body}</p>
            <p className="mt-3 text-xs leading-relaxed text-[#9CA3AF]">{item.example}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
