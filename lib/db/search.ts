import { createClient } from "@/lib/db/server"
import { embedText } from "@/lib/ai/embed"

export interface SearchResult {
  id: string
  title: string
  text: string
  category: string
  status: string
  party_id: string
  score: number
}

export async function hybridSearch(
  query: string,
  options: {
    partyId?: string
    category?: string
    limit?: number
  } = {}
): Promise<SearchResult[]> {
  const { partyId, category, limit = 20 } = options

  // Generate embedding for semantic component
  const embedding = await embedText(query)

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("hybrid_search", {
    query_text: query,
    query_embedding: embedding,
    match_count: limit,
    party_filter: partyId ?? null,
    category_filter: category ?? null,
  })

  if (error) throw new Error(error.message)
  return (data ?? []) as SearchResult[]
}
