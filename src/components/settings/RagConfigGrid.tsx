"use client";

import { Loader2 } from "lucide-react";
import type { PlatformConfig } from "@/types";
import { cn } from "@/lib/utils";

function ConfigToggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full border border-[var(--line)]",
        on ? "bg-[var(--teal)]" : "bg-[var(--paper)]"
      )}
      aria-hidden
    >
      <span
        className={cn(
          "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-[left]",
          on ? "left-[18px]" : "left-0.5"
        )}
      />
    </span>
  );
}

function ConfigRow({
  label,
  value,
  toggle,
}: {
  label: string;
  value?: string | number;
  toggle?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <span className="flex-1 text-[12px] text-[var(--text-2)]">{label}</span>
      {toggle !== undefined ? (
        <ConfigToggle on={toggle} />
      ) : (
        <span className="font-mono text-[11px] text-[var(--teal)]">{value}</span>
      )}
    </div>
  );
}

function ConfigCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="console-card p-[18px]">
      <h3 className="mb-3.5 text-[12px] font-semibold text-[var(--text-2)]">{title}</h3>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function formatRateLimit(limit: string): string {
  return limit.replace("/minute", "/min").replace("/hour", "/hr");
}

interface RagConfigGridProps {
  config: PlatformConfig | null;
  isLoading?: boolean;
}

export function RagConfigGrid({ config, isLoading }: RagConfigGridProps) {
  if (isLoading && !config) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--text-2)]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-[var(--teal)]" />
        Loading configuration…
      </div>
    );
  }

  if (!config) {
    return (
      <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-6 text-sm text-[var(--text-2)]">
        Could not load platform configuration. Ensure the API is running at{" "}
        <code className="font-mono text-xs">localhost:8000</code>.
      </p>
    );
  }

  const { chunking, retrieval, guardrails, models } = config;
  const thresholdPct = Math.round(guardrails.confidenceThreshold * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ConfigCard title="📦 Chunking Strategy">
        <ConfigRow label="Strategy" value={chunking.strategyLabel} />
        <ConfigRow label="Chunk size (tokens)" value={chunking.chunkSize} />
        <ConfigRow label="Overlap (tokens)" value={chunking.overlap} />
        <ConfigRow label="Min chunk size" value={chunking.minChunkSize} />
        <ConfigRow label="Metadata injection" toggle={chunking.metadataInjection} />
      </ConfigCard>

      <ConfigCard title="🔍 Retrieval Strategy">
        <ConfigRow label="Algorithm" value={retrieval.algorithmLabel} />
        <ConfigRow label="Top-K chunks" value={retrieval.topK} />
        <ConfigRow label="Candidate pool" value={retrieval.candidates} />
        <ConfigRow label="Re-ranking (cross-encoder)" toggle={retrieval.rerankEnabled} />
        <ConfigRow label="Rerank model" value={retrieval.rerankModel} />
        <ConfigRow label="Query decomposition" toggle={retrieval.queryDecomposition} />
        <ConfigRow label="HyDE (hypothetical doc)" toggle={retrieval.hydeEnabled} />
        <ConfigRow
          label="Hybrid weights"
          value={`${Math.round(retrieval.semanticWeight * 100)}% dense / ${Math.round(retrieval.bm25Weight * 100)}% BM25`}
        />
      </ConfigCard>

      <ConfigCard title="🛡️ Guardrails">
        <ConfigRow label="NeMo guardrails" toggle={guardrails.nemoEnabled} />
        <ConfigRow label="Input: PII detection" toggle={guardrails.piiDetection} />
        <ConfigRow label="Input: Injection filter" toggle={guardrails.injectionFilter} />
        <ConfigRow label="Input: Scope enforcement" toggle={guardrails.scopeEnforcement} />
        <ConfigRow label="Output: Faithfulness gate" toggle={guardrails.faithfulnessGate} />
        <ConfigRow label="Output: Citation required" toggle={guardrails.citationRequired} />
        <ConfigRow label="Output: Confidence threshold" value={`${thresholdPct}%`} />
        <ConfigRow label="Retry on low confidence" toggle={guardrails.retryOnLowConfidence} />
        <ConfigRow label="Max query length" value={`${guardrails.maxQueryChars} chars`} />
        <ConfigRow label="Chat rate limit" value={formatRateLimit(guardrails.chatRateLimit)} />
      </ConfigCard>

      <ConfigCard title="🤖 Agents & Models">
        <ConfigRow label="LLM provider" value={models.llmProvider} />
        <ConfigRow label="LLM model" value={models.llmModel} />
        <ConfigRow label="Embedding model" value={models.embeddingModel} />
        <ConfigRow label="Embedding dimensions" value={models.embeddingDimensions} />
        <ConfigRow
          label="Max context tokens"
          value={
            models.maxContextTokens >= 1000
              ? `${Math.round(models.maxContextTokens / 1000)}K`
              : models.maxContextTokens
          }
        />
        <ConfigRow label="Temperature" value={models.temperature} />
        <ConfigRow label="Self-learning" toggle={models.selfLearningEnabled} />
      </ConfigCard>
    </div>
  );
}
