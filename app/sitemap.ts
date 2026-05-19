import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bharatmanifestowatch.in"

const PARTY_SLUGS = ["bjp", "inc", "aap", "dmk"]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL,                  priority: 1.0 },
    { url: `${BASE_URL}/parties`,     priority: 0.9 },
    { url: `${BASE_URL}/compare`,     priority: 0.8 },
    { url: `${BASE_URL}/tracker`,     priority: 0.8 },
    { url: `${BASE_URL}/methodology`, priority: 0.7 },
    { url: `${BASE_URL}/about`,       priority: 0.6 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority,
  }))

  const partyRoutes = PARTY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/parties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }))

  return [...staticRoutes, ...partyRoutes]
}
