import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ConsoleHeader, CONSOLE_HEADER_BRAND } from "@/components/ConsoleHeader";
import { ConsoleHeaderIcon } from "@/components/ConsoleHeaderIcon";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  chips?: ReactNode;
  icon?: LucideIcon;
  className?: string;
  sticky?: boolean;
}

/** Console page header — same chrome as the chat agent bar. */
export function PageHeader({
  title,
  description,
  meta,
  actions,
  chips,
  icon,
  className,
  sticky = true,
}: PageHeaderProps) {
  const trailing = chips || actions;

  return (
    <ConsoleHeader
      sticky={sticky}
      className={className}
      accentColor={CONSOLE_HEADER_BRAND.accent}
      washColor={CONSOLE_HEADER_BRAND.wash}
      icon={icon ? <ConsoleHeaderIcon icon={icon} /> : undefined}
      title={
        <h1 className="truncate font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-[var(--text)]">
          {title}
        </h1>
      }
      subtitle={
        description || meta ? (
          <div className="mt-0 min-w-0">
            {description && (
              <p className="truncate text-[0.78rem] leading-snug text-[var(--text-2)]">
                {description}
              </p>
            )}
            {meta && (
              <div
                className={cn(
                  "font-mono text-[0.64rem] text-[var(--text-2)]",
                  description && "mt-0.5"
                )}
              >
                {meta}
              </div>
            )}
          </div>
        ) : undefined
      }
      trailing={
        trailing ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {chips}
            {actions}
          </div>
        ) : undefined
      }
    />
  );
}
