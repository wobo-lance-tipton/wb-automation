const { Log } = require('../utils/log')
const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { createCanvas } = require('./createCanvas')
const { locatorExists } = require('../utils/locatorExists')
const { locatorClick, checkSession } = require('../utils/locatorClick')

/**
 * Expects page to be on the Main Menu page
 * Then clicks on the first canvas preview to load the canvas stage
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loadFromExisting = async (page, browser) => {
  Log(browser, `Loading canvas stage`)
  /** Click on the first canvas preview item to load the canvas stage */
  await locatorClick(page, selectors.home.main.preview, browser)

  /** Give some time for the canvas stage to load */
  await wait(world.app.timeout)

  /** Wait for the canvas header name to load from the canvas stage */
  const canvasLoc = page.locator(selectors.canvas.header.name)
  await canvasLoc.waitFor({timeout: world.app.timeout})

  const url = await page.url()
  Log.highlight(browser, `Finished loading canvas stage`, url)
}

/**
 * Expects page to be on the Main Menu page
 * Then clicks on the first canvas preview to load the canvas stage
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loadCanvas = async (page, browser) => {

  /** Check if the session.extend button exists, and click it if needed */
  await checkSession(page, browser)

  /** Check if the canvas preview exist exists */
  const exists = await locatorExists(page, selectors.home.main.preview, browser)
  Log.highlight(browser, `Canvas exists`, exists)

  /**
   * If a canvas does not exist, then create one
   * Otherwise load the first canvas on the home page
  */
  return !exists
    ? await createCanvas(page, browser)
    : await loadFromExisting(page, browser)
}

module.exports = {
  loadCanvas
}