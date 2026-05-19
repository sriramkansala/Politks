import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bharatmanifestowatch.in"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/ingest"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
