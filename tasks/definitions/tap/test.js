const { npx } = require('@keg-hub/cli-utils')
const { exists } = require('@keg-hub/jsutils')

const { appRoot } = require('../../paths')

const browserMap = {
  all: '',
  ch: 'chromium',
  ff: 'firefox',
  chrome: 'chromium',
  chromium: 'chromium',
  firefox: 'firefox',
  webkit: 'webkit',
  safari: 'webkit',
  wk: 'webkit',
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
const test = async ({ params }) => {
  const { browser, hide, show, timeout } = params

  if (show || !hide) {
    process.env.WB_HEADLESS = false
    process.env.WB_HEADED = true
  }

  if (exists(browser)) process.env.WB_BROWSER = browserMap[browser] || browser

  if (!timeout) {
    process.env.WB_TEST_TIMEOUT = 0
    process.env.WB_TEST_RETRIES = 0
  }

  await npx(
    [
      `playwright`,
      `test`,
      `--config=configs/playwright.config.js`,
      ...(process.env.WB_BROWSER && [`--project`, process.env.WB_BROWSER]),
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
    },
  },
}
