const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { createCanvas } = require('./createCanvas')
const { locatorClick } = require('../utils/locatorClick')
const { locatorExists } = require('../utils/locatorExists')

/**
 * Expects page to be on the Main Menu page
 * Then clicks on the first canvas preview to load the canvas stage
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loadFromExisting = async page => {
  Logger.log(`[WB-AUTO] Loading canvas stage`)
  /** Click on the first canvas preview item to load the canvas stage */
  await locatorClick(page, selectors.home.main.preview)

  /** Give some time for the canvas stage to load */
  await wait(world.app.timeout)

  /** Wait for the canvas header name to load from the canvas stage */
  const canvasLoc = page.locator(selectors.canvas.header.name)
  await canvasLoc.waitFor({timeout: world.app.timeout})

  const url = await page.url()
  Logger.highlight(`[WB-AUTO] Finished loading canvas stage`, url)
}

/**
 * Expects page to be on the Main Menu page
 * Then clicks on the first canvas preview to load the canvas stage
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loadCanvas = async page => {
  /** Check if the canvas preview exist exists */
  const exists = await locatorExists(page, selectors.home.main.preview)
  Logger.highlight(`[WB-AUTO] Canvas exists`, exists)

  /**
   * If a canvas does not exist, then create one
   * Otherwise load the first canvas on the home page
  */
  return !exists
    ? await createCanvas(page)
    : await loadFromExisting(page)
}

module.exports = {
  loadCanvas
}