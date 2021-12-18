const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { locatorClick } = require('../utils/locatorClick')

/**
 * Expects page to be on the Main Menu page
 * Then clicks on the first canvas preview to load the canvas stage
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loadCanvas = async page => {
  Logger.log(`[WB-AUTO] Loading canvas stage`)
  /** Click on the first canvas preview item to load the canvas stage */
  await locatorClick(page, selectors.menu.preview)

  /** Give some time for the canvas stage to load */
  await wait(world.app.timeout)

  /** Wait for the canvas header name to load from the canvas stage */
  const canvasLoc = page.locator(selectors.canvas.header.name)
  await canvasLoc.waitFor({
    timeout: world.app.timeout
  })

  const url = await page.url()
  Logger.highlight(`[WB-AUTO] Finished loading canvas stage`, url)
}

module.exports = {
  loadCanvas
}