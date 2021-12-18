const { Logger } = require('@keg-hub/cli-utils')
const { deepMerge, capitalize } = require('@keg-hub/jsutils')
const { automateCanvas } = require('./canvas/canvas')
const { wasRunFromTask } = require('./utils/wasRunFromTask')
const pwConf = require('../configs/playwright.config')

/**
 * Checks the output from the browser automation
 * Logs message based on the output
 */
const handleOutput = async output => {
  output &&
    output.map(({ browser, error }) => {
      if(!error)
        return Logger.log(`  ${Logger.colors.green(`✔ PASS`)} - Browser ${capitalize(browser)} test automation\n`)

      Logger.log(`  ${Logger.colors.red(`✕ FAIL`)} - Browser ${capitalize(browser)} test automation`)
      Logger.log(`    `, Logger.colors.red(error.message))
      // TODO: Save report somewhere
    })

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

  const output = await browsers.reduce(async (toResolve, browser) => {
    const acc = await toResolve
    Logger.highlight(`[WB-AUTO] Running`, capitalize(browser), `Browser Automation`)
    const error = await automateCanvas(deepMerge(pwConf, {browserName: browser}))
    acc.push({ browser, error })

    return acc
  }, Promise.resolve([]))

  return handleOutput(output)
}

require.main === module
  ? automate()
  : module.exports = { automate }