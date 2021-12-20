const { Logger } = require('@keg-hub/cli-utils')
const { automateCanvas } = require('./canvas/canvas')
const pwConf = require('../configs/playwright.config')
const { deepMerge, capitalize } = require('@keg-hub/jsutils')
const { wasRunFromTask } = require('./utils/wasRunFromTask')

/**
 * Checks the output from the browser automation
 * Logs message based on the output
 */
const handleOutput = async (browser, error) => {
  Logger.empty()

  if(!error)
    return Logger.log(`  ${Logger.colors.green(`✔ PASS`)} - ${capitalize(browser)} test automation\n`)

  Logger.log(`  ${Logger.colors.red(`✕ FAIL`)} - ${capitalize(browser)} test automation`)
  Logger.log(`  `, Logger.colors.red(error.stack || error.message))
  // TODO: Save report somewhere

  Logger.empty()
}

/**
 * Finds which browser the test automation should be run on
 * Then loops through each browser and runs the test automation
 * Browsers are tests synchronously, one after the other
 * This is so they don't interfere with each other
 */
const automate = async () => {
  /** Ensure the process was started from a task so all ENVs are loaded */
  wasRunFromTask()

  const browsers = pwConf.browserName ? [pwConf.browserName] : ['chromium', 'firefox', 'webkit']

  Logger.subHeader(`[WB-AUTO] Running Browser Automation for ${browsers.map(br => capitalize(br)).join(' | ')}`)
  Logger.highlight(`[WB-AUTO] Running browsers in ${world.app.sync ? 'sync' : 'async'} mode\n`)

  await browsers.reduce(async (toResolve, browser) => {
    if(world.app.sync) await toResolve
    Logger.empty()
    Logger.empty()
    const error = await automateCanvas(deepMerge(pwConf, {browserName: browser}))

    return handleOutput(browser, error)
  }, Promise.resolve([]))
}

require.main === module
  ? automate()
  : module.exports = { automate }