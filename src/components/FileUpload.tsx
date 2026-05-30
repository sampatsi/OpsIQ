"use client";

import { useCallback, useState } from "react";
import { Upload, File, Loader2, CheckCircle2 } from "lucide-react";
import { ingestDocument } from "@/lib/api";
import { DEPARTMENTS, DOC_TYPES } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  compact?: boolean;
  variant?: "default" | "sidebar";
  onSuccess?: () => void;
}

export function FileUpload({ compact, variant = "default", onSuccess }: FileUploadProps) {
  const isSidebar = variant === "sidebar";
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [docType, setDocType] = useState<string>(DOC_TYPES[0]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setError(null);
    setSuccess(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("department", department);
    formData.append("doc_type", docType);

    try {
      await ingestDocument(formData);
      setSuccess(true);
      setFile(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectTriggerClass = isSidebar
    ? "mt-1 h-9 border-[var(--border-sidebar)] bg-[var(--bg-sidebar-input)] text-[#E5E7EB] text-[13px] rounded-lg"
    : "mt-1 h-9";

  const labelClass = isSidebar
    ? "text-[12px] font-medium text-[#C4CBD6]"
    : "text-xs text-[var(--text-secondary)]";

  return (
    <div className={cn("space-y-3", compact && "text-sm")}>
      {!compact && !isSidebar && (
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Upload document
        </p>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-all duration-150",
          isSidebar
            ? cn(
                "border-[var(--border-sidebar)] bg-[var(--bg-sidebar-elevated)]",
                dragOver && "border-[var(--accent-primary)] bg-[var(--bg-sidebar-hover)]"
              )
            : cn(
                "border-[var(--border)] bg-[var(--bg-card)]",
                dragOver && "border-[var(--accent-primary)] bg-[#EEF2FF]/30"
              ),
          compact ? "p-3" : "p-4"
        )}
      >
        {file ? (
          <div className="flex items-center gap-2 text-sm">
            <File className={cn("h-4 w-4", isSidebar ? "text-[#818CF8]" : "text-[var(--accent-primary)]")} />
            <span className={cn("truncate max-w-[180px]", isSidebar ? "text-[#E5E7EB]" : "")}>
              {file.name}
            </span>
          </div>
        ) : (
          <>
            <Upload
              className={cn(
                "mb-2",
                isSidebar ? "h-6 w-6 text-[#A5B4FC]" : "h-5 w-5 text-[var(--text-muted)]"
              )}
            />
            <p
              className={cn(
                "text-center text-[12px]",
                isSidebar ? "text-[#C4CBD6]" : "text-[var(--text-muted)]"
              )}
            >
              Drag & drop or{" "}
              <label
                className={cn(
                  "cursor-pointer font-medium hover:underline",
                  isSidebar ? "text-[#C7D2FE]" : "text-[var(--accent-primary)]"
                )}
              >
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            </p>
          </>
        )}
      </div>

      <div className="grid gap-2">
        <div>
          <Label className={labelClass}>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={labelClass}>Document type</Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && (
        <p className={cn("flex items-center gap-1 text-xs", isSidebar ? "text-[#34D399]" : "text-green-600")}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Uploaded successfully
        </p>
      )}

      <button
        type="button"
        onClick={upload}
        disabled={!file || uploading}
        className="btn-gradient flex h-[38px] w-full items-center justify-center gap-2 rounded-lg text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload to knowledge base"
        )}
      </button>
    </div>
  );
}
