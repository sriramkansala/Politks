#!/usr/bin/env node
/**
 * verify-promise-sources.mjs — Validate every source URL in
 * lib/db/promiseStatuses.ts using Playwright (handles JS-rendered sites
 * like PIB and PRS that may block plain curl).
 *
 *   $ node scripts/verify-promise-sources.mjs
 *
 * For each URL we record:
 *   - status: HTTP code (200 / 404 / etc.)
 *   - reachable: bool (no DNS error, no timeout)
 *   - page_title: <title> tag content (first 120 chars)
 *   - keywords_match: did any of the supplied keywords appear in the
 *     visible body text? (1+ match = TRUE; otherwise FALSE)
 *
 * Output: data/promise-source-verification.json
 *
 * Per-URL keyword tests come from the rating's promise key (e.g.
 * "bjp:1" → ["PMGKAY", "Garib Kalyan Anna Yojana", "free ration"]).
 */

import { chromium } from "playwright"
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, "..", "data", "promise-source-verification.json")

// Direct keyword lookup per promise key. Lowercase substrings.
const KEYWORDS = {
  "bjp:1": ["pmgkay", "garib kalyan", "free ration", "five year", "2028"],
  "bjp:2": ["pmay", "pradhan mantri awas", "3 crore", "houses"],
  "bjp:3": ["surya ghar", "rooftop solar", "muft bijli"],
  "bjp:4": ["lakhpati didi", "1 crore", "3 crore"],
  "bjp:5": ["nari shakti", "women's reservation", "128th amendment", "delimitation"],
  "bjp:6": ["uniform civil code", "ucc", "uttarakhand"],
  "bjp:7": ["one nation", "129th amendment", "simultaneous elections", "jpc"],
  "bjp:8": ["3rd largest", "third largest", "imf", "indian economy"],
  "inc:1": ["gruha lakshmi", "karnataka", "mahalakshmi", "₹2,000"],
  "inc:4": ["caste census", "census 2027", "enumeration"],
  "inc:7": ["jammu", "kashmir", "statehood"],
  "aap:1": ["delhi", "election", "statehood"],
  "dmk:2": ["neet", "tamil nadu", "president", "assent"],
  "dmk:3": ["caa", "citizenship amendment", "rules"],
  "dmk:4": ["unified pension", "ups", "old pension"],
  "dmk:6": ["finance commission", "16th", "states' share"],
  "aitc:4": ["caa", "citizenship amendment", "rules"],
  "aitc:10": ["caste census", "census 2027"],
  "ncp-sp:8": ["one nation", "129th", "jpc"],
  "shs-ubt:1": ["mahayuti", "maharashtra", "assembly election"],
  "shs-ubt:7": ["dharavi", "redevelopment", "adani"],
  "ysrcp:2": ["amaravati", "capital", "andhra"],
}

// Pull URLs from promiseStatuses.ts at runtime (no need to parse — just import
// the JSON-like object via a child eval).
const ratingsPath = join(__dirname, "..", "lib", "db", "promiseStatuses.ts")

import { readFileSync } from "node:fs"
const src = readFileSync(ratingsPath, "utf8")

// Extract URLs along with their owning key by scanning the file
const blocks = src.split(/"([a-z-]+:\d+)":\s*\{/).slice(1)
const items = []
for (let i = 0; i < blocks.length; i += 2) {
  const key = blocks[i]
  const body = blocks[i + 1] ?? ""
  const urls = [...body.matchAll(/https?:\/\/[^"\s]+/g)].map((m) => m[0].replace(/[,)]+$/, ""))
  for (const url of urls) items.push({ key, url })
}

console.log(`Found ${items.length} source URLs across ${new Set(items.map((i) => i.key)).size} promises.`)

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  })

  const results = []
  for (let i = 0; i < items.length; i++) {
    const { key, url } = items[i]
    const r = { key, url, status: null, reachable: false, page_title: null, keywords_match: null, error: null }
    const page = await ctx.newPage()
    try {
      const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 })
      r.status = resp?.status() ?? null
      r.reachable = (r.status ?? 0) >= 200 && (r.status ?? 0) < 400
      if (r.reachable) {
        await page.waitForTimeout(800)
        r.page_title = (await page.title()).slice(0, 160)
        const body = (await page.evaluate(() => document.body?.innerText ?? "")).toLowerCase()
        const kws = KEYWORDS[key] || []
        r.keywords_match = kws.length === 0 ? null : kws.some((k) => body.includes(k))
      }
      console.log(`  [${i+1}/${items.length}] ${r.status} ${r.keywords_match === true ? "✓kw" : r.keywords_match === false ? "✗kw" : ""} ${url.slice(0, 70)}`)
    } catch (e) {
      r.error = e.message.slice(0, 200)
      console.log(`  [${i+1}/${items.length}] ERR ${url.slice(0, 70)}: ${r.error.slice(0, 60)}`)
    } finally {
      await page.close()
    }
    results.push(r)
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(results, null, 2), "utf8")
  await browser.close()

  // Summary
  const total = results.length
  const ok = results.filter((r) => r.reachable).length
  const kwOk = results.filter((r) => r.keywords_match === true).length
  const dead = results.filter((r) => !r.reachable).length
  console.log("\nVerification summary:")
  console.log(`  Total URLs:           ${total}`)
  console.log(`  Reachable (2xx/3xx):  ${ok}`)
  console.log(`  Keywords matched:     ${kwOk}`)
  console.log(`  Dead links:           ${dead}`)
  console.log(`  Written to ${OUT_PATH}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
