"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-xl font-semibold text-[var(--text-primary)]">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
        An unexpected error occurred. Try again, or restart the dev server if you recently
        upgraded Next.js.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
