"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Layers, Upload, BookOpen } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { PageHeader } from "@/components/PageHeader";
import { FileUpload } from "@/components/FileUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getApiFailureHint, getStats } from "@/lib/api";
import type { StatsResponse } from "@/types";

export default function KnowledgeBasePage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const reportError = useCallback(async (message: string) => {
    setError(message);
    setErrorHint(await getApiFailureHint());
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorHint(null);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      await reportError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [reportError]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          await reportError(err instanceof Error ? err.message : "Failed to load stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportError]);

  const departments = stats?.documents_by_department
    ? Object.entries(stats.documents_by_department).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="console-page">
      <PageHeader
        icon={BookOpen}
        title="Knowledge Base"
        description="Documents indexed for AI retrieval across departments."
        actions={
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2 rounded-[9px] px-4 py-2.5 text-sm font-semibold"
              >
                <Upload className="h-4 w-4" />
                Upload document
              </button>
            </DialogTrigger>
            <DialogContent className="border-[var(--line)] bg-[var(--card)]">
              <DialogHeader>
                <DialogTitle className="font-display">Upload to knowledge base</DialogTitle>
              </DialogHeader>
              <FileUpload
                onSuccess={() => {
                  setUploadOpen(false);
                  loadStats();
                }}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-[var(--red-bg)] bg-[var(--red-bg)] p-4 text-sm text-[var(--red)]">
            {error}
            {errorHint && <p className="mt-1 text-xs">{errorHint}</p>}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <StatsCard
            label="Total documents"
            value={loading ? "—" : (stats?.total_documents ?? 0)}
            icon={FileText}
          />
          <StatsCard
            label="Total chunks"
            value={loading ? "—" : (stats?.total_chunks ?? 0)}
            icon={Layers}
          />
        </div>

        <div className="console-card">
          <div className="border-b border-[var(--line)] px-6 py-4">
            <h2 className="font-display font-semibold text-[var(--text)]">
              Documents by department
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="console-table-head border-b border-[var(--line)]">
                  <th className="px-6 py-3 font-medium text-[var(--text-2)]">Department</th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--text-2)]">
                    Documents
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-[var(--text-2)]">
                      Loading...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-[var(--text-2)]">
                      No documents indexed yet. Upload your first document.
                    </td>
                  </tr>
                ) : (
                  departments.map(([dept, count]) => (
                    <tr
                      key={dept}
                      className="border-b border-[var(--line)] last:border-0 transition-colors hover:bg-[var(--bg-card-hover)]"
                    >
                      <td className="px-6 py-3 font-medium capitalize text-[var(--text)]">
                        {dept}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-[var(--text)]">
                        {count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
