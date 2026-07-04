import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Brand duotone for non-agent console pages (matches sidebar teal accent). */
export const CONSOLE_HEADER_BRAND = {
  accent: "#0e8c7f",
  wash: "#1a3d38",
  iconBg: "#1a3d38",
  iconFg: "#7fd4c7",
} as const;

interface ConsoleHeaderProps extends Omit<ComponentPropsWithoutRef<"header">, "title"> {
  accentColor: string;
  washColor: string;
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  sticky?: boolean;
}

/** Shared top bar chrome for chat workspace and console pages. */
export function ConsoleHeader({
  accentColor,
  washColor,
  icon,
  title,
  subtitle,
  trailing,
  sticky = false,
  className,
  ...rest
}: ConsoleHeaderProps) {
  return (
    <header
      {...rest}
      className={cn(
        "console-header relative flex shrink-0 items-center gap-3.5 border-b border-[var(--line)] px-6 py-3.5 max-[820px]:px-4",
        sticky && "sticky top-0 z-20",
        className
      )}
      style={
        {
          "--header-accent": accentColor,
          "--header-wash": washColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 rounded-r-sm"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />

      {icon}

      <div className="min-w-0 flex-1 pl-0.5">
        <div className="flex min-w-0 items-center gap-2">{title}</div>
        {subtitle}
      </div>

      {trailing}
    </header>
  );
}
