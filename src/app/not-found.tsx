import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-bold text-[var(--text-primary)]">404</p>
      <h1 className="mt-4 font-display text-xl font-semibold text-[var(--text-primary)]">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/chat"
        className="btn-primary mt-6 rounded-[9px] px-4 py-2 text-sm font-semibold"
      >
        Back to chat
      </Link>
    </div>
  );
}
