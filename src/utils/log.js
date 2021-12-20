const { Logger } = require('@keg-hub/cli-utils')

/**
 * Logs a message with the browser tag
 * @param {string} browser - Tag for the message
 * @param {string} message - Message to log
 * @param {string} [method=log] - Log method to call
 */
const Log = (browser, message, method = 'log') => {
  Logger[method](message ? `${browser} ${message}` : browser)
}

Log.highlight = (browser, start, ...rest) => {
  Logger.highlight(`${browser} ${start}`, ...rest)
}

module.exports = {
  Log,
}
