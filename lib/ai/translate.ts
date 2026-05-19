import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Top 8 priority languages by speaker count (Census 2011)
export const PRIORITY_LOCALES = ["hi", "bn", "te", "mr", "ta", "ur", "gu", "kn"] as const
export const ALL_LOCALES = [
  "hi", "bn", "te", "mr", "ta", "ur", "gu", "kn",
  "ml", "or", "pa", "as", "mai", "kok", "sat", "mni",
  "ne", "doi", "brx", "ks", "sd", "sa",
] as const

type Locale = (typeof ALL_LOCALES)[number]

const LANGUAGE_NAMES: Record<Locale, string> = {
  hi: "Hindi",    bn: "Bengali",   te: "Telugu",   mr: "Marathi",
  ta: "Tamil",    ur: "Urdu",      gu: "Gujarati",  kn: "Kannada",
  ml: "Malayalam", or: "Odia",     pa: "Punjabi",  as: "Assamese",
  mai: "Maithili", kok: "Konkani", sat: "Santali", mni: "Manipuri",
  ne: "Nepali",  doi: "Dogri",   brx: "Bodo",     ks: "Kashmiri",
  sd: "Sindhi",   sa: "Sanskrit",
}

interface TranslationInput {
  title: string
  text: string
}

interface TranslationOutput {
  title: Record<string, string>
  text: Record<string, string>
}

export async function translatePromise(
  input: TranslationInput,
  locales: Locale[] = [...PRIORITY_LOCALES],
  batchSize = 5
): Promise<TranslationOutput> {
  const result: TranslationOutput = { title: {}, text: {} }
  const batches: Locale[][] = []

  for (let i = 0; i < locales.length; i += batchSize) {
    batches.push(locales.slice(i, i + batchSize))
  }

  for (const batch of batches) {
    const langList = batch.map((l) => `${l} (${LANGUAGE_NAMES[l]})`).join(", ")

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system:
        "You are a professional translator specialising in Indian political text. " +
        "Translate accurately and naturally. Preserve political terms. " +
        "Respond ONLY with a JSON object, no explanation.",
      messages: [
        {
          role: "user",
          content: `Translate the following political promise into these languages: ${langList}.

Title: ${input.title}
Text: ${input.text}

Respond as JSON with this exact shape:
{
  "title": { "<locale_code>": "<translated title>", ... },
  "text":  { "<locale_code>": "<translated text>", ... }
}`,
        },
      ],
    })

    const raw = response.content[0]
    if (raw.type !== "text") continue

    try {
      const parsed = JSON.parse(raw.text.trim())
      Object.assign(result.title, parsed.title ?? {})
      Object.assign(result.text,  parsed.text  ?? {})
    } catch {
      // Best-effort — partial translations are fine
    }
  }

  return result
}
