// Embeds the standalone atlas.html inside the app layout so the
// left sidebar (Overview / Parties / Manifestos / Bills / …) stays visible.
// The atlas itself owns its own internal left + right panels around the globe.

export const metadata = { title: "Atlas · Bharat Manifesto Watch" }

export default function AtlasPage() {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="/atlas.html"
        title="India Political Atlas"
        style={{
          border: "none",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}
