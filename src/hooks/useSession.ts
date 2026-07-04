"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentId } from "@/types";
import { createSession } from "@/lib/api";

const STORAGE_KEY = "opsiq_session_id";

function fallbackSessionId(): string {
  return `sess_${crypto.randomUUID()}`;
}

export function useSession(initialAgent: AgentId = "internal") {
  const [sessionId, setSessionId] = useState("");
  const [ready, setReady] = useState(false);
  const bootstrapped = useRef(false);

  const issueSession = useCallback(async (agentType: AgentId) => {
    setReady(false);
    try {
      const data = await createSession({ agent_type: agentType });
      setSessionId(data.session_id);
      localStorage.setItem(STORAGE_KEY, data.session_id);
    } catch {
      let id = localStorage.getItem(STORAGE_KEY);
      if (!id) id = fallbackSessionId();
      setSessionId(id);
      localStorage.setItem(STORAGE_KEY, id);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void issueSession(initialAgent);
  }, [initialAgent, issueSession]);

  const resetSession = useCallback(
    (agentType: AgentId = initialAgent) => issueSession(agentType),
    [initialAgent, issueSession]
  );

  return { sessionId, ready, resetSession };
}
