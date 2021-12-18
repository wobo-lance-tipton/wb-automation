const { npx } = require('@keg-hub/cli-utils')
const { condArr } = require('../../utils/cond')
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
const test = async ({ params }) => {
  setRunEnvs(params)

  await npx(
    [
      `playwright`,
      `test`,
      `--config=configs/playwright.config.js`,
      ...condArr([`--project`, process.env.WB_BROWSER]),
    ],
    {},
    appRoot
  )
}

module.exports = {
  test: {
    name: 'test',
    alias: ['bld'],
    action: test,
    example: 'npm run test tests<options>',
    description: 'tests playwright tests',
    options: {
      url: {
        required: true,
        env: `WB_BASE_URL`,
        example: 'npm run test --url https://canvas.myworkboard.com',
        description: 'URL of the canvas application to test',
      },
      browser: {
        env: 'WB_BROWSER',
        example: 'npm run test -- browser=firefox',
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
        example: 'npm run test --no-headless',
        description: 'Run the borwser in headless mode (true)',
      },
      show: {
        default: false,
        env: `WB_HEADED`,
        example: 'npm run test --headed',
        description:
          'Run the borwser in headless mode. Overrides headless option. (false)',
      },
      width: {
        env: `WB_BROWSER_WIDTH`,
        description: 'Width of the borwser when running in headed mode (1280)',
        type: 'number',
        default: 1280,
      },
      height: {
        env: `WB_BROWSER_HEIGHT`,
        description: 'Height of the borwser when running in headed mode (720)',
        type: 'number',
        default: 720,
      },
      speed: {
        env: `WB_BROWSER_SPEED`,
        description: 'Speed at which the borwser is automated (50 ms)',
        type: 'number',
        default: 50,
      },
      retries: {
        env: `WB_TEST_RETRIES`,
        description:
          'How many times to retry a failed test. Disabled it timeout option is disabled (1)',
        type: 'number',
        default: 1,
      },
      timeout: {
        env: `WB_TEST_TIMEOUT`,
        description: 'How long to wait until a test will timeout (10000 ms)',
        type: 'number',
        default: 10000,
      },
      debug: {
        type: 'bool',
        env: `WB_TEST_DEBUG`,
        description: 'Run playwright in debug mode (false)',
      },
      storage: {
        default: tempDir,
        env: `WB_STORAGE_DIR`,
        description: 'Location to store temporary files',
      }
    },
  },
}
