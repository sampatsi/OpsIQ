"use client";

import { Network } from "lucide-react";
import { KnowledgeGraphView } from "@/components/architecture/KnowledgeGraphView";
import { PageHeader } from "@/components/PageHeader";

export default function ArchitecturePage() {
  return (
    <div className="console-page flex min-h-0 flex-1 flex-col">
      <PageHeader
        icon={Network}
        title="Architecture"
        description="End-to-end flow from this console through FastAPI, guardrails, LangGraph agents, RAG retrieval, and back to the chat UI."
        meta="Public in console for now — wire auth on this route later."
        sticky={false}
      />
      <KnowledgeGraphView />
    </div>
  );
}
