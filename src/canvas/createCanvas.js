const { selectors } = require('./selectors')
const { wait } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { locatorClick } = require('../utils/locatorClick')

/**
 * Creates a new blank canvas from the home page pop-up modal
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const createCanvas = async page => {
  Logger.log(`[WB-AUTO] Canvas does not exist, opening create canvas modal`)

  /** Open the create canvas model */
  await locatorClick(page, selectors.home.main.new)
  await wait(world.app.timeout)

  /** Select the blank canvas option */
  Logger.highlight(`[WB-AUTO] Creating new`, `Blank Canvas`)
  await locatorClick(page, selectors.home.modal.blank)

  /** Click the create button to create the new canvas */
  await locatorClick(page, selectors.home.modal.create)

  await wait(world.app.timeout)
  Logger.log(`[WB-AUTO] Finish creating new Canvas`)
}

module.exports = {
  createCanvas
}