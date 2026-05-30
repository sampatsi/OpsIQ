interface SectionHeaderProps {
  label: string;
  heading: string;
  className?: string;
}

export function SectionHeader({ label, heading, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
        {label}
      </p>
      <h2 className="font-display text-2xl font-semibold text-[#0A0A0F]">{heading}</h2>
    </div>
  );
}
