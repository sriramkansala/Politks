#!/usr/bin/env node
/**
 * scrape-myneta-batch.mjs — Batch scraper for 2024 LS WINNERS from myneta.info
 *
 *   $ node scripts/scrape-myneta-batch.mjs
 *
 * Strategy:
 *   - Fetches the winner_analyzed summary pages (28 pages × ~20 rows = 543 winners)
 *   - Extracts all data directly from the table rows (no need to visit individual pages)
 *   - Saves to data/myneta-2024-ls.json
 *
 * Fields per record:
 *   { myneta_id, name, party, constituency, state (derived), age, education,
 *     assets_inr, liabilities_inr, criminal_cases_any, criminal_cases_serious,
 *     is_winner, fetched_at }
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
const OUT_PATH = join(PROJECT_ROOT, "data", "myneta-2024-ls.json")

const BASE = "https://myneta.info/LokSabha2024"
const CRAWL_DELAY_MS = 3_000
const UA = "Mozilla/5.0 (BharatManifestoWatch civic-research bot; +github.com/sriramkansala/Politks)"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchHtml(url) {
  process.stdout.write(`   GET ${url}\n`)
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.text()
}

/**
 * Parse a rupee figure like "Rs 1,23,45,678" → 12345678
 */
function parseINR(text) {
  if (!text) return null
  const clean = text.replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
  const m = clean.match(/Rs\s*([\d,]+)/i)
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ""))
  return Number.isFinite(n) ? n : null
}

/**
 * Parse criminal cases from a table cell.
 * The cell may contain plain "0" or a red badge "<span>1</span>" for cases > 0.
 */
function parseCriminalCases(cell) {
  if (!cell) return 0
  const text = cell.textContent.trim()
  const m = text.match(/(\d+)/)
  return m ? Number(m[1]) : 0
}

/**
 * Parse one page of the winner summary table.
 * Returns array of records.
 */
function parsePage(html) {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const records = []

  // Find the main summary table
  const table = doc.querySelector("table.w3-table.w3-bordered")
  if (!table) {
    console.warn("   ⚠ Could not find summary table on this page")
    return records
  }

  const rows = table.querySelectorAll("tr")
  for (const row of rows) {
    const cells = row.querySelectorAll("td")
    if (cells.length < 7) continue // skip header or malformed rows

    // Cell 0: Sno
    // Cell 1: Candidate name + link
    // Cell 2: Constituency
    // Cell 3: Party
    // Cell 4: Criminal Cases
    // Cell 5: Education
    // Cell 6: Total Assets
    // Cell 7: Liabilities

    const candidateCell = cells[1]
    const link = candidateCell.querySelector("a")
    let myneta_id = null
    let myneta_url = null
    if (link) {
      const href = link.getAttribute("href") || ""
      const m = href.match(/candidate_id=(\d+)/i)
      if (m) {
        myneta_id = m[1]
        myneta_url = `${BASE}/candidate.php?candidate_id=${m[1]}`
      }
    }

    const name = (link?.textContent || candidateCell.textContent).trim()
    const constituency = cells[2].textContent.trim()
    const party = cells[3].textContent.trim()
    const criminal_cases_any = parseCriminalCases(cells[4])
    const education = cells[5].textContent.trim() || null
    const assets_inr = parseINR(cells[6].innerHTML)
    const liabilities_inr = parseINR(cells[7]?.innerHTML ?? "")

    records.push({
      myneta_id,
      myneta_url,
      name,
      party,
      constituency,
      state: null,           // not available in the summary table; can be derived later
      age: null,             // not in summary table
      education,
      assets_inr,
      liabilities_inr,
      criminal_cases_any,
      criminal_cases_serious: null, // not available in summary table without individual page visit
      is_winner: true,
      fetched_at: new Date().toISOString(),
    })
  }

  return records
}

/**
 * Determine total pages from the pagination links.
 */
function getTotalPages(html) {
  // Matches both single-quote and double-quote variants:
  //   page=28'> Last   OR   page=28"> Last
  const m = html.match(/page=(\d+)[^>]*>\s*Last\s*</i)
  if (m) return Number(m[1])
  // Fallback: parse "X pages" text
  const m2 = html.match(/of\s*<strong>(\d+)<\/strong>\s*pages/i)
  return m2 ? Number(m2[1]) : 1
}

async function loadExisting() {
  if (!existsSync(OUT_PATH)) return []
  try {
    const raw = await readFile(OUT_PATH, "utf8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function save(records) {
  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(records, null, 2), "utf8")
}

async function main() {
  console.log("MyNeta 2024 LS WINNER batch scraper starting.\n")
  console.log(`Output: ${OUT_PATH}`)
  console.log(`Crawl delay: ${CRAWL_DELAY_MS / 1000}s between pages\n`)

  // Load page 1 first to determine total pages
  const firstUrl = `${BASE}/index.php?action=summary&subAction=winner_analyzed&sort=candidate&page=1`
  const firstHtml = await fetchHtml(firstUrl)
  const totalPages = getTotalPages(firstHtml)
  console.log(`   Total pages: ${totalPages}\n`)

  const allRecords = []
  const seenIds = new Set()

  // Process page 1
  const page1Records = parsePage(firstHtml)
  for (const r of page1Records) {
    if (r.myneta_id && !seenIds.has(r.myneta_id)) {
      seenIds.add(r.myneta_id)
      allRecords.push(r)
    }
  }
  console.log(`   Page 1: ${page1Records.length} records (total so far: ${allRecords.length})`)

  // Process pages 2..totalPages
  for (let page = 2; page <= totalPages; page++) {
    await sleep(CRAWL_DELAY_MS)
    const url = `${BASE}/index.php?action=summary&subAction=winner_analyzed&sort=candidate&page=${page}`
    try {
      const html = await fetchHtml(url)
      const pageRecords = parsePage(html)
      for (const r of pageRecords) {
        if (r.myneta_id && !seenIds.has(r.myneta_id)) {
          seenIds.add(r.myneta_id)
          allRecords.push(r)
        }
      }
      console.log(`   Page ${page}/${totalPages}: ${pageRecords.length} records (total so far: ${allRecords.length})`)

      // Save checkpoint every 5 pages
      if (page % 5 === 0) {
        await save(allRecords)
        console.log(`   [checkpoint saved — ${allRecords.length} records]`)
      }
    } catch (e) {
      console.error(`   Page ${page}: ERROR — ${e.message}`)
    }
  }

  await save(allRecords)
  console.log(`\nDone. ${allRecords.length} winner records written to:\n  ${OUT_PATH}`)

  // Summary stats
  const withAssets = allRecords.filter((r) => r.assets_inr !== null).length
  const withCriminal = allRecords.filter((r) => r.criminal_cases_any > 0).length
  console.log(`\nSummary:`)
  console.log(`  Records with asset data: ${withAssets}`)
  console.log(`  Records with criminal cases: ${withCriminal}`)
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})
