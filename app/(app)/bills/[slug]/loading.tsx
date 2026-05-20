export default function BillDetailLoading() {
  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center">
        <div className="h-3 w-8 rounded" style={{ background: "var(--bg-elevated-2)" }} />
        <div className="h-3 w-2 rounded" style={{ background: "var(--bg-elevated-2)" }} />
        <div className="h-3 w-16 rounded" style={{ background: "var(--bg-elevated-2)" }} />
      </div>

      {/* Title */}
      <div className="space-y-3">
        <div className="h-8 w-2/3 rounded" style={{ background: "var(--bg-elevated-2)" }} />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded" style={{ background: "var(--bg-elevated-2)" }} />
          <div className="h-5 w-20 rounded" style={{ background: "var(--bg-elevated-2)" }} />
          <div className="h-5 w-24 rounded" style={{ background: "var(--bg-elevated-2)" }} />
        </div>
        <div className="h-4 w-full max-w-lg rounded" style={{ background: "var(--bg-elevated-2)" }} />
        <div className="h-4 w-3/4 max-w-lg rounded" style={{ background: "var(--bg-elevated-2)" }} />
      </div>

      {/* Graph placeholder */}
      <div
        className="rounded-[6px] h-[320px]"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      />

      {/* Stage timeline */}
      <div className="space-y-4">
        <div className="h-5 w-32 rounded" style={{ background: "var(--bg-elevated-2)" }} />
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div
              className="w-[10px] h-[10px] rounded-full mt-2 shrink-0"
              style={{ background: "var(--bg-elevated-2)", marginLeft: 14 }}
            />
            <div className="flex-1 space-y-1 pb-4">
              <div
                className="h-3 rounded"
                style={{ background: "var(--bg-elevated-2)", width: `${40 + (i % 4) * 15}%` }}
              />
              {i % 3 === 0 && (
                <div
                  className="h-14 rounded-[4px]"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
