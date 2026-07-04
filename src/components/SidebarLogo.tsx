import Link from "next/link";
import { OpsIQLogo } from "@/components/OpsIQLogo";

export function SidebarLogo() {
  return (
    <div className="border-b border-[var(--line-ink)] px-4 pb-4 pt-5">
      <Link href="/" className="block w-fit" aria-label="OpsIQ home">
        <OpsIQLogo size={34} loop tagline="" variant="dark" />
      </Link>
    </div>
  );
}
