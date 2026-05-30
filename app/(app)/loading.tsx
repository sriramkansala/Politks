export default function Loading() {
  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6 animate-pulse">
      <div className="h-7 w-40 rounded-lg" style={{ background: "var(--bg-elevated-2)" }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl" style={{ background: "var(--bg-elevated)" }} />
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="h-3 w-48 rounded-full" style={{ background: "var(--bg-elevated-2)" }} />
            <div className="h-3 w-20 rounded-full ml-auto" style={{ background: "var(--bg-elevated-2)" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
