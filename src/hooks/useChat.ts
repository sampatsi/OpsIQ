"use client";

import { useCallback, useState } from "react";
import type { AgentId, ChatMessage, SourceCitation } from "@/types";
import { sendChat } from "@/lib/api";
import { AGENTS } from "@/lib/agents";

function createId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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
      setStreamingContent("Thinking...");

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

        const content =
          data.answer ?? data.response ?? data.message ?? "No response received.";
        const assistantMessage: ChatMessage = {
          id: createId(),
          role: "assistant",
          content,
          agentName,
          sources: data.sources,
          timestamp: new Date(),
        };

        setStreamingContent(null);
        setMessages((prev) => [...prev, assistantMessage]);
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
    (content: string, sources?: SourceCitation[]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content,
          agentName,
          sources,
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
