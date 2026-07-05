import { API_ENDPOINTS } from "@/lib/endpoints";

interface ApiEndpointsTableProps {
  filter?: "all" | "platform";
}

export function ApiEndpointsTable({ filter = "all" }: ApiEndpointsTableProps) {
  const rows =
    filter === "platform"
      ? API_ENDPOINTS.filter((e) => e.tag === "Platform")
      : API_ENDPOINTS;

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--card)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--line)] bg-[var(--paper)] font-mono text-[10px] uppercase tracking-wider text-[var(--text-2)]">
            <th className="px-4 py-2 text-left">Method</th>
            <th className="px-4 py-2 text-left">Path</th>
            <th className="px-4 py-2 text-left">Tag</th>
            <th className="px-4 py-2 text-left hidden md:table-cell">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.method}-${row.path}`} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-2">
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    row.method === "GET"
                      ? "bg-teal-bg text-teal"
                      : row.method === "POST"
                        ? "bg-amber-bg text-amber"
                        : "bg-[var(--paper)] text-[var(--text-2)]"
                  }`}
                >
                  {row.method}
                </span>
              </td>
              <td className="px-4 py-2 font-mono text-xs text-[var(--ink)]">
                /api/v1{row.path}
              </td>
              <td className="px-4 py-2 font-mono text-[10px] text-[var(--text-2)]">
                {row.tag}
              </td>
              <td className="px-4 py-2 text-[var(--text-2)] hidden md:table-cell">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
