const { login } = require('./login')
const { loadCanvas } = require('./loadCanvas')
const { Logger } = require('@keg-hub/cli-utils')
const { capitalize } = require('@keg-hub/jsutils')
const { addThenRemoveSticky } = require('./stickies')
const { setupBrowserContext } = require('../utils/setupBrowserContext')

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
  return new Promise(async (res, rej) => {
    let context
    let error
    try {
      Logger.log(`[WB-AUTO] Getting browser context`)
      context = await setupBrowserContext(pwConf)
      if(!context) throw new Error(`Browser context could not be created`)
  
      Logger.log(`[WB-AUTO] Opening OKR-Canvas and logging in`)
      const page = await login(context, pwConf)

      await loadCanvas(page)
      
      Logger.log(`[WB-AUTO] Running stickies flow`)
      await addThenRemoveSticky(page)
      
      Logger.highlight(`[WB-AUTO] Finished canvas stickies check for browser`, capitalize(pwConf.browserName))
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
