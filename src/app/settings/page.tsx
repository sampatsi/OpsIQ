"use client";

import { GuardrailStatusChip, ModelChip } from "@/components/GuardrailStatusChip";
import { PageHeader } from "@/components/PageHeader";
import { ApiEndpointsTable } from "@/components/settings/ApiEndpointsTable";
import { RagConfigGrid } from "@/components/settings/RagConfigGrid";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const { config, isLoading } = usePlatformConfig();

  return (
    <div className="console-page">
      <PageHeader
        icon={Settings}
        title="RAG Settings"
        description={
          <>
            Chunking, retrieval, guardrails, and model configuration — read from the live
            backend via <code className="font-mono text-xs">GET /config</code>. Update values in{" "}
            <code className="font-mono text-xs">opsiq-service/.env</code> and restart the API
            to apply changes.
          </>
        }
        chips={
          <>
            <GuardrailStatusChip guardrails={config?.guardrails} isLoading={isLoading} />
            <ModelChip model={config?.models.llmModel} className="inline" />
          </>
        }
      />

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8 md:px-8">
        <RagConfigGrid config={config} isLoading={isLoading} />

        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
            Platform API Endpoints
          </h2>
          <p className="text-sm text-[var(--text-2)]">
            UI-facing routes under <code className="font-mono text-xs">/api/v1</code>. Interactive
            docs at{" "}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--teal)] hover:underline"
            >
              localhost:8000/docs
            </a>
            .
          </p>
          <ApiEndpointsTable filter="platform" />
        </section>
      </div>
    </div>
  );
}
