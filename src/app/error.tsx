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
        className="btn-primary mt-6 rounded-[9px] px-4 py-2 text-sm font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
