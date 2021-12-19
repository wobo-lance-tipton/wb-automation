const path = require('path')
const globalSetup = require('./global.world')
const { devices } = require('@playwright/test')
const { toBool, toNum, noOpObj } = require('@keg-hub/jsutils')
const { testsDir, configsDir } = require('../tasks/paths')

const {
  WB_BROWSER,
  WB_BASE_URL,
  WB_HEADED = false,
  WB_HEADLESS = true,
  WB_TEST_RETRIES = 1,
  WB_TEST_TIMEOUT = 2000,
  WB_BROWSER_SPEED = 50,
  WB_BROWSER_WIDTH = 1280,
  WB_BROWSER_HEIGHT = 720,
} = process.env

const borwser = ['chromium', 'firefox', 'webkit'].includes(WB_BROWSER)
  ? { browserName: WB_BROWSER }
  : noOpObj

const config = {
  ...borwser,
  testDir: testsDir,
  ...(WB_TEST_RETRIES && { retries: toNum(WB_TEST_RETRIES) }),
  ...(WB_TEST_TIMEOUT && { timeout: toNum(WB_TEST_TIMEOUT) }),
  globalSetup: path.join(configsDir, 'test.setup.js'),
  use: {
    baseURL: WB_BASE_URL,
    video: 'on-first-retry',
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    headless: !toBool(WB_HEADED) || toBool(WB_HEADLESS),
    viewport: {
      width: toNum(WB_BROWSER_WIDTH),
      height: toNum(WB_BROWSER_HEIGHT),
    },
    launchOptions: {
      slowMo: toNum(WB_BROWSER_SPEED),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}


globalSetup()

module.exports = config

