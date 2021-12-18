const path = require('path')
const { runCmd } = require('@keg-hub/cli-utils')
const { appRoot, tempDir } = require('../../paths')
const { setRunEnvs } = require('../../utils/envs/setRunEnvs')

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
const canvasRun = async ({ params }) => {
  setRunEnvs(params)
  await runCmd(
    `node`,
    [path.join(appRoot, `./src/index.js`)],
    {},
    appRoot
  )
}

module.exports = {
  canvas: {
    name: 'canvas',
    alias: ['bld'],
    action: canvasRun,
    example: 'npm run canvas -- <options>',
    description: 'tests playwright tests',
    options: {
      url: {
        required: true,
        env: `WB_BASE_URL`,
        example: 'npm run canvas -- url=https://canvas.myworkboard.com',
        description: 'URL of the canvas application to test',
      },
      browser: {
        env: 'WB_BROWSER',
        example: 'npm run canvas -- browser=firefox',
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
      hide: {
        default: true,
        env: `WB_HEADLESS`,
        example: 'npm run canvas -- headless=false',
        description: 'Run the borwser in headless mode (true)',
      },
      show: {
        default: false,
        env: `WB_HEADED`,
        example: 'npm run canvas -- headed=true',
        description:
          'Run the borwser in headless mode. Overrides headless option. (false)',
      },
      width: {
        env: `WB_BROWSER_WIDTH`,
        example: 'npm run canvas -- width=800',
        description: 'Width of the borwser when running in headed mode (1280)',
        type: 'number',
        default: 1280,
      },
      height: {
        env: `WB_BROWSER_HEIGHT`,
        example: 'npm run canvas -- height=800',
        description: 'Height of the borwser when running in headed mode (720)',
        type: 'number',
        default: 720,
      },
      speed: {
        env: `WB_BROWSER_SPEED`,
        example: 'npm run canvas -- speed=100',
        description: 'Speed at which the borwser is automated (50 ms)',
        type: 'number',
        default: 2000,
      },
      debug: {
        type: 'bool',
        // default: false,
        env: `WB_TEST_DEBUG`,
        example: 'npm run canvas -- debug=true',
        description: 'Run playwright in debug mode (false)',
      },
      storage: {
        default: tempDir,
        example: 'npm run canvas -- storage=/local/absolute/path/to/storage/dir',
        env: `WB_STORAGE_DIR`,
        description: 'Location to store temporary files',
      }
    },
  },
}
