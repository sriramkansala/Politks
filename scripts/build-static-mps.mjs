#!/usr/bin/env node
/**
 * build-static-mps.mjs — Merge data/prs-mps.json + data/myneta-2024-ls.json
 * into lib/db/staticMps.generated.ts (a TS module that exports the full
 * 543-MP dataset for the static fallback).
 *
 *   $ node scripts/build-static-mps.mjs
 *
 * After this runs, edit lib/db/staticTables.ts to import STATIC_MPS_GEN
 * from staticMps.generated.ts in addition to STATIC_MPS_BMW.
 */

import { readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

const PRS_PATH    = join(ROOT, "data", "prs-mps.json")
const MYNETA_PATH = join(ROOT, "data", "myneta-2024-ls.json")
const ADR_PATH    = join(ROOT, "data", "adr-2024.json")
const OUT_PATH    = join(ROOT, "lib", "db", "staticMps.generated.ts")

function pid(seed) {
  const h = (s, salt) => {
    let n = 0
    for (const c of s + salt) n = (n * 131 + c.charCodeAt(0)) >>> 0
    return n.toString(16).padStart(8, "0")
  }
  return (
    h(seed, "a") +
    "-" +
    h(seed, "b").slice(0, 4) +
    "-4" +
    h(seed, "c").slice(0, 3) +
    "-8" +
    h(seed, "d").slice(0, 3) +
    "-" +
    h(seed, "e") +
    h(seed, "f").slice(0, 4)
  )
}

function nameSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function readJson(p) {
  if (!existsSync(p)) {
    console.warn(`(skipping missing file: ${p})`)
    return []
  }
  return JSON.parse(await readFile(p, "utf8"))
}

async function main() {
  const prs = await readJson(PRS_PATH)
  const myn = await readJson(MYNETA_PATH)
  const adrRaw = await readJson(ADR_PATH)
  const adr = Array.isArray(adrRaw) ? adrRaw : (adrRaw.winners ?? [])

  console.log(`PRS:    ${prs.length} MPs`)
  console.log(`MyNeta: ${myn.length} candidates`)
  console.log(`ADR:    ${adr.length} records`)

  // Three lookup maps for MyNeta — tried in order:
  //  1. nameSlug(name)            — exact normalised name
  //  2. nameSlug(slug-derived)    — for PRS records with blank name field
  //  3. constituency (upper)      — last resort dedup by seat
  const mynByName = new Map()
  const mynByConstituency = new Map()
  for (const r of myn) {
    if (r.name) mynByName.set(nameSlug(r.name), r)
    if (r.constituency) mynByConstituency.set(r.constituency.toUpperCase().trim(), r)
  }

  // ADR lookup maps (same priority order)
  const adrByName = new Map()
  const adrByConstituency = new Map()
  for (const r of adr) {
    if (r.name) adrByName.set(nameSlug(r.name), r)
    if (r.constituency) adrByConstituency.set(r.constituency.toUpperCase().trim(), r)
  }

  // Helpers to clean PRS-scraped artifacts.
  function cleanText(s) {
    if (!s) return null
    // PRS listing pages render "Party Name ( 28 more MPs )" — strip that suffix
    return s.replace(/\s*\(\s*\d+\s*more\s*MPs?\s*\)\s*$/i, "").trim()
  }
  function slugToName(slug) {
    if (!slug) return ""
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }
  function stateToCode(state) {
    const clean = cleanText(state) ?? ""
    const map = {
      "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS",
      "Bihar": "BR", "Chhattisgarh": "CG", "Goa": "GA", "Gujarat": "GJ",
      "Haryana": "HR", "Himachal Pradesh": "HP", "Jharkhand": "JH",
      "Karnataka": "KA", "Kerala": "KL", "Madhya Pradesh": "MP",
      "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML",
      "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD", "Punjab": "PB",
      "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN",
      "Telangana": "TG", "Tripura": "TR", "Uttar Pradesh": "UP",
      "Uttarakhand": "UK", "West Bengal": "WB", "Delhi": "DL",
      "NCT of Delhi": "DL", "Chandigarh": "CH", "Puducherry": "PY",
      "Jammu & Kashmir": "JK", "Jammu and Kashmir": "JK",
      "Ladakh": "LA", "Andaman & Nicobar Islands": "AN",
      "Dadra and Nagar Haveli and Daman and Diu": "DN",
      "Lakshadweep": "LD",
    }
    return map[clean] ?? clean.slice(0, 2).toUpperCase()
  }
  function partyShort(party) {
    const clean = cleanText(party) ?? ""
    const aliases = {
      "Bharatiya Janata Party": "BJP",
      "Indian National Congress": "INC",
      "All India Trinamool Congress": "AITC",
      "Trinamool Congress": "AITC",
      "Samajwadi Party": "SP",
      "Dravida Munnetra Kazhagam": "DMK",
      "Janata Dal (United)": "JD(U)",
      "Janata Dal (Secular)": "JD(S)",
      "Shiv Sena": "SHS",
      "Shiv Sena (Uddhav Balasaheb Thackeray)": "SS(UBT)",
      "Nationalist Congress Party": "NCP",
      "Nationalist Congress Party (Sharadchandra Pawar)": "NCP(SP)",
      "Telugu Desam Party": "TDP",
      "Communist Party of India (Marxist)": "CPI(M)",
      "Communist Party of India": "CPI",
      "Aam Aadmi Party": "AAP",
      "All India Majlis-e-Ittehadul Muslimeen": "AIMIM",
      "Rashtriya Janata Dal": "RJD",
      "Yuvajana Sramika Rythu Congress Party": "YSRCP",
      "Bahujan Samaj Party": "BSP",
      "Lok Janshakti Party (Ram Vilas)": "LJP(RV)",
      "Indian Union Muslim League": "IUML",
      "Telangana Rashtra Samithi": "BRS",
      "Bharat Rashtra Samithi": "BRS",
      "Apna Dal (Soneylal)": "ADA",
      "Independent": "IND",
    }
    return aliases[clean] ?? clean
  }

  const merged = prs.map((p) => {
    const slug = p.prs_slug ?? nameSlug(p.name)
    // Try: 1) PRS name  2) slug-derived name  3) constituency seat
    const slugName = slugToName(slug)
    const constituency = (p.constituency ?? "").replace(/\s*\(\s*\d+\s*more\s*MPs?\s*\)\s*$/i, "").trim().toUpperCase()
    const m = mynByName.get(nameSlug(p.name))
           ?? mynByName.get(nameSlug(slugName))
           ?? mynByConstituency.get(constituency)
           ?? {}
    // ADR enriches criminal_cases_serious + state + age
    const a = adrByName.get(nameSlug(p.name))
           ?? adrByName.get(nameSlug(slugName))
           ?? adrByConstituency.get(constituency)
           ?? {}
    const resolvedName = (p.name && p.name.trim()) || slugToName(slug)
    return {
      id: pid("mp:18-ls:" + slug),
      name: resolvedName,
      prs_slug: slug,
      party_name: partyShort(p.party_name) || m.party || null,
      constituency: cleanText(p.constituency) ?? m.constituency ?? null,
      state_code: stateToCode(p.state) || m.state || null,
      photo_url: p.photo_url ?? null,
      lok_sabha_term: "18",
      attendance_pct: p.attendance_pct ?? null,
      questions_asked: p.questions_asked ?? null,
      debates_participated: p.debates_participated ?? null,
      private_member_bills: p.private_member_bills ?? null,
      session_attendance: p.session_attendance ?? {},
      assets_inr: m.assets_inr ?? a.assets_inr ?? null,
      liabilities_inr: m.liabilities_inr ?? a.liabilities_inr ?? null,
      criminal_cases_any: m.criminal_cases_any ?? a.criminal_cases_any ?? null,
      criminal_cases_serious: a.criminal_cases_serious ?? m.criminal_cases_serious ?? null,
      is_crorepati: (m.assets_inr ?? a.assets_inr) != null ? (m.assets_inr ?? a.assets_inr) >= 1_00_00_000 : null,
      education_level: m.education ?? a.education ?? null,
      age_at_election: m.age ?? a.age ?? null,
      myneta_url: m.myneta_url ?? null,
      data_confidence: p.attendance_pct != null ? "high" : "medium",
      data_sources: [
        `https://prsindia.org/mptrack/18th-lok-sabha/${slug}`,
        ...(m.myneta_url ? [m.myneta_url] : []),
      ],
    }
  })

  const body = `// AUTO-GENERATED by scripts/build-static-mps.mjs. Do not edit by hand.
// Source: data/prs-mps.json + data/myneta-2024-ls.json
// Generated: ${new Date().toISOString()}

import type { Mp } from "./types"

const now = "${new Date().toISOString()}"

export const STATIC_MPS_GEN: Mp[] = ${JSON.stringify(merged, null, 2)
    .replace(/"id":/g, '"id":')
    .replace(/"created_at": "[^"]+",?/g, "")} as unknown as Mp[]

// Ensure each record has created_at
STATIC_MPS_GEN.forEach((m) => {
  // @ts-ignore
  if (!m.created_at) m.created_at = now
  // @ts-ignore
  if (!m.name_translations) m.name_translations = {}
})
`

  await writeFile(OUT_PATH, body, "utf8")
  console.log(`Wrote ${merged.length} MPs to ${OUT_PATH}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
