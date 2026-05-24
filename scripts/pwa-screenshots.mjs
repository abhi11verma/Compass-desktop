/**
 * Generates PWA install UI screenshots for the web app manifest.
 * Outputs:
 *   public/screenshots/desktop.png  (1280×800, form_factor: wide)
 *   public/screenshots/mobile.png   (390×844, form_factor: narrow)
 *
 * Usage: node scripts/pwa-screenshots.mjs
 * Requires dev server running at http://localhost:5173
 */

import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../public/screenshots')
const BASE_URL = 'http://localhost:5173'

async function checkServerRunning() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) })
    return res.ok || res.status < 500
  } catch {
    return false
  }
}

async function capture(browser, { width, height, path }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path, fullPage: false })
  await context.close()
  console.log(`  ✓ ${path} (${width}×${height})`)
}

async function run() {
  const serverUp = await checkServerRunning()
  if (!serverUp) {
    console.error('ERROR: Dev server not running at ' + BASE_URL)
    console.error('Run `just dev` first, then re-run this script.')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ channel: 'chrome' })

  await capture(browser, {
    width: 1280,
    height: 800,
    path: resolve(OUT_DIR, 'desktop.png'),
  })

  await capture(browser, {
    width: 390,
    height: 844,
    path: resolve(OUT_DIR, 'mobile.png'),
  })

  await browser.close()
  console.log('\nScreenshots written to public/screenshots/')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
