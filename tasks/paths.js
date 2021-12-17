const path = require('path')
const appRoot = path.join(__dirname, '../')
const testsDir = path.join(appRoot, './tests')
const containerDir = path.join(appRoot, './container')
const configsDir = path.join(appRoot, './configs')

module.exports = {
  appRoot,
  testsDir,
  configsDir,
  containerDir,
}
