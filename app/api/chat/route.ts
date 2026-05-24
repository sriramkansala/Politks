import { type NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Neo Nīti AI — an expert assistant for Neo Nīti, India's citizen accountability dashboard.

You help users understand:
- Political promises made by parties (BJP, INC, AAP, DMK, AITC, etc.) and their status (kept, broken, in progress, stalled)
- Legislators: MPs (Lok Sabha & Rajya Sabha), MLAs, their attendance, assets, criminal cases
- Bills: parliamentary bills, their stage in the legislative process
- Manifestos: what parties promised and how they compare
- Elections, constituencies, and political data

Tone: factual, concise, neutral. Never take political sides. Cite data when available.
Format: Use short paragraphs. Use markdown sparingly — bullet lists are fine. Keep answers under 200 words unless the question requires depth.
When you don't know specific real-time data, say so and direct users to the relevant section of the app.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith("your-")) {
    return new Response(
      JSON.stringify({ error: "AI features require an Anthropic API key. Add ANTHROPIC_API_KEY to .env.local." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: SYSTEM,
    messages,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
