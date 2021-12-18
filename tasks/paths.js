const path = require('path')
const appRoot = path.join(__dirname, '../')
const tempDir = path.join(appRoot, './temp')
const testsDir = path.join(appRoot, './tests')
const configsDir = path.join(appRoot, './configs')

module.exports = {
  appRoot,
  tempDir,
  testsDir,
  configsDir,
}
