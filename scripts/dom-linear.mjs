#!/usr/bin/env node
/**
 * dom-linear.mjs — Grab specific DOM regions of Linear pages plus their
 * computed styles. We're after:
 *   - sidebar nav items (active vs idle)
 *   - status indicators
 *   - card structures
 * Output: data/linear-dom.json
 */

import { chromium } from "playwright"
import { writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = join(__dirname, "..", "data", "linear-dom.json")

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  })
  const page = await ctx.newPage()
  await page.goto("https://linear.app/", { waitUntil: "domcontentloaded", timeout: 25000 })
  await page.waitForTimeout(3500) // let lazy demos render

  // The homepage embeds a Linear UI demo: look for any element resembling
  // a sidebar or status indicator inside the hero canvas.
  const sample = await page.evaluate(() => {
    function snap(el) {
      if (!el) return null
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").trim().slice(0, 80),
        class: el.className.toString().slice(0, 200),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        border: cs.border,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        height: cs.height,
        width: cs.width,
        gap: cs.gap,
        boxShadow: cs.boxShadow.slice(0, 120),
      }
    }

    // Find "In Progress" status label and walk up to its container
    const inProgress = [...document.querySelectorAll("*")]
      .find((el) => el.childNodes.length <= 2 && (el.textContent || "").trim() === "In Progress")
    const inProgressIcon = inProgress?.previousElementSibling || inProgress?.parentElement?.querySelector("svg")

    // Find a sidebar nav item — anything with text "Inbox" or "My issues"
    const sidebarItem = [...document.querySelectorAll("*")]
      .find((el) => (el.textContent || "").trim() === "Inbox")
    const activeItem = [...document.querySelectorAll("*")]
      .find((el) => (el.textContent || "").trim() === "Faster app launch" && el.children.length === 0)

    // Find "Sign up" button (top nav)
    const signup = [...document.querySelectorAll("a")]
      .find((el) => (el.textContent || "").trim() === "Sign up")

    // Find the small section header "Activity"
    const activity = [...document.querySelectorAll("*")]
      .find((el) => (el.textContent || "").trim() === "Activity" && el.children.length === 0)

    return {
      "in-progress-text": snap(inProgress),
      "in-progress-icon": snap(inProgressIcon),
      "sidebar-idle":     snap(sidebarItem),
      "sidebar-active":   snap(activeItem),
      "signup-button":    snap(signup),
      "activity-header":  snap(activity),
    }
  })

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(sample, null, 2), "utf8")
  console.log("Wrote", OUT_PATH)
  await browser.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
