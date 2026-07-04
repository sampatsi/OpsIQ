"use client";

import { GuardrailStatusChip, ModelChip } from "@/components/GuardrailStatusChip";
import { PageHeader } from "@/components/PageHeader";
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
            backend. Update values in <code className="font-mono text-xs">opsiq/.env</code> and
            restart the API to apply changes.
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
      </div>
    </div>
  );
}
