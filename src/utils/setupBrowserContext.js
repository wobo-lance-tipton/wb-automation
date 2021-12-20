const playwright = require('@playwright/test')

const getBrowserOpts = pwConfig => {
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
  if (!pwConfig.browserName)
    throw new Error(
      `Missing browser name. Must be one of 'chromium', 'firefox', or 'webkit'`
    )

  return await playwright[pwConfig.browserName].launchPersistentContext(
    world.paths.storageDir,
    bConf
  )
}

module.exports = {
  setupBrowserContext,
}
