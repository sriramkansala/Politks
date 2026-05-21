#!/usr/bin/env node
/**
 * verify-bill-story-sources.mjs — Validate every source URL in
 * lib/db/billStory.ts using Playwright (handles JS-rendered sites like PIB,
 * PRS, and major news domains that may block plain curl).
 *
 *   $ node scripts/verify-bill-story-sources.mjs
 *
 * For each URL found inside `stakeholders[].source`, `events[].source`, or
 * `further_reading[].source` we record:
 *   - status: HTTP code (200 / 404 / etc.)
 *   - reachable: bool (no DNS error, no timeout, status 2xx/3xx)
 *   - final_url: resolved URL after redirects
 *   - page_title: <title> tag content (first 160 chars)
 *   - keywords_match: whether any meaningful token from the entry's headline
 *     / actor / position appeared in the visible body text. `null` when we
 *     could not extract enough signal to test.
 *
 * Failures (404 / 403 / timeout / DNS) are flagged so the user can rewrite
 * the source entry as `source_pending: true` in billStory.ts.
 *
 * Output: data/bill-story-source-verification.json
 *
 * NB: this script does NOT mutate billStory.ts. It produces a report. The
 * user reviews the report and edits billStory.ts manually (mirroring the
 * verify-promise-sources.mjs workflow).
 */

import { chromium } from "playwright"
import { writeFile, mkdir } from "node:fs/promises"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const STORY_PATH = join(__dirname, "..", "lib", "db", "billStory.ts")
const OUT_PATH   = join(__dirname, "..", "data", "bill-story-source-verification.json")

const TIMEOUT_MS = 10_000

// ─── Parse billStory.ts ──────────────────────────────────────────────────────
// We don't actually execute the TS; we walk the file in source order and
// associate every `source: "..."` line with the nearest preceding `headline`,
// `actor`, or `position` field. This is brittle but mirrors the approach used
// by scripts/verify-promise-sources.mjs and is fine for a verification pass.

const src = readFileSync(STORY_PATH, "utf8")
const lines = src.split(/\r?\n/)

const items = [] // { bill, kind, label, url, line }
let currentBill = null
const billDeclRe = /^const\s+([A-Z0-9_]+):\s*BillStory\s*=/

// Map UPPER_SNAKE const names to the slug key seen in BILL_STORIES (the file's
// trailing object literal). This lets the report key match what the app uses.
const slugMap = {}
{
  const slugBlockMatch = src.match(/export const BILL_STORIES[\s\S]*?\{([\s\S]*?)\n\}/)
  if (slugBlockMatch) {
    const body = slugBlockMatch[1]
    for (const m of body.matchAll(/"([^"]+)":\s*([A-Z0-9_]+)/g)) {
      slugMap[m[2]] = m[1]
    }
  }
}

let pending = { headline: null, actor: null, position: null, domain: null }

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  const decl = line.match(billDeclRe)
  if (decl) {
    currentBill = slugMap[decl[1]] || decl[1]
    pending = { headline: null, actor: null, position: null, domain: null }
    continue
  }

  // Capture descriptive fields so we know what the source is supposed to be.
  // Multi-line strings are not handled — the verifier only needs a few tokens.
  const headline = line.match(/headline:\s*"([^"]+)"/)
  if (headline) pending.headline = headline[1]
  const actor    = line.match(/actor:\s*"([^"]+)"/)
  if (actor) pending.actor = actor[1]
  const position = line.match(/position:\s*"([^"]+)"/)
  if (position) pending.position = position[1]
  const domain   = line.match(/domain:\s*"([^"]+)"/)
  if (domain) pending.domain = domain[1]

  // Source URL on this line.
  const sourceMatch = line.match(/source:\s*"(https?:\/\/[^"]+)"/)
  if (sourceMatch && currentBill) {
    const url = sourceMatch[1]
    const label = pending.headline || pending.actor || pending.domain || ""
    // Best-guess of the entry kind based on the nearest descriptive field.
    const kind = pending.headline && pending.domain ? "further_reading"
               : pending.headline ? "event"
               : pending.actor    ? "stakeholder"
               : "unknown"
    items.push({
      bill: currentBill,
      kind,
      label: label.slice(0, 160),
      context: (pending.position || "").slice(0, 200),
      url,
      line: i + 1,
    })
    // Reset narrower fields after consuming, but keep `domain` since it can
    // straddle multiple lines within a further_reading entry.
    pending.headline = null
    pending.actor    = null
    pending.position = null
  }

  // A closing `}` for an object literal — clear the pending descriptive fields
  // so the next entry starts fresh.
  if (line.trim() === "}," || line.trim() === "},") {
    pending = { headline: null, actor: null, position: null, domain: null }
  }
}

console.log(
  `Found ${items.length} source URLs across ${new Set(items.map((i) => i.bill)).size} bill stories.`
)

// ─── Keyword extraction for body-text match ──────────────────────────────────

const STOP = new Set([
  "the","and","for","with","that","this","from","into","over","under","about",
  "their","there","they","these","those","what","when","where","which","while",
  "have","been","will","would","could","should","does","did","more","most",
  "some","such","than","then","upon","than","2019","2020","2021","2022","2023",
  "2024","2025","2026","https","http","www","com","org","gov","net","india",
])

function tokensFor(item) {
  const txt = `${item.label} ${item.context}`.toLowerCase()
  const words = txt.match(/[a-z][a-z0-9-]{3,}/g) || []
  const uniq = Array.from(new Set(words.filter((w) => !STOP.has(w))))
  return uniq.slice(0, 8) // cap noise
}

// ─── Run Playwright pass ─────────────────────────────────────────────────────

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  })

  const results = []
  for (let i = 0; i < items.length; i++) {
    const it = items[i]
    const r = {
      bill: it.bill,
      kind: it.kind,
      label: it.label,
      url: it.url,
      line: it.line,
      status: null,
      reachable: false,
      final_url: null,
      page_title: null,
      keywords_match: null,
      keywords_tested: [],
      should_mark_pending: false,
      error: null,
    }

    const page = await ctx.newPage()
    try {
      const resp = await page.goto(it.url, { waitUntil: "domcontentloaded", timeout: TIMEOUT_MS })
      r.status = resp?.status() ?? null
      r.final_url = page.url()
      r.reachable = (r.status ?? 0) >= 200 && (r.status ?? 0) < 400
      if (r.reachable) {
        await page.waitForTimeout(600)
        try { r.page_title = (await page.title()).slice(0, 160) } catch { /* ignore */ }
        try {
          const body = (await page.evaluate(() => document.body?.innerText ?? "")).toLowerCase()
          const kws = tokensFor(it)
          r.keywords_tested = kws
          r.keywords_match = kws.length === 0 ? null : kws.some((k) => body.includes(k))
        } catch { /* ignore */ }
      }
    } catch (e) {
      r.error = (e && e.message ? e.message : String(e)).slice(0, 220)
    } finally {
      await page.close()
    }

    // Any 4xx / 5xx / DNS / timeout is a candidate for source_pending: true.
    r.should_mark_pending = !r.reachable

    const tag = r.reachable
      ? (r.keywords_match === true ? "OK" : r.keywords_match === false ? "OK?" : "OK")
      : "DEAD"
    console.log(
      `  [${i + 1}/${items.length}] ${tag} ${r.status ?? "—"} ${it.bill} (${it.kind}) ${it.url.slice(0, 70)}`
    )

    results.push(r)
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(results, null, 2), "utf8")
  await browser.close()

  // Summary
  const total = results.length
  const ok = results.filter((r) => r.reachable).length
  const kwOk = results.filter((r) => r.keywords_match === true).length
  const kwNo = results.filter((r) => r.keywords_match === false).length
  const dead = results.filter((r) => !r.reachable).length
  console.log("\nBill-story source verification summary:")
  console.log(`  Total URLs:           ${total}`)
  console.log(`  Reachable (2xx/3xx):  ${ok}`)
  console.log(`  Keywords matched:     ${kwOk}`)
  console.log(`  Keywords NOT matched: ${kwNo} (manual review — may still be the right page)`)
  console.log(`  Dead links:           ${dead} (candidates for source_pending: true)`)
  console.log(`  Written to ${OUT_PATH}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
