import { AgentGlyph } from "@/components/AgentGlyph";
import { GroundingMeter } from "@/components/GroundingMeter";
import { AGENT_GLYPH, getAgentByName } from "@/lib/agents";
import type { AgentId, ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const agent = getAgentByName(message.agentName);
  const agentId = agent.id as AgentId;
  const showGrounding =
    !isUser &&
    (message.sources?.length ||
      message.grounding?.faithfulness != null ||
      message.guardrail?.status === "passed");

  return (
    <div
      className={cn(
        "animate-rise flex w-full max-w-[78%] flex-col max-[820px]:max-w-[94%]",
        isUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {!isUser && message.agentName && (
        <div className="mb-1 flex items-center gap-1.5 text-[0.7rem] text-[var(--text-2)]">
          <AgentGlyph agentId={agentId} label={AGENT_GLYPH[agentId]} size="message" />
          {message.agentName} Agent
        </div>
      )}

      <div className={cn("w-full", !isUser && showGrounding && "flex flex-col")}>
        <div
          className={cn(
            "text-[0.88rem] leading-[1.6]",
            isUser
              ? "rounded-2xl rounded-br-[5px] bg-[var(--ink)] px-4 py-3 text-[var(--text-inv)]"
              : cn(
                  "rounded-2xl rounded-bl-[5px] border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-[var(--text)] shadow-design-sm",
                  showGrounding && "rounded-b-none border-b-0"
                )
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {showGrounding && (
          <GroundingMeter
            sources={message.sources}
            faithfulness={message.grounding?.faithfulness}
          />
        )}
      </div>
    </div>
  );
}
