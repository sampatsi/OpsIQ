export function SidebarLogo() {
  return (
    <div className="flex h-16 shrink-0 items-center px-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-accent-gradient"
          aria-hidden
        />
        <div>
          <h1 className="font-display text-[18px] font-bold text-white">OpsIQ</h1>
          <p className="text-[11px] text-[#94A3B8]">AI Operations Hub</p>
        </div>
      </div>
    </div>
  );
}
