const { Logger } = require('@keg-hub/cli-utils')


/**
 * Checks if a locator exists on the page
 * @param {Object} parent - Parent object to create the locator
 * @param {string} selector - Playwright selector string to find the element on the page
 * @param {number} time - Time to wait for the locator to exist in seconds
 * 
 * @retruns {Boolean} - True if the locator exists
 */
const locatorExists = async (parent, selector, time) => {
  Logger.highlight(`[WB-AUTO] Checking if locator exists`, selector)
  const locator = parent.locator(selector)
  try {
    await locator.waitFor({ timeout: time ? time * 1000 : world.app.timeout })
    return true
  }
  catch(err){
    return false
  }
}

module.exports = {
  locatorExists
}