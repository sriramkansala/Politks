import { type NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are Neo Nīti's inline "Explain" assistant. The user has activated an AI explainer by wiggling their cursor over a metric, label, or UI element in India's citizen-accountability dashboard.

Your job: explain what the highlighted thing *means* — what the metric measures, where the data comes from, why it matters, and any important caveats. Be specific to Indian political/parliamentary context (PRS, ADR, ECI, Lok Sabha, Rajya Sabha, manifestos, etc.) where relevant.

Hard rules:
- Maximum 80 words. Two short paragraphs at most.
- No greetings, no "Sure!", no closing pleasantries. Open with the explanation directly.
- Plain prose. No bullet lists, no headers, no markdown bold.
- Neutral, factual tone. Never take political sides.
- If the metric's name is ambiguous, say so briefly rather than guess.`

export async function POST(req: NextRequest) {
  const { label, value, context } = (await req.json()) as {
    label?: string
    value?: string
    context?: string
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith("your-")) {
    return new Response(
      JSON.stringify({ error: "AI features require an Anthropic API key." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const userText = [
    label ? `Element label: ${label}` : null,
    value ? `Current value: ${value}` : null,
    context ? `Surrounding context: ${context}` : null,
  ].filter(Boolean).join("\n") || "An unlabelled UI element."

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 220,
    system: SYSTEM,
    messages: [{ role: "user", content: userText }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
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
    },
  })
}
