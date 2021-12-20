const { Logger } = require('@keg-hub/cli-utils')

/**
 * Checks if the process.env.RUN_FROM_TASK exists
 * If it does not, then an error is logged and the process is exited
 * @exits
 *
 * @returns {Void}
 */
const wasRunFromTask = () => {
  if (process.env.RUN_FROM_TASK) return

  Logger.log(
    `${Logger.colors.red('[ERROR]')}`,
    `Can not run automation directly`
  )
  Logger.highlight(
    `\tRun the command`,
    `"npm run canvas"`,
    `to run browser automation`
  )
  process.exit(1)
}

module.exports = {
  wasRunFromTask,
}
