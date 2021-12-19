const { login } = require('./login')
const { loadCanvas } = require('./loadCanvas')
const { Logger } = require('@keg-hub/cli-utils')
const { capitalize, exists } = require('@keg-hub/jsutils')
const { addThenRemoveSticky } = require('./stickies')
const { setupBrowserContext } = require('../utils/setupBrowserContext')

/**
 * Browsers mapped to colors for identifiers
 */
const browserColors = {
  chromium: 'gray',
  firefox: 'magenta',
  webkit: 'blue'
}

/**
 * Ensures the context is closed, then calls the passed in callback
 * 
 * @param {Object} context - Playwright Browser context
 * 
 * @returns {*} - Response from the callback
 */
const closeContext = async (context, callback, ...args) => {
  context && await context.close()
  return callback(...args)
}

const loopCanvas = async (page, reruns=0, browser) => {
  const hasReruns = exists(world.app.stickyRuns)
  return new Promise(async (res, rej) => {
    try {
      reruns++
      Logger.log(`${browser} Running stickies flow ${reruns} of ${world.app.stickyRuns}`)
      await addThenRemoveSticky(page, browser)
      if(!hasReruns || (reruns >= world.app.stickyRuns)) return res(true)
      
      Logger.highlight(`${browser} Sticky Runs:`, reruns)
      Logger.highlight(`${browser} Runs Required:`, world.app.stickyRuns)

      Logger.highlight(`\n${browser} Waiting ${world.app.stickyWait / 1000} seconds to rerun stickies flow\n`)
      setTimeout(async () => {
        await loopCanvas(page, reruns, browser)
        res(true)
      }, world.app.stickyWait)
    }
    catch(err){
      return rej(err)
    }
  })
}

/**
 * Automates logging into the canvas app
 * The tries to load the first canvas
 * It expects a canvas already exists
 * 
 * @param {Object} pwConf - Playwright test config object
 * 
 * @returns {Error|undefined} - Error if an error is thrown, otherwise undefined
 */
const automateCanvas = async pwConf => {
  const browser = Logger.colors[browserColors[pwConf.browserName]](`${capitalize(pwConf.browserName)} -`)

  return new Promise(async (res, rej) => {
    let context
    let error
    try {
      Logger.log(`${browser} Getting browser context`)
      context = await setupBrowserContext(pwConf)
      if(!context) throw new Error(`Browser context could not be created`)
  
      Logger.log(`${browser} Opening OKR-Canvas and logging in`)
      const page = await login(context, pwConf, browser)
      await loadCanvas(page, browser)
      await loopCanvas(page, 0, browser)
      Logger.log(`${browser} Finished canvas stickies check for browser`)
    }
    /**
     * Catch the error and set the error flag
     * This allows closing the context immediately
     * Instead of waiting for the timeout
     */
    catch(err){
      error = err
    }
    finally {
      error
        ? closeContext(context, rej, error)
        : setTimeout(async () => closeContext(context, res), world.app.timeout)
    }
  })
}

module.exports = {
  automateCanvas
}
