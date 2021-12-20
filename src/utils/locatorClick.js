const { Log } = require('./log')
const { selectors } = require('../canvas/selectors')
const { locatorExists } = require('../utils/locatorExists')

/**
 * Local version of the session click
 * Called when a locator can not be clicked on
 * Checks if the session modal exists, and if so tries to close it
 * @param {Object} page - Playwright page object
 * @param {string} browser - Browser tag of the active browser
 *
 * @returns {Object} - The locator object found from the passed in params
 */
const checkSession = async (page, browser) => {
  const extendExists = await locatorExists(
    page,
    selectors.session.extend,
    browser
  )
  extendExists && (await locatorClick(page, selectors.session.extend, browser))

  return extendExists
}

const wrapSessionCheck = async (callback, page, browser) => {
  try {
    return await callback()
  } catch (err) {
    // If an error is thrown see if the session popup exists
    // If it was, then retry the locator click
    const hadSession = await checkSession(page, browser)
    if (hadSession) return await callback()

    // If no error because of session, then throw the original error
    throw err
  }
}

/**
 * Creates a Playwright locator, then calls it's click method
 * @param {Object} page - Playwright page object
 * @param {string} selector - Playwright selector string to find the element on the page
 * @param {string} browser - Browser tag of the active browser
 *
 * @returns {Object} - The locator object found from the passed in params
 */
const locatorClick = async (page, selector, browser) => {
  return await wrapSessionCheck(
    async () => {
      Log.highlight(browser, `Clicking on locator`, selector)
      const locator = page.locator(selector)
      await locator.click({ timeout: world.app.timeout })

      return locator
    },
    page,
    browser
  )
}

module.exports = {
  locatorClick,
  wrapSessionCheck,
  checkSession,
}
