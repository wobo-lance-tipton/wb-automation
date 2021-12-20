const { npm } = require('@keg-hub/cli-utils')
const { appRoot, tempDir } = require('../../paths')
const { setRunEnvs } = require('../../utils/envs/setRunEnvs')

/**
 * Run the Playwright Automation tests
 * @param {Object} args - arguments passed from the testTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being test
 * @param {Array} args.options - arguments passed from the command line
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const canvasRun = async ({ params }) => {
  setRunEnvs(params)

  params.clean && (await npm(['run', 'clean:temp']))

  await npm(['run', 'automate'], { env: { RUN_FROM_TASK: 'canvas' } }, appRoot)
}

module.exports = {
  canvas: {
    name: 'canvas',
    alias: ['bld'],
    action: canvasRun,
    example: 'npm run canvas -- <options>',
    description: 'Runs playwright browser automation',
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
        description: 'Height of the browser when running in headed mode (720)',
        type: 'number',
        default: 720,
      },
      timeout: {
        env: `WB_TEST_TIMEOUT`,
        description: 'How long to wait until a test will timeout (10000 ms)',
        type: 'number',
        default: 5000,
      },
      speed: {
        env: `WB_BROWSER_SPEED`,
        example: 'npm run canvas -- speed=100',
        description: 'Speed at which the borwser is automated (50 ms)',
        type: 'number',
        default: 2000,
      },
      sync: {
        type: 'bool',
        default: false,
        env: `WB_RUN_SYNC`,
        example: 'npm run canvas -- sync=true',
        description:
          'Run browser tests synchronously, one browser after another',
      },
      debug: {
        type: 'bool',
        env: `WB_TEST_DEBUG`,
        example: 'npm run canvas -- debug=true',
        description: 'Run playwright in debug mode (false)',
      },
      storage: {
        default: tempDir,
        example:
          'npm run canvas -- storage=/local/absolute/path/to/storage/dir',
        env: `WB_STORAGE_DIR`,
        description: 'Location to store temporary files',
      },
      clean: {
        env: `WB_STORAGE_CLEAN`,
        example: 'npm run canvas -- clean=true',
        description:
          'Cleans the temporary storage folder by deleting and recreating',
      },
      stickyRuns: {
        default: 1,
        env: `WB_STICKY_RUNS`,
        example: 'npm run canvas -- stickyRuns=5',
        description:
          'Number of times to run the sticky flow, before closing the browser',
      },
      stickyWait: {
        default: 3,
        env: `WB_STICKY_WAIT`,
        example: 'npm run canvas -- stickyWait=60',
        description: 'Time to wait between sticky runs in second (1 second)',
      },
      stickies: {
        default: 3,
        env: `WB_STICKY_CREATES`,
        example: 'npm run canvas -- stickies=10',
        description:
          'The amount of stickies to create and remove form the canvas (3)',
      },
    },
  },
}
