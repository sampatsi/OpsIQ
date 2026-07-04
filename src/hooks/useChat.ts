"use client";

import { useCallback, useState } from "react";
import type { AgentId, ChatMessage, ChatResponse, SourceCitation } from "@/types";
import { FAITHFULNESS_GATE } from "@/types";
import { sendChat } from "@/lib/api";
import { AGENTS } from "@/lib/agents";

function createId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatAgentLabel(agentUsed?: string, fallback?: string): string {
  if (!agentUsed || agentUsed === "guardrails") return fallback ?? "Agent";
  const byId = AGENTS.find((a) => a.id === agentUsed);
  if (byId) return byId.name;
  const byName = AGENTS.find((a) => a.name.toLowerCase() === agentUsed.toLowerCase());
  return byName?.name ?? fallback ?? agentUsed;
}

function mapChatResponse(
  data: ChatResponse,
  agentName: string
): ChatMessage | null {
  if (data.status === "awaiting_approval" && data.thread_id && data.draft) {
    return null;
  }

  const guardrail = data.guardrail;
  const grounding = data.grounding;
  const label = formatAgentLabel(data.agent_used, agentName);

  if (guardrail?.status === "blocked") {
    return {
      id: createId(),
      role: "assistant",
      content: guardrail.message ?? data.answer ?? "Request blocked by guardrails.",
      agentName: "Guardrails",
      guardrail: {
        ...guardrail,
        audit_id: guardrail.audit_id ?? data.guardrail?.audit_id,
        restricted_fields:
          guardrail.restricted_fields ?? data.guardrail?.restricted_fields,
      },
      timestamp: new Date(),
    };
  }

  if (guardrail?.status === "held") {
    const score = grounding?.faithfulness;
    const heldMessage =
      guardrail.message ??
      (score != null
        ? `Answer held — grounding score ${score.toFixed(2)} was below the ${FAITHFULNESS_GATE.toFixed(2)} threshold. Try narrowing the question or uploading the source document.`
        : "Answer held for review — grounding score was below threshold.");
    return {
      id: createId(),
      role: "assistant",
      content: heldMessage,
      agentName: label,
      guardrail,
      grounding,
      sources: data.sources,
      timestamp: new Date(),
    };
  }

  const content = data.answer?.trim();
  if (!content) return null;

  return {
    id: createId(),
    role: "assistant",
    content,
    agentName: label,
    sources: data.sources,
    grounding,
    guardrail: guardrail?.status ? guardrail : undefined,
    timestamp: new Date(),
  };
}

interface UseChatOptions {
  sessionId: string;
  agentId: AgentId;
  onAwaitingApproval?: (threadId: string, draft: string) => void;
}

export function useChat({
  sessionId,
  agentId,
  onAwaitingApproval,
}: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);

  const agentName = AGENTS.find((a) => a.id === agentId)?.name ?? "Agent";

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || !sessionId) return;

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: query.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setStreamingContent("Thinking…");

      try {
        const data = await sendChat({
          query: query.trim(),
          session_id: sessionId,
          context: { agent: agentId },
        });

        if (data.status === "awaiting_approval" && data.thread_id && data.draft) {
          onAwaitingApproval?.(data.thread_id, data.draft);
          setStreamingContent(null);
          setIsLoading(false);
          return;
        }

        const assistantMessage = mapChatResponse(data, agentName);
        setStreamingContent(null);
        if (assistantMessage) {
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send message";
        setError(message);
        setStreamingContent(null);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, agentId, agentName, onAwaitingApproval]
  );

  const addAssistantMessage = useCallback(
    (content: string, sources?: SourceCitation[], grounding?: ChatMessage["grounding"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content,
          agentName,
          sources,
          grounding,
          timestamp: new Date(),
        },
      ]);
    },
    [agentName]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setStreamingContent(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    streamingContent,
    sendMessage,
    addAssistantMessage,
    clearMessages,
  };
}
