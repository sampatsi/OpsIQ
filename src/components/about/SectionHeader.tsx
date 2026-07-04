interface SectionHeaderProps {
  label: string;
  heading: string;
  className?: string;
}

export function SectionHeader({ label, heading, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-2)]">
        {label}
      </p>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
        {heading}
      </h2>
    </div>
  );
}
