const path = require('path')
const { appRoot, tempDir } = require('../tasks/paths')
const {
  WB_BASE_URL,
  WB_USER_EMAIL,
  WB_USER_PASS,
  WB_STORAGE_DIR=tempDir,
} = process.env


const globalSetup = () => {
  global.world = {
    app: {
      url: WB_BASE_URL,
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
}

module.exports = globalSetup
