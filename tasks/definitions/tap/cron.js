const cron = require('node-cron');
const { appRoot } = require('../../paths')
const { noOpObj } = require('@keg-hub/jsutils')
const { Logger, npm } = require('@keg-hub/cli-utils')

/**
 * Validates the passed in cron time
 * @throws
 * @param {string} time - Cron time string
 * 
 * @returns {Void}
 */
const validateTime = time => {
  if(cron.validate(time)) return

  Logger.log(
    Logger.colors.red(`[ERROR]`),
    `Cron time "${Logger.colors.yellow(time)}" if invalid`
  )

  process.exit(1)
}

/**
 * Run the Playwright Automation tests
 * @param {Object} args - arguments passed from the testTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being test
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const cronRun = async ({ params }) => {
  const {
    time,
    browser,
  } = params

  validateTime(time)

  const options = [`run`, `task`, `canvas`]
  browser && options.push(`--`, `browser=${browser}`)
  
  cron.schedule(time, async () => {
    await npm(options, noOpObj, appRoot)
  }, {scheduled: true})
}

module.exports = {
  canvas: {
    name: 'canvas',
    alias: ['bld'],
    action: cronRun,
    example: 'npm run cron -- <options>',
    description: 'Sets up a cron job to run browser automation',
    options: {
      time: {
        required: true,
        env: `WB_CRON_TIME`,
        example: 'npm run cron -- time=\"30 * * * *\"',
        description: 'Cron time formatted string used to schedule the cron job',
      },
      browser: {
        env: 'WB_BROWSER',
        example: 'npm run cron -- browser=firefox',
        description: 'Name of the browser to run the test (all)',
        allowed: [
          'all',
          'chromium',
          'chrome',
          'ch',
          'firefox',
          'ff',
          'webkit',
          'safari',
          'wk',
        ],
      },
    }
  }
}