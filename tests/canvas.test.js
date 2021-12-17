const { test, expect } = require('@playwright/test')

test('Automate Browsers', async ({ page }) => {
  await page.goto(process.env.WB_BASE_URL)
  await page.pause()
})
