import { SourceCitations } from "@/components/SourceCitations";
import { AGENT_GRADIENT_CLASS, getAgentByName } from "@/lib/agents";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const agent = getAgentByName(message.agentName);
  const gradientClass = AGENT_GRADIENT_CLASS[agent.id];

  return (
    <div
      className={cn(
        "animate-message-in flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[75%] flex-col", isUser && "max-w-[70%] items-end")}>
        {!isUser && message.agentName && (
          <div className="mb-1 flex items-center gap-1.5">
            <span
              className={cn("h-5 w-5 shrink-0 rounded-full", gradientClass)}
              aria-hidden
            />
            <span className="text-[11px] text-[var(--text-muted)]">{message.agentName}</span>
          </div>
        )}
        <div
          className={cn(
            "text-sm leading-relaxed",
            isUser
              ? "rounded-[18px_18px_4px_18px] bg-accent-gradient px-4 py-3 text-white shadow-design-lg"
              : "rounded-[18px_18px_18px_4px] border border-[var(--border-subtle)] bg-white px-5 py-4 text-[var(--text-primary)] shadow-design-sm"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourceCitations sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
}
