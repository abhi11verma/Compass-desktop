/**
 * Mobile screenshot script for responsive QA.
 * Usage: node scripts/mobile-screenshot.mjs
 * Requires dev server running at http://localhost:5173
 */

import { chromium } from '@playwright/test'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = resolve(__dirname, 'screenshots')
const BASE_URL = 'http://localhost:5173'

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'ipad',      width: 768, height: 1024 },
]

async function checkServerRunning() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(3000) })
    return res.ok || res.status < 500
  } catch {
    return false
  }
}

async function run() {
  const serverUp = await checkServerRunning()
  if (!serverUp) {
    console.error('ERROR: Dev server is not running at ' + BASE_URL)
    console.error('Run `just dev` in your terminal first, then re-run this script.')
    process.exit(1)
  }

  mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  const browser = await chromium.launch({ channel: 'chrome' })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const taken = []

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()

    // Viewport-only screenshots (not fullPage) so fixed elements like the
    // bottom tab bar and FAB appear at their correct positions
    const isMobile = vp.width <= 640
    const screenshotOpts = { fullPage: !isMobile }

    // Load the app and wait for it to settle
    await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    // Screenshot 1: default view (Now)
    const file1 = `${vp.name}-now-${timestamp}.png`
    await page.screenshot({ path: resolve(SCREENSHOTS_DIR, file1), ...screenshotOpts })
    taken.push({ viewport: vp.name, view: 'now', file: file1, width: vp.width })
    console.log(`  ✓ ${file1}`)

    // On mobile use bottom tabs; on desktop use topbar seg buttons
    const whatSelector = isMobile ? '.bottom-tab:nth-child(2)' : 'button:has-text("What")'
    const whoSelector  = isMobile ? '.bottom-tab:nth-child(3)' : 'button:has-text("Who")'

    // Screenshot 2: try switching to What view
    try {
      await page.locator(whatSelector).first().click({ timeout: 3000 })
      await page.waitForTimeout(300)
      const file2 = `${vp.name}-what-${timestamp}.png`
      await page.screenshot({ path: resolve(SCREENSHOTS_DIR, file2), ...screenshotOpts })
      taken.push({ viewport: vp.name, view: 'what', file: file2, width: vp.width })
      console.log(`  ✓ ${file2}`)
    } catch {
      console.log(`  ⚠ ${vp.name}: could not click "What" tab (likely a responsive bug)`)
    }

    // Screenshot 3: try switching to Who view
    try {
      await page.locator(whoSelector).first().click({ timeout: 3000 })
      await page.waitForTimeout(300)
      const file3 = `${vp.name}-who-${timestamp}.png`
      await page.screenshot({ path: resolve(SCREENSHOTS_DIR, file3), ...screenshotOpts })
      taken.push({ viewport: vp.name, view: 'who', file: file3, width: vp.width })
      console.log(`  ✓ ${file3}`)
    } catch {
      console.log(`  ⚠ ${vp.name}: could not click "Who" tab (likely a responsive bug)`)
    }

    await context.close()
  }

  await browser.close()

  console.log('\nScreenshots saved to scripts/screenshots/')
  console.log('SUMMARY:' + JSON.stringify(taken, null, 2))
}

run().catch((err) => {
  console.error('Playwright error:', err.message)
  process.exit(1)
})
