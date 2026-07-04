import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSOLE_HEADER_BRAND } from "@/components/ConsoleHeader";

interface ConsoleHeaderIconProps {
  icon: LucideIcon;
  className?: string;
}

/** Page icon tile — same size as agent header glyph. */
export function ConsoleHeaderIcon({ icon: Icon, className }: ConsoleHeaderIconProps) {
  return (
    <span
      className={cn(
        "console-header-icon shrink-0 shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]",
        className
      )}
      style={{
        backgroundColor: CONSOLE_HEADER_BRAND.iconBg,
        color: CONSOLE_HEADER_BRAND.iconFg,
      }}
      aria-hidden
    >
      <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2.25} />
    </span>
  );
}
