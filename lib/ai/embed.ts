import OpenAI from "openai"

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "placeholder" })
}

export async function embedText(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  })
  return response.data[0].embedding
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []

  const response = await getClient().embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
    dimensions: 1536,
  })

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding)
}
