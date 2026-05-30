"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "opsiq_session_id";

function generateSessionId(): string {
  return `sess_${crypto.randomUUID()}`;
}

export function useSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateSessionId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    setSessionId(id);
    setReady(true);
  }, []);

  const resetSession = useCallback(() => {
    const id = generateSessionId();
    localStorage.setItem(STORAGE_KEY, id);
    setSessionId(id);
    return id;
  }, []);

  return { sessionId, ready, resetSession };
}
