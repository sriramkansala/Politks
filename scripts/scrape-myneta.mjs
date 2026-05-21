#!/usr/bin/env node
/**
 * scrape-myneta.mjs — Pull 2024 LS candidate affidavits from myneta.info.
 *
 *   $ node scripts/scrape-myneta.mjs
 *
 * Outputs:  data/myneta-2024-ls.json
 *
 * Behaviour:
 * - 5s delay between requests (no robots.txt crawl-delay specified — default polite).
 * - Walks the 2024 LS candidate index, then each candidate page for assets / cases.
 * - Resumable.
 *
 * Schema (per record):
 *   { myneta_id, name, party, constituency, state, age, education,
 *     assets_inr, liabilities_inr, criminal_cases_any, criminal_cases_serious }
 */

import { JSDOM } from "jsdom"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, "..")
const OUT_PATH = join(PROJECT_ROOT, "data", "myneta-2024-ls.json")

const BASE = "https://myneta.info"
const INDEX_URL = `${BASE}/LokSabha2024/index.php?action=summary&subAction=winner_analysed&sort=candidate#summary`
const CRAWL_DELAY_MS = 5_000
const UA =
  "Mozilla/5.0 (BharatManifestoWatch civic-research bot; contact: github.com/sriramkansala/Politks)"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchHtml(url) {
  process.stdout.write(`   GET ${url}\n`)
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.text()
}

/**
 * Parse a rupee figure like "Rs 1,23,45,678 ~1 Crore+" → 12345678
 */
function parseINR(text) {
  if (!text) return null
  const m = text.match(/Rs\s*([\d,]+)/i)
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ""))
  return Number.isFinite(n) ? n : null
}

function parseIndex(html) {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const links = doc.querySelectorAll('a[href*="candidate.php?candidate_id="]')
  const ids = new Set()
  for (const a of links) {
    const href = a.getAttribute("href") || ""
    const m = href.match(/candidate_id=(\d+)/)
    if (m) ids.add(m[1])
  }
  return Array.from(ids)
}

function parseCandidate(html, id) {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const text = doc.body.textContent ?? ""

  const name = doc.querySelector("h2")?.textContent?.trim() ?? null

  function field(label) {
    const re = new RegExp(label + "\\s*[:\\-]?\\s*([^\\n<]+)", "i")
    const m = text.match(re)
    return m ? m[1].trim().slice(0, 200) : null
  }

  const party = field("Party")
  const constituency = field("Constituency")
  const state = field("State")
  const age = (() => {
    const m = text.match(/Age\s*[:\-]?\s*(\d+)/i)
    return m ? Number(m[1]) : null
  })()
  const education = field("Education")

  // Assets / liabilities
  const assets_inr = parseINR(
    text.match(/Total Assets[\s\S]{0,80}?Rs\s*[\d,]+/i)?.[0] ?? ""
  )
  const liabilities_inr = parseINR(
    text.match(/Liabilities[\s\S]{0,80}?Rs\s*[\d,]+/i)?.[0] ?? ""
  )

  // Criminal cases — count both totals
  const criminal_cases_any = (() => {
    const m = text.match(/(?:Number of Criminal Cases|Criminal Cases)\s*[:\-]?\s*(\d+)/i)
    return m ? Number(m[1]) : null
  })()
  const criminal_cases_serious = (() => {
    const m = text.match(/Serious[\s\S]{0,40}?(\d+)/i)
    return m ? Number(m[1]) : null
  })()

  return {
    myneta_id: id,
    myneta_url: `${BASE}/LokSabha2024/candidate.php?candidate_id=${id}`,
    name,
    party,
    constituency,
    state,
    age,
    education,
    assets_inr,
    liabilities_inr,
    criminal_cases_any,
    criminal_cases_serious,
    fetched_at: new Date().toISOString(),
  }
}

async function loadProgress() {
  if (!existsSync(OUT_PATH)) return { records: [], doneIds: new Set() }
  const raw = await readFile(OUT_PATH, "utf8")
  const records = JSON.parse(raw)
  return { records, doneIds: new Set(records.map((r) => r.myneta_id)) }
}

async function save(records) {
  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(records, null, 2), "utf8")
}

async function main() {
  console.log("MyNeta 2024 LS scraper starting. Crawl-delay: 5s. Resumable.\n")

  let { records, doneIds } = await loadProgress()
  console.log(`Resuming with ${records.length} candidates saved.\n`)

  console.log("Discovering candidate IDs from winners index…")
  const indexHtml = await fetchHtml(INDEX_URL)
  const candidateIds = parseIndex(indexHtml)
  console.log(`   discovered ${candidateIds.length} candidate IDs.\n`)
  await sleep(CRAWL_DELAY_MS)

  for (let i = 0; i < candidateIds.length; i++) {
    const id = candidateIds[i]
    if (doneIds.has(id)) continue

    try {
      const html = await fetchHtml(
        `${BASE}/LokSabha2024/candidate.php?candidate_id=${id}`
      )
      const rec = parseCandidate(html, id)
      records.push(rec)
      doneIds.add(id)
      await save(records)
      console.log(
        `   [${i + 1}/${candidateIds.length}] ${rec.name ?? id}  assets=${rec.assets_inr ?? "—"}  cases=${rec.criminal_cases_any ?? "—"}`
      )
    } catch (e) {
      console.error(`   [${i + 1}/${candidateIds.length}] ${id}: ${e.message}`)
    }
    await sleep(CRAWL_DELAY_MS)
  }

  console.log(`\nDone. ${records.length} candidates written to ${OUT_PATH}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
