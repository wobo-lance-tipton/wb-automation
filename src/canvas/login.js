const { URL } = require('url')
const { selectors } = require('./selectors')
const { Logger } = require('@keg-hub/cli-utils')
const { noOpObj, wait } = require('@keg-hub/jsutils')
const { locatorClick } = require('../utils/locatorClick')

/**
 * Flow for logging into the wobo via the login form
 * @param {Object} page - Playwright page object
 *
 * @returns {Void}
 */
const loginForm = async page => {
  Logger.log(`[WB-AUTO] User not logged in, running login flow`)
  
  /** Find the form and ensure it exists */
  const formLoc = page.locator(selectors.login.form.parent)
  await formLoc.waitFor({timeout: world.app.timeout})
  await locatorClick(page, selectors.login.form.parent)
  
  /** Find the email input and fill with the users email */
  Logger.highlight(`[WB-AUTO] Logging-in user`, world.user.email)
  const emailLoc = page.locator(selectors.login.form.email)
  await emailLoc.fill(world.user.email)

  /** Find and click the continue button */
  await locatorClick(page, selectors.login.form.continue)

  /** Find the password input, and fill it with the user password */
  Logger.log(`[WB-AUTO] Entering user password`)
  const passLoc = page.locator(selectors.login.form.pass)
  await passLoc.waitFor({timeout: world.app.timeout})
  await passLoc.fill(world.user.pass)

  /** Find and click the singin button */
  await locatorClick(page, selectors.login.form.signIn)

  Logger.log(`[WB-AUTO] Finished user login flow`)
  return page
}

/**
 * Checks login state, and logs in a user if not already logged in
 * 
 * @param {Object} context - Playwright Browser context
 * @param {Object} pwConf - Playwright config object
 *
 * @returns {Object} - Playwright page object created from the context
 */
const login = async (context, pwConf=noOpObj) => {
  if(!context) throw new Error(`Browser context is required to login`)

  Logger.log(`[WB-AUTO] Creating new page`)
  const page = await context.newPage()
  if(!page) throw new Error(`Browser page could not be created`)

  /**
   * Open the browser page to the world url
   * Should be a canvas url defined with WB_BASE_URL env
   */
  Logger.highlight(`[WB-AUTO] Loading canvas url`, world.app.url)
  const worldAppUrl = new URL(world.app.url)
  await page.goto(worldAppUrl.href)

  /**
   * If not logged in, page redirects to the login screen
   * So wait the defined timeout time (default 2s) to allow for the redirect
   */
  await wait(world.app.timeout)

  const url = await page.url()
  const pwAppUrl = new URL(url)

  /**
   * Validate the url is the same as the app.url
   * If it is, we are already logged in, so return
   * If we were redirected, then run through the login flow
   */
  return worldAppUrl.href !== pwAppUrl.href ? await loginForm(page) : page
}


module.exports = {
  login
}