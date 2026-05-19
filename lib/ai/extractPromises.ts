import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Zod schema for one extracted promise ─────────────────────────────────────

const TargetMetricSchema = z.object({
  metric: z.string(),
  value: z.number(),
  unit: z.string(),
  deadline_year: z.number().optional(),
})

const PromiseSchema = z.object({
  title: z.string().max(80),
  text: z.string().max(500),
  page_ref: z.number().nullable(),
  category: z.enum([
    "economy", "agriculture", "women", "youth", "infrastructure",
    "healthcare", "education", "defense", "environment", "governance",
    "social_welfare", "technology", "foreign_policy", "culture",
    "labor", "justice", "federalism", "urban", "rural", "energy",
    "water", "transport",
  ]),
  tags: z.array(z.string()),
  success_criteria: z.string(),
  target_metric: TargetMetricSchema.nullable(),
  geography: z.string(),
  is_headline: z.boolean(),
  sub_promises: z.array(z.object({
    title: z.string().max(80),
    text: z.string().max(500),
    page_ref: z.number().nullable(),
    category: z.enum([
      "economy", "agriculture", "women", "youth", "infrastructure",
      "healthcare", "education", "defense", "environment", "governance",
      "social_welfare", "technology", "foreign_policy", "culture",
      "labor", "justice", "federalism", "urban", "rural", "energy",
      "water", "transport",
    ]),
    success_criteria: z.string(),
    target_metric: TargetMetricSchema.nullable(),
    geography: z.string(),
    is_headline: z.boolean(),
  })).optional(),
})

const ExtractionResultSchema = z.object({
  party_name: z.string(),
  election_year: z.number(),
  election_type: z.enum(["lok_sabha", "vidhan_sabha", "local"]),
  promises: z.array(PromiseSchema),
  extraction_notes: z.string().optional(),
})

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>
export type ExtractedPromise = z.infer<typeof PromiseSchema>

// JSON schema derived from Zod (simplified for Anthropic structured outputs)
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    party_name: { type: "string" },
    election_year: { type: "integer" },
    election_type: { type: "string", enum: ["lok_sabha", "vidhan_sabha", "local"] },
    extraction_notes: { type: "string" },
    promises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
          page_ref: { type: ["integer", "null"] },
          category: {
            type: "string",
            enum: [
              "economy", "agriculture", "women", "youth", "infrastructure",
              "healthcare", "education", "defense", "environment", "governance",
              "social_welfare", "technology", "foreign_policy", "culture",
              "labor", "justice", "federalism", "urban", "rural", "energy",
              "water", "transport",
            ],
          },
          tags: { type: "array", items: { type: "string" } },
          success_criteria: { type: "string" },
          target_metric: {
            oneOf: [
              {
                type: "object",
                properties: {
                  metric: { type: "string" },
                  value: { type: "number" },
                  unit: { type: "string" },
                  deadline_year: { type: "integer" },
                },
                required: ["metric", "value", "unit"],
              },
              { type: "null" },
            ],
          },
          geography: { type: "string" },
          is_headline: { type: "boolean" },
        },
        required: ["title", "text", "page_ref", "category", "tags", "success_criteria", "target_metric", "geography", "is_headline"],
      },
    },
  },
  required: ["party_name", "election_year", "election_type", "promises"],
}

const SYSTEM_PROMPT = `You are a non-partisan policy analyst extracting structured promises from a
political party manifesto for a citizen accountability dashboard. Be precise,
neutral, and faithful to the source. Quote verbatim wherever possible.
Never invent facts not in the document.`

const USER_PROMPT = `Extract all distinct promises from this manifesto. A "promise" is a
prospective statement of a specific action or outcome that is verifiable
(PolitiFact definition).

For each promise:
1. Identify a short title (≤80 chars).
2. Quote the exact source text (≤500 chars). Include the page number.
3. Classify into one of the provided categories.
4. Define success_criteria: a one-sentence objective test for whether the
   promise has been kept ("X has happened by date Y, measured by Z source").
5. Where the manifesto gives a numeric target, return target_metric as
   {metric, value, unit, deadline_year}. Otherwise null.
6. Tag geography: 'national', or a 2-letter Indian state code.
7. Set is_headline=true for the 10-15 most politically prominent promises.
8. Add relevant tags (keywords like "PM Awas", "solar", "MSP").

Do NOT include vague slogans unless they have a verifiable component.
Skip preamble, dedication, party history, and general vision statements.
Respond using the provided JSON schema only.`

export async function extractPromisesFromPDF(
  pdfUrl: string,
  onProgress?: (message: string) => void
): Promise<ExtractionResult> {
  onProgress?.("Sending PDF to Claude for analysis…")

  const response = await client.messages.create(
    {
      model: "claude-sonnet-4-5",
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "url",
                url: pdfUrl,
              },
            },
            {
              type: "text",
              text: USER_PROMPT,
            },
          ],
        },
      ],
      // @ts-expect-error — structured-outputs beta field
      output_format: {
        type: "json_schema",
        json_schema: OUTPUT_SCHEMA,
      },
    },
    {
      headers: {
        "anthropic-beta": "structured-outputs-2025-11-13",
      },
    }
  )

  onProgress?.("Extraction complete, parsing result…")

  const raw = response.content[0]
  if (raw.type !== "text") throw new Error("Unexpected response type from Claude")

  const parsed = JSON.parse(raw.text)
  const validated = ExtractionResultSchema.parse(parsed)

  onProgress?.(`Extracted ${validated.promises.length} promises from ${validated.party_name} manifesto.`)
  return validated
}

export async function extractPromisesFromBase64(
  base64Data: string,
  mimeType: "application/pdf",
  onProgress?: (message: string) => void
): Promise<ExtractionResult> {
  onProgress?.("Sending PDF to Claude for analysis…")

  const response = await client.messages.create(
    {
      model: "claude-sonnet-4-5",
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: USER_PROMPT,
            },
          ],
        },
      ],
      // @ts-expect-error — structured-outputs beta field
      output_format: {
        type: "json_schema",
        json_schema: OUTPUT_SCHEMA,
      },
    },
    {
      headers: {
        "anthropic-beta": "structured-outputs-2025-11-13",
      },
    }
  )

  onProgress?.("Parsing Claude response…")

  const raw = response.content[0]
  if (raw.type !== "text") throw new Error("Unexpected response type from Claude")

  const parsed = JSON.parse(raw.text)
  const validated = ExtractionResultSchema.parse(parsed)

  onProgress?.(`Extracted ${validated.promises.length} promises.`)
  return validated
}
