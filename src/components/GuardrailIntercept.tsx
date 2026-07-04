interface GuardrailInterceptProps {
  title: string;
  message: string;
  reasonCode?: string;
  auditId?: string;
  restrictedFields?: string[];
}

export function GuardrailIntercept({
  title,
  message,
  reasonCode,
  auditId,
  restrictedFields,
}: GuardrailInterceptProps) {
  return (
    <div
      className="animate-rise max-w-[78%] self-start rounded-xl border border-[#ead3a4] border-l-[3px] border-l-[var(--amber)] bg-[var(--amber-bg)] px-4 py-3 max-[820px]:max-w-[94%]"
      role="alert"
    >
      <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--amber)]">
        {title}
      </h4>
      <p className="text-[13px] leading-relaxed text-[#5c4713]">
        {message}
        {reasonCode && (
          <>
            {" "}
            <code className="rounded bg-[#f1e2c0] px-1.5 py-0.5 font-mono text-[11px]">
              {reasonCode}
            </code>
          </>
        )}
      </p>
      <p className="mt-2 font-mono text-[10px] text-[#9a7a38]">
        Logged to audit trail
        {auditId ? ` · ${auditId.slice(0, 8)}` : ""}.
      </p>
      {restrictedFields && restrictedFields.length > 0 && (
        <p className="mt-1 font-mono text-[10px] text-[#9a7a38]">
          Restricted: {restrictedFields.join(", ")}
        </p>
      )}
    </div>
  );
}
