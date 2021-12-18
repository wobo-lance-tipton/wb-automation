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
const removeSticky = async page => {
  /**
   * Gets the last object added to the canvas stage and clicks it
   * Since the sticky was just added, it should be the last item on the canvas
   */
  const stickyLoc = await page.locator(selectors.canvas.stage.sticky).last()
  stickyLoc.click()

  /** Give popper time to showup */
  await wait(world.app.timeout)

  /** Finds the popper menu, then clicks the delete button */
  const menuPopLoc = await page.locator(selectors.canvas.stage.popper)
  await locatorClick(menuPopLoc, selectors.canvas.stage.delete)
}

/**
 * Expects the page to be loaded on the canvas stage
 * Finds the add sticky button in the side bar and clicks it
 * @param {Object} page - Playwright page object
 * 
 * @returns {Void}
 */
const addSticky = async page => {
  await locatorClick(page, selectors.canvas.bar.add)
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
const addThenRemoveSticky = async page => {
  Logger.log(`[WB-AUTO] Adding sticky to canvas stage`)
  await addSticky(page)

  Logger.log(`[WB-AUTO] Finished adding sticky to canvas stage`)
  await wait(world.app.timeout)

  Logger.log(`[WB-AUTO] Removing sticky from canvas stage`)
  await removeSticky(page)

  await wait(world.app.timeout)
  Logger.log(`[WB-AUTO] Finished removing sticky from canvas stage`)
}

module.exports = {
  addSticky,
  removeSticky,
  addThenRemoveSticky
}