const path = require('path')
const { toNum } = require('@keg-hub/jsutils')
const { appRoot, tempDir } = require('../tasks/paths')

const globalSetup = () => {
  const {
    WB_BASE_URL,
    WB_USER_EMAIL,
    WB_USER_PASS,
    WB_TEST_TIMEOUT=2000,
    WB_STORAGE_DIR=tempDir,
  } = process.env

  global.world = {
    app: {
      url: WB_BASE_URL,
      timeout: toNum(WB_TEST_TIMEOUT),
    },
    user: {
      email: WB_USER_EMAIL,
      pass: WB_USER_PASS,
    },
    paths: {
      rootDir: appRoot,
      storageDir: WB_STORAGE_DIR,
      tracesDir: path.join(WB_STORAGE_DIR, 'traces'),
      videosDir: path.join(WB_STORAGE_DIR, 'videos'),
      downloadsDir: path.join(WB_STORAGE_DIR, 'downloads'),
    }
  }

  return global.world
}

module.exports = globalSetup
