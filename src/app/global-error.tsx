"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7f4",
          fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
          color: "#1c2433",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <h1
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Application error
          </h1>
          <p style={{ marginTop: 8, fontSize: "0.875rem", color: "#5b6472" }}>
            The app failed to load. Restart the dev server and clear the `.next` cache.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              border: "none",
              borderRadius: 9,
              background: "#128a7e",
              color: "#fff",
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
