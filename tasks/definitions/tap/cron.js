const cron = require('node-cron');
const { appRoot } = require('../../paths')
const { noOpObj } = require('@keg-hub/jsutils')
const { Logger, npm } = require('@keg-hub/cli-utils')

let RUNNING_JOB

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
 * Kills an actively running job
 */
const killRunningJob = () => {
  RUNNING_JOB && RUNNING_JOB.stop()
  RUNNING_JOB = undefined
}

/**
 * Loop over exit events, and add handler to stop the cronjob
 */
const addExitListeners = () => {
  let exitCalled
  Array.from([
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
    'SIGTERM'
  ])
    .map(event => process.on(event, exitCode => {
      /** Only need to call exit once */
      if(exitCalled) return
      
      exitCalled = true
      Logger.warn(`\n[WB-AUTO] Exiting cronjob\n`)
      killRunningJob()
    }))
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
    browser,
    clean,
    time,
  } = params

  /** Clean the temp folder clean param exists */
  clean && await npm(['run', 'clean:temp'])

  /** Stop a currently running job if it already exists */
  killRunningJob()

  /** Ensure the cronjob time is valid */
  validateTime(time)

  /** Check if it should only run for a specific browser */
  const options = [`run`, `task`, `canvas`]
  browser && options.push(`--`, `browser=${browser}`)

  Logger.highlight(`[WB-AUTO] Starting cronjob schedule`, time)

  /** Start the cronjob */
  RUNNING_JOB = cron.schedule(time, async () => {
    Logger.log(`[WB-AUTO] Running scheduled cronjob at`, new Date())
    await npm(options, noOpObj, appRoot)
  }, {scheduled: true})

  addExitListeners()
}

module.exports = {
  cron: {
    name: 'cron',
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
      clean: {
        env: `WB_STORAGE_CLEAN`,
        example: 'npm run cron -- clean=true',
        description: 'Cleans the temporary storage folder by deleting and recreating',
      }
    }
  }
}