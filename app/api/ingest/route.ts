import { type NextRequest, NextResponse } from "next/server"
import { extractPromisesFromPDF } from "@/lib/ai/extractPromises"
import { translatePromise, PRIORITY_LOCALES } from "@/lib/ai/translate"
import { embedBatch } from "@/lib/ai/embed"

export const runtime = "nodejs"
export const maxDuration = 300 // 5 minutes for large PDFs

export async function POST(req: NextRequest) {
  const { pdf_url, party_id, manifesto_id } = await req.json()

  if (!pdf_url || !party_id || !manifesto_id) {
    return NextResponse.json(
      { error: "pdf_url, party_id, and manifesto_id are required" },
      { status: 400 }
    )
  }

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  function progress(msg: string) {
    writer.write(encoder.encode(`data: ${JSON.stringify({ type: "progress", message: msg })}\n\n`))
  }

  // Run extraction in background, stream progress
  ;(async () => {
    try {
      progress("Starting manifesto extraction…")

      // Step 1: Extract promises from PDF via Claude
      const extraction = await extractPromisesFromPDF(pdf_url, progress)
      progress(`Extracted ${extraction.promises.length} promises. Starting translations…`)

      // Step 2: Translate titles + texts (priority locales only for now)
      const translated = await Promise.all(
        extraction.promises.map((p) =>
          translatePromise(
            { title: p.title, text: p.text },
            [...PRIORITY_LOCALES]
          )
        )
      )
      progress("Translations complete. Generating embeddings…")

      // Step 3: Embed all promise texts for semantic search
      const texts = extraction.promises.map((p) => `${p.title} ${p.text}`)
      const embeddings = await embedBatch(texts)
      progress("Embeddings generated. Saving to database…")

      // Step 4: Write to Supabase (requires server-side client with service role)
      // Note: actual DB writes happen here — requires SUPABASE_SERVICE_ROLE_KEY
      const results = extraction.promises.map((p, i) => ({
        ...p,
        title_translations: translated[i]?.title ?? {},
        text_translations: translated[i]?.text ?? {},
        embedding: embeddings[i] ?? null,
        party_id,
        manifesto_id,
        status: "not_yet_rated" as const,
      }))

      writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "complete",
            count: results.length,
            party_name: extraction.party_name,
            election_year: extraction.election_year,
          })}\n\n`
        )
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      writer.write(
        encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
      )
    } finally {
      writer.close()
    }
  })()

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
