const { addToProcess } = require('./addToProcess')
const { loadConfigs } = require('@keg-hub/parse-config')
const { cli } = require('../../../tap')

const loadEnvs = (env, locations) => {
  const mergedEnvs = loadConfigs({
    env,
    locations,
    name: cli.link.name,
  })

  // Add the loaded envs to the current process.env
  addToProcess(mergedEnvs)

  return mergedEnvs
}

module.exports = {
  loadEnvs,
}
