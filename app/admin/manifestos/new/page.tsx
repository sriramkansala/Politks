import { ManifestoUploader } from "@/components/admin/ManifestoUploader"

export default function NewManifestoPage() {
  return (
    <div className="px-6 py-8 max-w-[860px] mx-auto space-y-6">
      <div>
        <h1 className="h-page mb-1" style={{ color: "var(--text-primary)" }}>
          Upload Manifesto
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Provide a direct PDF URL and Claude will extract, translate, and embed all promises automatically.
        </p>
      </div>
      <ManifestoUploader />
    </div>
  )
}
