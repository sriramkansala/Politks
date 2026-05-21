#!/usr/bin/env node
/**
 * inspect-linear.mjs — extract computed styles from Linear's marketing site.
 * We measure their actual:
 *   • hero font sizes / weights / letter-spacing
 *   • sub-nav tab styling
 *   • search input shape
 *   • body background colour
 *   • link colours
 * Then dump the values to data/linear-computed.json so we can ground our tokens.
 */

import { chromium } from "playwright"
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, "..", "data", "linear-computed.json")

const TARGETS = [
  // [page, [{selector, label}, ...]]
  [
    "https://linear.app/now",
    [
      { selector: "body",              label: "body" },
      { selector: "h1",                label: "h1-hero" },
      { selector: "main a[href='/now']", label: "subnav-active" },
      { selector: "main a[href='/now/community']", label: "subnav-inactive" },
      { selector: "input[type='search'], input[placeholder='Search...']", label: "search-input" },
      { selector: "main h2",           label: "h2" },
      { selector: "main p",            label: "body-p" },
    ],
  ],
  [
    "https://linear.app/",
    [
      { selector: "nav a[href='/signup'], a[href='/signup']", label: "signup-btn" },
      { selector: "nav a:not([href='/signup']):not([href='/login'])", label: "topnav-link" },
      { selector: "h1",                label: "homepage-hero" },
    ],
  ],
  [
    "https://linear.app/customers",
    [
      { selector: "main a:has-text('Read story')", label: "read-story-link" },
      { selector: "main h3",           label: "card-title" },
    ],
  ],
]

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "dark",
  })

  const out = {}
  for (const [url, items] of TARGETS) {
    const page = await ctx.newPage()
    try {
      console.log(`→ ${url}`)
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 })
      await page.waitForTimeout(1500)
      for (const { selector, label } of items) {
        try {
          const data = await page.evaluate((sel) => {
            const el = document.querySelector(sel)
            if (!el) return null
            const cs = getComputedStyle(el)
            return {
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || "").trim().slice(0, 60),
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              fontVariationSettings: cs.fontVariationSettings,
              letterSpacing: cs.letterSpacing,
              lineHeight: cs.lineHeight,
              color: cs.color,
              backgroundColor: cs.backgroundColor,
              border: cs.border,
              borderRadius: cs.borderRadius,
              padding: cs.padding,
              height: cs.height,
              fontFamily: cs.fontFamily.slice(0, 80),
              fontFeatureSettings: cs.fontFeatureSettings,
            }
          }, selector)
          out[`${url} :: ${label}`] = data ?? "not-found"
          console.log(`   ${label}: ${data ? data.fontSize + " " + data.color : "NOT FOUND"}`)
        } catch (e) {
          out[`${url} :: ${label}`] = `error: ${e.message}`
        }
      }
    } catch (e) {
      console.error(`   ✗ ${url}: ${e.message}`)
    } finally {
      await page.close()
    }
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2), "utf8")
  await browser.close()
  console.log(`\nDone. Computed values in ${OUT_PATH}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
