const path = require('path')
const { noOpObj } = require('@keg-hub/jsutils')

const getStorageLoc = loc => {
  return path.join(loc || world.paths.storageDir, `state.json`)
}

/**
 * Save the context storage locally
 */
const saveStorage = async (context, loc) => {
  await context.storageState({ path: getStorageLoc(loc) });
}

/**
 * Create a new context with the saved storage state.
 */
const contextFromStorage = async (browser, pwConf=noOpObj, loc) => {
  if(!browser) throw new Error(`A browser is required to create a context`, browser)
  return await browser.newContext({
    storageState: getStorageLoc(loc)
  });
}

module.exports = {
  saveStorage,
  contextFromStorage
}