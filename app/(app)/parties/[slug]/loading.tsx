export default function Loading() {
  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-8 animate-pulse">
      {/* Party header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[6px]" style={{ background: "var(--bg-elevated-2)" }} />
        <div className="space-y-2">
          <div className="h-6 w-52 rounded-[4px]" style={{ background: "var(--bg-elevated-2)" }} />
          <div className="h-3 w-32 rounded-[4px]" style={{ background: "var(--bg-elevated-2)" }} />
        </div>
      </div>
      {/* Status grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 rounded-[6px]" style={{ background: "var(--bg-elevated)" }} />
        ))}
      </div>
      {/* Promises table */}
      <div className="rounded-[6px] overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="h-3 w-64 rounded-[2px]" style={{ background: "var(--bg-elevated-2)" }} />
            <div className="h-3 w-20 rounded-[2px] ml-auto" style={{ background: "var(--bg-elevated-2)" }} />
            <div className="h-5 w-16 rounded-[2px]" style={{ background: "var(--bg-elevated-2)" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
