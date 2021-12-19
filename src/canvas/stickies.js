const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { locatorClick } = require('../utils/locatorClick')

/**
 * Finds the last Object added to the canvas stage and tries to remove it
 * @param {Object} page - Playwright page object
 * 
 * @returns {Void}
 */
const removeSticky = async (page, browser) => {
  /**
   * Gets the last object added to the canvas stage and clicks it
   * Since the sticky was just added, it should be the last item on the canvas
   */
  const stickyLoc = await page.locator(selectors.canvas.stage.sticky).last()
  await stickyLoc.click()

  /** Give popper time to showup */
  await wait(world.app.timeout)

  /** Finds the popper menu, then clicks the delete button */
  const menuPopLoc = await page.locator(selectors.canvas.stage.popper)
  await locatorClick(menuPopLoc, selectors.canvas.stage.delete, browser)
}

/**
 * Finds the most recently added sticky and adds text to it
 * @param {Object} page - Playwright page object
 * 
 * @returns {Void}
 */
const addStickyText = async (page, browser) => {
  const stickyLoc = await page.locator(selectors.canvas.stage.sticky).last()
  await stickyLoc.click()
  
  /** Give child div time update to content-editable */
  await wait(world.app.timeout)

  const textLoc = stickyLoc.locator(selectors.canvas.stage.text)
  await textLoc.fill(`All your stickies are belong to us`)

  await wait(world.app.timeout)
  Logger.log(`${browser} Finished adding text to sticky`)
}

/**
 * Expects the page to be loaded on the canvas stage
 * Finds the add sticky button in the side bar and clicks it
 * @param {Object} page - Playwright page object
 * 
 * @returns {Void}
 */
const addSticky = async (page, browser) => {
  await locatorClick(page, selectors.canvas.bar.add, browser)
  const stickyLoc = await page.locator(selectors.canvas.bar.sticky).first()
  stickyLoc.click()
}

/**
 * Expects the page to be loaded on the canvas stage
 * First adds a sticky to the stage, waits, then removes the sticky
 * @param {Object} page - Playwright page object
 * 
 * @returns {Void}
 */
const addThenRemoveSticky = async (page, browser) => {
  Logger.log(`${browser} Adding sticky to canvas stage`)
  await addSticky(page, browser)
  await wait(world.app.timeout)

  Logger.log(`${browser} Adding text to sticky`)
  await addStickyText(page, browser)
  await wait(world.app.timeout)
  
  Logger.log(`${browser} Removing sticky from canvas stage`)
  await removeSticky(page, browser)

  await wait(world.app.timeout)
  Logger.log(`${browser} Finished sticky interaction`)
}

module.exports = {
  addSticky,
  removeSticky,
  addThenRemoveSticky
}