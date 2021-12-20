const { Log } = require('../utils/log')
const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { locatorClick } = require('../utils/locatorClick')

/**
 * Creates a new blank canvas from the home page pop-up modal
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const createCanvas = async (page, browser) => {
  Log(browser, `Canvas does not exist, opening create canvas modal`)

  /** Open the create canvas model */
  await locatorClick(page, selectors.home.main.new, browser)
  await wait(world.app.timeout)

  /** Select the blank canvas option */
  Log.highlight(browser, `Creating new`, `Blank Canvas`)
  await locatorClick(page, selectors.home.modal.blank, browser)

  /** Click the create button to create the new canvas */
  await locatorClick(page, selectors.home.modal.create, browser)

  await wait(world.app.timeout)
  Log(browser, `Finish creating new Canvas`)
}

module.exports = {
  createCanvas
}