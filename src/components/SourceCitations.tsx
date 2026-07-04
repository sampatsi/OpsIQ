"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SourceCitation } from "@/types";
import { cn } from "@/lib/utils";

interface SourceCitationsProps {
  sources: SourceCitation[];
}

export function SourceCitations({ sources }: SourceCitationsProps) {
  const [open, setOpen] = useState(false);

  if (!sources?.length) return null;

  return (
    <div className="mt-3 border-t border-[var(--line)] pt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1 font-mono text-[11px] text-[var(--text-2)] transition-colors hover:text-[var(--teal)]"
      >
        {sources.length} source{sources.length !== 1 ? "s" : ""}
        <ChevronDown
          className={cn("ml-1 h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="mt-2 flex flex-wrap gap-2">
          {sources.map((source, i) => (
            <span
              key={source.document_id ?? i}
              className="cursor-default rounded-md border border-[#c9e6e0] bg-[var(--teal-bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--teal)]"
              title={source.snippet}
            >
              {source.title}
              {source.department ? ` · ${source.department}` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
