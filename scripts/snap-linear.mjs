#!/usr/bin/env node
/**
 * snap-linear.mjs — capture real Linear UI screenshots via Playwright.
 *
 *   $ node scripts/snap-linear.mjs
 *
 * Strategy: Linear's product itself is behind login, but their marketing pages
 * (/features, /method, /now, /customers) embed high-resolution product crops
 * AND their /homepage runs interactive UI demos with the same components as
 * the real app. We screenshot those + zoom into the demo widgets to capture
 * the real list rows / sidebar / buttons.
 *
 * Output: data/linear-screenshots/<page>-<viewport>.png
 */

import { chromium } from "playwright"
import { mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, "..", "data", "linear-screenshots")

const PAGES = [
  { name: "homepage",     url: "https://linear.app/" },
  { name: "features",     url: "https://linear.app/features" },
  { name: "changelog",    url: "https://linear.app/changelog" },
  { name: "method",       url: "https://linear.app/method" },
  { name: "method-plan",  url: "https://linear.app/method/plan" },
  { name: "method-build", url: "https://linear.app/method/build" },
  { name: "method-operate", url: "https://linear.app/method/operate" },
  { name: "method-initiatives", url: "https://linear.app/method/initiatives" },
  { name: "method-cycles", url: "https://linear.app/method/cycles" },
  { name: "now",          url: "https://linear.app/now" },
  { name: "customers",    url: "https://linear.app/customers" },
  { name: "customer-cursor", url: "https://linear.app/customers/cursor" },
  { name: "customer-openai", url: "https://linear.app/customers/openai" },
  { name: "customer-vercel", url: "https://linear.app/customers/vercel" },
  { name: "pricing",      url: "https://linear.app/pricing" },
  { name: "agents",       url: "https://linear.app/agents" },
  { name: "blog-design",  url: "https://linear.app/now/how-we-redesigned-the-linear-ui" },
  { name: "blog-calmer",  url: "https://linear.app/now/behind-the-latest-design-refresh" },
]

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

  console.log("Launching Chromium…")
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,                   // 1x so files stay under Read tool limit
    colorScheme: "dark",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  for (const p of PAGES) {
    const page = await ctx.newPage()
    try {
      console.log(`→ ${p.name}: ${p.url}`)
      // domcontentloaded is more reliable than networkidle on pages with infinite animations
      await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 25000 })
      // Wait a beat for hero animations & lazy-loaded screenshots
      await page.waitForTimeout(3000)
      // Capture both above-the-fold and full-page
      await page.screenshot({
        path: join(OUT_DIR, `${p.name}-fold.png`),
        fullPage: false,
      })
      await page.screenshot({
        path: join(OUT_DIR, `${p.name}-full.png`),
        fullPage: true,
      })
      console.log(`   ✓ saved`)
    } catch (e) {
      console.error(`   ✗ ${p.name}: ${e.message}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  console.log("\nDone. Screenshots in", OUT_DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
