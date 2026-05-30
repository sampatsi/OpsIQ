export function ScoreCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E5E7EB] bg-white p-7">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[#E5E7EB]" />
        <div className="h-4 w-24 rounded bg-[#E5E7EB]" />
      </div>
      <div className="mt-4 h-12 w-20 rounded bg-[#E5E7EB]" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-28 rounded bg-[#F3F4F6]" />
        <div className="h-1.5 w-full rounded-full bg-[#F3F4F6]" />
        <div className="h-5 w-16 rounded-full bg-[#F3F4F6]" />
      </div>
    </div>
  );
}
