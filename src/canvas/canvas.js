const { Logger } = require('@keg-hub/cli-utils')
const pwConf = require('../../configs/playwright.config')
const { login } = require('./login')
const { loadCanvas } = require('./loadCanvas')
const { addStickies } = require('./addStickies')

const { setupBrowserContext } = require('../utils/setupBrowserContext')

;(async () => {
  let context
  let error
  try {
    context = await setupBrowserContext(pwConf)
    if(!context) throw new Error(`Browser context could not be created`)

    const {page} = await login(context, pwConf)
    await loadCanvas(page)
    await addStickies(page)

    await page.pause()
  }
  catch(err){
    Logger.error(err.stack)
    error = true
  }
  finally {
    error && context && await context.close()

    !error &&
      setTimeout(async () => {
        context && await context.close()
      }, 5000)
  }
})()


