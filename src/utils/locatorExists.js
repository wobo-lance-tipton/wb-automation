const { Logger } = require('@keg-hub/cli-utils')


/**
 * Checks if a locator exists on the page
 * @param {Object} parent - Parent object to create the locator
 * @param {string} selector - Playwright selector string to find the element on the page
 *
 * @retruns {Boolean} - True if the locator exists
 */
const locatorExists = async (parent, selector, browser) => {
  Logger.highlight(`${browser} Checking if locator exists`, selector)
  const locator = parent.locator(selector)
  try {
    await locator.waitFor({timeout: world.app.timeout})
    return true
  }
  catch(err){
    return false
  }
}

module.exports = {
  locatorExists
}