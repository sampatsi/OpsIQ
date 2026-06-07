"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "opsiq_session_id";

function generateSessionId(): string {
  return `sess_${crypto.randomUUID()}`;
}

const sessionStoreListeners = new Set<() => void>();

function emitSessionChange() {
  sessionStoreListeners.forEach((listener) => listener());
}

function subscribeSession(listener: () => void) {
  sessionStoreListeners.add(listener);
  return () => sessionStoreListeners.delete(listener);
}

function getSessionIdSnapshot(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateSessionId();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function getServerSessionIdSnapshot(): string {
  return "";
}

export function useSession() {
  const sessionId = useSyncExternalStore(
    subscribeSession,
    getSessionIdSnapshot,
    getServerSessionIdSnapshot
  );
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const resetSession = useCallback(() => {
    const id = generateSessionId();
    localStorage.setItem(STORAGE_KEY, id);
    emitSessionChange();
    return id;
  }, []);

  return { sessionId, ready, resetSession };
}
