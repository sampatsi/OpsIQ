"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Layers, Upload } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { FileUpload } from "@/components/FileUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getStats } from "@/lib/api";
import type { StatsResponse } from "@/types";

export default function KnowledgeBasePage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const departments = stats?.documents_by_department
    ? Object.entries(stats.documents_by_department).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Knowledge Base
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Documents indexed for AI retrieval across departments.
            </p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="btn-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
              >
                <Upload className="h-4 w-4" />
                Upload document
              </button>
            </DialogTrigger>
            <DialogContent className="border-[var(--border)] bg-white">
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
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <p className="mt-1 text-xs">
              Ensure the FastAPI backend is running at http://localhost:8000
            </p>
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

        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-design-sm">
          <div className="border-b border-[var(--border-subtle)] px-6 py-4">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">
              Documents by department
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[#F9FAFB] text-left">
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-[var(--text-secondary)]">
                    Documents
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-[var(--text-muted)]">
                      Loading...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-[var(--text-muted)]">
                      No documents indexed yet. Upload your first document.
                    </td>
                  </tr>
                ) : (
                  departments.map(([dept, count]) => (
                    <tr
                      key={dept}
                      className="border-b border-[var(--border-subtle)] last:border-0 transition-colors hover:bg-[var(--bg-card-hover)]"
                    >
                      <td className="px-6 py-3 font-medium capitalize text-[var(--text-primary)]">
                        {dept}
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums text-[var(--text-primary)]">
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
