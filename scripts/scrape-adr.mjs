#!/usr/bin/env node
/**
 * scrape-adr.mjs — Build adr-2024.json from MyNeta/ADR data.
 *
 *   $ node scripts/scrape-adr.mjs
 *
 * Strategy:
 *   1. Fetch the MyNeta LS 2024 homepage to build a constituency→state mapping
 *   2. Scrape the "winner_serious_crime" summary table to get serious criminal case data
 *   3. Merge with existing data/myneta-2024-ls.json
 *   4. Save to data/adr-2024.json
 *
 * Polite: 3s delay between page fetches.
 */

import { JSDOM } from "jsdom"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, "..")
const MYNETA_JSON = join(PROJECT_ROOT, "data", "myneta-2024-ls.json")
const OUT_PATH = join(PROJECT_ROOT, "data", "adr-2024.json")

const BASE = "https://myneta.info/LokSabha2024"
const CRAWL_DELAY_MS = 3_000
const UA = "Mozilla/5.0 (BharatManifestoWatch civic-research bot; +github.com/sriramkansala/Politks)"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchHtml(url) {
  process.stdout.write(`   GET ${url}\n`)
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml",
    },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.text()
}

function getTotalPages(html) {
  const m = html.match(/page=(\d+)[^>]*>\s*Last\s*</i)
  if (m) return Number(m[1])
  const m2 = html.match(/of\s*<strong>(\d+)<\/strong>\s*pages/i)
  return m2 ? Number(m2[1]) : 1
}

function parseINR(html) {
  if (!html) return null
  const clean = html.replace(/&nbsp;/g, " ").replace(/\s+/g, " ")
  const m = clean.match(/Rs\s*([\d,]+)/i)
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ""))
  return Number.isFinite(n) ? n : null
}

/**
 * Build constituency→state map from the MyNeta LS 2024 homepage.
 * The page lists state sections each containing constituency links.
 */
async function buildConstituencyStateMap() {
  console.log("\n[Step 1] Building constituency → state map from homepage...")
  const html = await fetchHtml(`${BASE}/`)
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const map = {}

  // The page has state sections; each section starts with an "ALL CONSTITUENCIES" link
  // followed by constituency links. We parse the raw HTML to get state names.
  // Pattern: state_id=N pairs with a block of constituency links.
  // We'll parse each "state block" from the raw HTML using regex to extract the state name.

  // State blocks look like:
  //   href=index.php?action=show_constituencies&state_id=N
  //   ... constituencyLinks ...
  //   STATE_NAME appears near the top of each block as the <h3> or strong text

  // Alternative: use the title/text adjacent to state_id links
  // The homepage has a pattern: <strong>STATE_NAME</strong> followed by constituencies
  const rawHtml = html

  // Extract each state section using regex
  // Each state section: href=...state_id=N ... followed by constituency names
  // The state name appears as text content of an adjacent element
  // Let's parse the table structure

  // The page has repeated patterns like:
  // <tr><td colspan=2><strong>STATE NAME</strong></td></tr>
  // <tr><td>... constituency links ...</td></tr>

  const stateBlocks = rawHtml.split(/show_constituencies&state_id=\d+/)
  // Find state names by looking at <strong> tags before each state_id link
  const stateNameMatches = [...rawHtml.matchAll(/<strong>\s*([A-Z &]+)\s*<\/strong>/gi)]

  // Also try: table rows with colspan that contain state names
  const rows = doc.querySelectorAll("tr")
  let currentState = null
  let stateCount = 0

  for (const row of rows) {
    const colspan = row.querySelector("td[colspan]")
    if (colspan) {
      const text = colspan.textContent.trim().toUpperCase()
      // State names are uppercase and reasonably long
      if (text.length > 3 && text.length < 60 && /^[A-Z &()\-]+$/.test(text)) {
        currentState = text
        stateCount++
      }
    }
    if (!currentState) continue

    // Constituency links in this row
    const links = row.querySelectorAll('a[href*="show_candidates"]')
    for (const link of links) {
      const name = link.textContent.trim().toUpperCase()
      if (name) map[name] = currentState
    }
  }

  console.log(`   Built map: ${Object.keys(map).length} constituencies across ${stateCount} states`)
  return map
}

/**
 * Parse the winner_serious_crime summary table across all pages.
 * Returns map: myneta_id → criminal_cases_serious count
 */
async function scrapeSerousCrimesWinners() {
  console.log("\n[Step 2] Scraping serious criminal cases for winners...")
  const seriousMap = {} // myneta_id → count

  const firstUrl = `${BASE}/index.php?action=summary&subAction=winner_serious_crime&sort=candidate&page=1`
  const firstHtml = await fetchHtml(firstUrl)
  const totalPages = getTotalPages(firstHtml)
  console.log(`   Total pages: ${totalPages}`)

  function parseSerousPage(html) {
    const dom = new JSDOM(html)
    const doc = dom.window.document
    const table = doc.querySelector("table.w3-table.w3-bordered")
    if (!table) return

    for (const row of table.querySelectorAll("tr")) {
      const cells = row.querySelectorAll("td")
      if (cells.length < 5) continue

      const link = cells[1].querySelector("a")
      if (!link) continue
      const href = link.getAttribute("href") || ""
      const m = href.match(/candidate_id=(\d+)/i)
      if (!m) continue
      const id = m[1]

      const casesText = cells[4].textContent.trim()
      const cm = casesText.match(/(\d+)/)
      if (cm) seriousMap[id] = Number(cm[1])
    }
  }

  parseSerousPage(firstHtml)

  for (let page = 2; page <= totalPages; page++) {
    await sleep(CRAWL_DELAY_MS)
    const url = `${BASE}/index.php?action=summary&subAction=winner_serious_crime&sort=candidate&page=${page}`
    try {
      const html = await fetchHtml(url)
      parseSerousPage(html)
      console.log(`   Page ${page}/${totalPages}: ${Object.keys(seriousMap).length} serious cases total`)
    } catch (e) {
      console.error(`   Page ${page}: ${e.message}`)
    }
  }

  console.log(`   Found serious cases for ${Object.keys(seriousMap).length} winners`)
  return seriousMap
}

/**
 * Try to fetch individual candidate pages in batches to get age and state.
 * We only do the first 50 to stay polite, then fallback to constituency map.
 */
async function enrichSample(records, constituencyStateMap) {
  console.log("\n[Step 3] Enriching first 50 records with age/state from individual pages...")

  const sample = records.slice(0, 50)
  let enriched = 0

  for (const rec of sample) {
    if (!rec.myneta_url) continue
    await sleep(CRAWL_DELAY_MS)
    try {
      const html = await fetchHtml(rec.myneta_url)
      // Extract state from title: "NAME(PARTY):Constituency- NAME(STATE)"
      const titleMatch = html.match(/:Constituency-[^(]*\(([^)]+)\)/i)
      if (titleMatch) {
        rec.state = titleMatch[1].trim().toUpperCase()
      }
      // Extract age
      const ageMatch = html.match(/<b>Age:<\/b>\s*(\d+)/i)
      if (ageMatch) rec.age = Number(ageMatch[1])

      enriched++
      console.log(`   [${enriched}] ${rec.name}: state=${rec.state || "?"}, age=${rec.age || "?"}`)
    } catch (e) {
      console.error(`   ${rec.name}: ${e.message}`)
    }
  }
  console.log(`   Enriched ${enriched} records with individual page data`)
}

async function main() {
  console.log("ADR/MyNeta 2024 LS data enrichment script starting.\n")
  console.log(`Output: ${OUT_PATH}\n`)

  // Load existing myneta data
  let baseRecords = []
  if (existsSync(MYNETA_JSON)) {
    const raw = await readFile(MYNETA_JSON, "utf8")
    baseRecords = JSON.parse(raw)
    console.log(`Loaded ${baseRecords.length} records from myneta-2024-ls.json`)
  } else {
    console.log("Warning: myneta-2024-ls.json not found — starting from scratch")
  }

  // Step 1: Build constituency→state map
  const constituencyStateMap = await buildConstituencyStateMap()
  await sleep(CRAWL_DELAY_MS)

  // Apply state from constituency map to all records
  let stateApplied = 0
  for (const rec of baseRecords) {
    if (!rec.state && rec.constituency) {
      const key = rec.constituency.toUpperCase().replace(/\s+/g, " ").trim()
      // Try exact match, then strip suffixes like (SC), (ST)
      const state = constituencyStateMap[key]
        || constituencyStateMap[key.replace(/\s*\([^)]+\)\s*$/, "").trim()]
      if (state) {
        rec.state = state
        stateApplied++
      }
    }
  }
  console.log(`\nApplied state from constituency map to ${stateApplied} records`)

  // Step 2: Get serious criminal cases data
  const seriousMap = await scrapeSerousCrimesWinners()

  // Merge serious cases into records
  let seriousApplied = 0
  for (const rec of baseRecords) {
    if (rec.myneta_id && seriousMap[rec.myneta_id] !== undefined) {
      rec.criminal_cases_serious = seriousMap[rec.myneta_id]
      seriousApplied++
    }
  }
  console.log(`\nApplied serious case counts to ${seriousApplied} records`)

  // Step 3: Enrich sample with age/state from individual pages
  await sleep(CRAWL_DELAY_MS)
  const stillNoState = baseRecords.filter((r) => !r.state)
  if (stillNoState.length > 0) {
    await enrichSample(stillNoState, constituencyStateMap)
  }

  // Build final ADR output with enriched data + summary stats
  const summary = {
    total_winners: baseRecords.length,
    with_state: baseRecords.filter((r) => r.state).length,
    with_age: baseRecords.filter((r) => r.age !== null).length,
    with_assets: baseRecords.filter((r) => r.assets_inr !== null).length,
    with_any_criminal_cases: baseRecords.filter((r) => r.criminal_cases_any > 0).length,
    with_serious_criminal_cases: baseRecords.filter((r) => r.criminal_cases_serious > 0).length,
    crorepati_count: baseRecords.filter((r) => r.assets_inr && r.assets_inr >= 10_000_000).length,
    generated_at: new Date().toISOString(),
    source: "https://myneta.info/LokSabha2024 (ADR open data platform)",
  }

  const output = {
    meta: {
      description: "2024 Lok Sabha General Election — Winner background data from ADR/MyNeta",
      election: "Lok Sabha 2024",
      source_url: "https://myneta.info/LokSabha2024/",
      adr_url: "https://adrindia.org",
      scraped_at: new Date().toISOString(),
    },
    summary,
    winners: baseRecords,
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(output, null, 2), "utf8")

  console.log(`\nDone. ${baseRecords.length} records written to:\n  ${OUT_PATH}`)
  console.log("\nSummary:")
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  ${k}: ${v}`)
  }
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})
