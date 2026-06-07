"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[var(--bg-main,#f8fafc)] px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-[#111827]">Application error</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            The app failed to load. Restart the dev server and clear the `.next` cache.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
