const { Log } = require('../utils/log')
const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { locatorClick, wrapSessionCheck } = require('../utils/locatorClick')

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
  await wrapSessionCheck(
    async () => {
      const stickyLoc = await page.locator(selectors.canvas.stage.sticky).last()
      await stickyLoc.click({ timeout: world.app.timeout })
    },
    page,
    browser
  )

  /** Give popper time to showup */
  await wait(world.app.timeout)

  /** Finds the popper menu, then clicks the delete button */
  await locatorClick(page, selectors.canvas.stage.delete, browser)
}

/**
 * Removes the previously added stickies from the canvas stage
 * @param {Object} page - Playwright page object
 * @param {number} stickyAmount - Amount of stickies to be removed
 *
 * @returns {Void}
 */
const clearStickies = async (page, stickyAmount, browser) => {
  Log(browser, `Removing ${stickyAmount} stickies from canvas stage`)
  for (let i = 0; i < stickyAmount; i++) {
    Log(
      browser,
      `Removing sticky ${i + 1} of ${stickyAmount} from canvas stage`
    )
    await removeSticky(page, browser)
  }
}

/**
 * Finds the most recently added sticky and adds text to it
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const addStickyText = async (page, browser) => {
  let stickyLoc
  await wrapSessionCheck(
    async () => {
      stickyLoc = await page.locator(selectors.canvas.stage.sticky).last()
      await stickyLoc.click({ timeout: world.app.timeout })
    },
    page,
    browser
  )

  /** Give child div time update to content-editable */
  await wait(world.app.timeout)

  await wrapSessionCheck(
    async () => {
      const textLoc = stickyLoc.locator(selectors.canvas.stage.text)
      await textLoc.click()
      await textLoc.fill(`All your stickies are belong to us`, {
        timeout: world.app.timeout,
      })
    },
    page,
    browser
  )

  Log(browser, `Finished adding text to sticky`)
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
  await wrapSessionCheck(
    async () => {
      const stickyLoc = await page.locator(selectors.canvas.bar.sticky).first()
      stickyLoc.click({ timeout: world.app.timeout })
    },
    page,
    browser
  )
}

/**
 * Creates a set number of stickies on the canvas stage
 * @param {Object} page - Playwright page object
 * @param {number} stickyAmount - Amount of stickies to be created
 *
 * @returns {Void}
 */
const createStickies = async (page, stickyAmount, browser) => {
  Log(browser, `Adding ${stickyAmount} stickies to canvas stage`)
  for (let i = 0; i < stickyAmount; i++) {
    Log(browser, `Adding sticky ${i + 1} of ${stickyAmount} to canvas stage`)
    await addSticky(page, browser)
  }
}

/**
 * Expects the page to be loaded on the canvas stage
 * First adds a sticky to the stage, waits, then removes the sticky
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const addThenRemoveSticky = async (page, browser) => {
  const stickyAmount = world.app.stickyCreates || 1
  await createStickies(page, stickyAmount, browser)

  Log(browser, `Adding text to sticky`)
  await addStickyText(page, browser)

  await wait(world.app.timeout)

  await clearStickies(page, stickyAmount, browser)
  Log(browser, `Finished sticky interaction`)
}

module.exports = {
  addSticky,
  removeSticky,
  addThenRemoveSticky,
}
