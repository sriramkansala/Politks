import { TopNav } from "@/components/shell/TopNav"

export default function Page() {
  const title = "manifestos".charAt(0).toUpperCase() + "manifestos".slice(1)
  return (
    <>
      <TopNav title={title} />
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
        <h1 className="text-heading mb-4" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Coming soon.</p>
      </div>
    </>
  )
}
