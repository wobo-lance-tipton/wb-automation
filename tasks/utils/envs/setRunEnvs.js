const { tempDir } = require('../../paths')
const { exists } = require('@keg-hub/jsutils')
const { browserMap } = require('../browserMap')

/**
 * Sets the envs for the test run based on passed in params
 * @param {Object} params - Options passed to the task from the command line
 */
const setRunEnvs = params => {
  const {
    browser,
    debug,
    hide,
    show,
    storage,
    timeout
  } = params

  if(exists(browser))
    process.env.WB_BROWSER = browserMap[browser] || browser

  if(storage && storage !== tempDir)
    process.env.WB_STORAGE_DIR = storage

  if(debug){
    process.env.WB_HEADLESS = false
    process.env.WB_HEADED = true
    process.env.WB_TEST_TIMEOUT = 0
    process.env.WB_TEST_RETRIES = 0
    process.env.PWDEBUG = 1
    process.env.DEBUG = `pw:api`
    return 
  }

  if (show || !hide) {
    process.env.WB_HEADLESS = false
    process.env.WB_HEADED = true
  }

  if (!timeout) {
    process.env.WB_TEST_TIMEOUT = 0
    process.env.WB_TEST_RETRIES = 0
  }
}

module.exports = {
  setRunEnvs,
}