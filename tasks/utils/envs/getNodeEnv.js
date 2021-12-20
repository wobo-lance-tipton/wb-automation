/**
 * Finds and sets the ENV NODE_ENV from the current process.env.NODE_ENV or passed in argument
 */
const getNodeEnv = () => {
  const found =
    process.env.NODE_ENV ||
    process.argv.reduce((found, arg) => {
      return arg.match(/^env=.*$/) ? arg.split('=').pop() : found
    }, false)

  process.env.NODE_ENV = found || 'local'

  return process.env.NODE_ENV
}

module.exports = {
  getNodeEnv,
}
