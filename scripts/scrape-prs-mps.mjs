#!/usr/bin/env node
/**
 * scrape-prs-mps.mjs — Scrape 18th Lok Sabha MPs from prsindia.org/mptrack.
 *
 *   $ node scripts/scrape-prs-mps.mjs
 *
 * Outputs:  data/prs-mps.json   (one record per MP)
 *
 * Behaviour:
 * - Respects PRS's robots.txt Crawl-delay: 10 (sleeps 10s between requests).
 * - Paginates the listing pages (~61 pages × 9 MPs/page).
 * - Visits each individual MP page for attendance % + session breakdown.
 * - Resumes from data/prs-mps.json if already partially populated.
 * - Politely identifies itself in the User-Agent.
 *
 * Total runtime: ~100 minutes on first run. Resumable.
 */

import { JSDOM } from "jsdom"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, "..")
const OUT_PATH = join(PROJECT_ROOT, "data", "prs-mps.json")

const BASE = "https://prsindia.org"
const LIST_URL = (page) => `${BASE}/mptrack/18th-lok-sabha?page=${page}`
const MP_URL = (slug) => `${BASE}/mptrack/18th-lok-sabha/${slug}`
const CRAWL_DELAY_MS = 10_000
const UA =
  "Mozilla/5.0 (BharatManifestoWatch civic-research bot; +https://github.com/sriramkansala/Politks)"

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchHtml(url) {
  process.stdout.write(`   GET ${url}\n`)
  const res = await fetch(url, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.text()
}

function parseListing(html) {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const rows = []
  // PRS listing rows are in a results table; each row has an <a> link to /mptrack/18th-lok-sabha/<slug>
  const links = doc.querySelectorAll('a[href*="/mptrack/18th-lok-sabha/"]')
  for (const a of links) {
    const href = a.getAttribute("href") || ""
    const m = href.match(/\/mptrack\/18th-lok-sabha\/([^/?#]+)$/)
    if (!m) continue
    const slug = m[1]
    if (slug === "" || slug === "18th-lok-sabha") continue
    if (!rows.find((r) => r.prs_slug === slug)) {
      rows.push({ prs_slug: slug, name: a.textContent?.trim() ?? slug })
    }
  }
  return rows
}

function parseMpProfile(html, slug) {
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const text = doc.body.textContent ?? ""

  // Try to pull labelled stats. PRS pages show: Attendance | Debates | Questions | Bills
  function num(label) {
    const re = new RegExp(label + "[\\s\\S]{0,80}?([0-9]+(?:\\.[0-9]+)?)\\s*%?", "i")
    const m = text.match(re)
    return m ? Number(m[1]) : null
  }

  const attendance_pct = num("Attendance")
  const debates_participated = num("Debates")
  const questions_asked = num("Questions")
  const private_member_bills = num("Private Member")

  // Photo URL
  let photo_url = null
  const img = doc.querySelector('img[src*="profile_image"]')
  if (img) photo_url = new URL(img.getAttribute("src"), BASE).toString()

  // Party / Constituency / State — usually in a sidebar
  function field(label) {
    const re = new RegExp(label + "\\s*[:\\-]\\s*([^\\n]+)", "i")
    const m = text.match(re)
    return m ? m[1].trim().split("\n")[0].slice(0, 120) : null
  }
  const party_name = field("Party")
  const constituency = field("Constituency")
  const state = field("State")

  // Per-session attendance: scan for "Session" followed by a percent.
  const session_attendance = {}
  const sessRe =
    /([A-Z][a-z]+ Session (?:of [\w ]+)?[\w ]*?\d{4})[\s\S]{0,40}?([0-9]+(?:\.[0-9]+)?)\s*%/g
  let sm
  while ((sm = sessRe.exec(text)) !== null) {
    const label = sm[1].trim().replace(/\s+/g, " ")
    const pct = Number(sm[2])
    if (!Number.isNaN(pct) && pct >= 0 && pct <= 100) {
      session_attendance[label] = pct
    }
  }

  return {
    prs_slug: slug,
    party_name,
    constituency,
    state,
    attendance_pct,
    questions_asked,
    debates_participated,
    private_member_bills,
    photo_url,
    session_attendance,
    fetched_at: new Date().toISOString(),
  }
}

async function loadProgress() {
  if (!existsSync(OUT_PATH)) return { mps: [], done: new Set() }
  const raw = await readFile(OUT_PATH, "utf8")
  const data = JSON.parse(raw)
  const done = new Set(data.map((m) => m.prs_slug))
  return { mps: data, done }
}

async function save(mps) {
  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(mps, null, 2), "utf8")
}

async function main() {
  console.log("PRS scraper starting. Crawl-delay: 10s. Resumable.\n")

  let { mps, done } = await loadProgress()
  console.log(`Resuming with ${mps.length} MPs already saved.\n`)

  // 1) Walk listing pages to discover all MP slugs
  const discovered = new Map(mps.map((m) => [m.prs_slug, m]))
  for (let page = 1; page <= 120; page++) {
    try {
      const html = await fetchHtml(LIST_URL(page))
      const rows = parseListing(html)
      if (rows.length === 0) {
        console.log(`   (no more MPs at page ${page} — stopping pagination)`)
        break
      }
      let added = 0
      for (const r of rows) {
        if (!discovered.has(r.prs_slug)) {
          discovered.set(r.prs_slug, { ...r, fetched_at: null })
          added++
        }
      }
      console.log(`   page ${page}: ${rows.length} rows (${added} new)`)
    } catch (e) {
      console.error(`   page ${page} failed: ${e.message}`)
    }
    await sleep(CRAWL_DELAY_MS)
  }

  console.log(`\nDiscovered ${discovered.size} MPs. Fetching individual profiles…\n`)

  // 2) Visit each MP page that isn't already complete
  const all = Array.from(discovered.values())
  for (let i = 0; i < all.length; i++) {
    const stub = all[i]
    if (done.has(stub.prs_slug) && stub.attendance_pct != null) continue

    try {
      const html = await fetchHtml(MP_URL(stub.prs_slug))
      const profile = parseMpProfile(html, stub.prs_slug)
      const merged = { ...stub, ...profile }
      discovered.set(stub.prs_slug, merged)
      done.add(stub.prs_slug)

      // Persist after each successful fetch (resumable)
      await save(Array.from(discovered.values()))
      console.log(
        `   [${i + 1}/${all.length}] ${stub.prs_slug}  att=${profile.attendance_pct ?? "—"}%  Q=${profile.questions_asked ?? "—"}`
      )
    } catch (e) {
      console.error(`   [${i + 1}/${all.length}] ${stub.prs_slug}: ${e.message}`)
    }
    await sleep(CRAWL_DELAY_MS)
  }

  await save(Array.from(discovered.values()))
  console.log(`\nDone. ${discovered.size} MPs written to ${OUT_PATH}.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
