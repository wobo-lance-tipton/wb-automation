
const playwright = require('@playwright/test')

const getBrowserOpts = (pwConfig) => {
  return {
    baseURL: pwConfig.use.baseURL,
    headless: pwConfig.use.headless,
    slowMo: pwConfig.use.slowMo,
    screen: pwConfig.use.viewport,
    timeout: pwConfig.use.timeout,
    viewport: pwConfig.use.viewport,
    tracesDir: world.paths.tracesDir,
    downloadsPath: world.paths.downloadsDir,
    recordVideo: {
      dir: world.paths.videosDir,
      size: pwConfig.use.viewport,
    },
  }
}

const setupBrowserContext = async pwConfig => {
  const bConf = getBrowserOpts(pwConfig) 
  return await playwright[pwConfig.browserName || 'chromium'].launchPersistentContext(
    world.paths.storageDir,
    bConf
  )
}

module.exports = {
  setupBrowserContext
}