const { Logger } = require('@keg-hub/cli-utils')

/**
 * Creates a Playwright locator, then calls it's click method
 * @param {Object} parent - Parent object to create the locator
 * @param {string} selector - Playwright selector string to find the element on the page
 * 
 * @retruns {Object} - The locator object found from the passed in params
 */
const locatorClick = async (parent, selector, browser) => {
  Logger.highlight(`${browser} Clicking on locator`, selector)
  const locator = parent.locator(selector)
  await locator.click()

  return locator
}


module.exports = {
  locatorClick
}