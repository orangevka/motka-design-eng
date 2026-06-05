// Usage: node scripts/shoot.mjs <url> <outPrefix> [widths]
// Пример: node scripts/shoot.mjs http://localhost:4321/ home "1440,1280,1024,768,390"
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:4321/';
const prefix = process.argv[3] ?? 'shot';
const widths = (process.argv[4] ?? '1440').split(',').map(Number);
mkdirSync('scripts/_shots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: `scripts/_shots/${prefix}-${w}.png`, fullPage: true });
  console.log(`${prefix}-${w}.png  hOverflow=${overflow}`);
  await page.close();
}
await browser.close();
