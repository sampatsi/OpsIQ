export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--teal)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--teal)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--teal)]" />
    </div>
  );
}
