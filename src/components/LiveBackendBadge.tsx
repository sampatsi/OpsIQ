export function LiveBackendBadge() {
  return (
    <p className="flex items-center gap-1.5 px-4 py-3 text-[11px] text-[#64748B]">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#10B981]" aria-hidden />
      localhost:8000
    </p>
  );
}
