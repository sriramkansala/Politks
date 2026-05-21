#!/usr/bin/env node
/**
 * zoom-linear.mjs — capture cropped close-up sections of Linear pages.
 * The homepage has an embedded "Faster app launch" issue widget at ~y=540px
 * that mirrors real Linear product chrome (sidebar, tabs, status pills).
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "..", "data", "linear-screenshots")

const TARGETS = [
  // [name, url, scrollY, viewportH]
  ["zoom-homepage-widget",      "https://linear.app/",                                 540,  800],
  ["zoom-homepage-widget-2",    "https://linear.app/",                                 1400, 800],
  ["zoom-homepage-widget-3",    "https://linear.app/",                                 2200, 800],
  ["zoom-features-issues",      "https://linear.app/features",                         800,  800],
  ["zoom-features-projects",    "https://linear.app/features",                         1600, 800],
  ["zoom-features-cycles",      "https://linear.app/features",                         2400, 800],
  ["zoom-features-triage",      "https://linear.app/features",                         3200, 800],
  ["zoom-method-tools",         "https://linear.app/method",                           2000, 800],
  ["zoom-method-tools-2",       "https://linear.app/method",                           4000, 800],
]

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  })

  for (const [name, url, scrollY, h] of TARGETS) {
    const page = await ctx.newPage()
    try {
      console.log(`→ ${name}`)
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 })
      await page.waitForTimeout(2000)
      await page.evaluate((y) => window.scrollTo(0, y), scrollY)
      await page.waitForTimeout(1200) // let lazy content render
      await page.screenshot({
        path: join(OUT_DIR, `${name}.png`),
        clip: { x: 0, y: 0, width: 1280, height: h },
      })
      console.log("   ✓")
    } catch (e) {
      console.error(`   ✗ ${name}: ${e.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  console.log("\nDone.")
}

main().catch((e) => { console.error(e); process.exit(1) })
