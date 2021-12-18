const { configsDir } = require('./paths')
const { runTask } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('./utils/envs/loadEnvs')

const env = process.env.NODE_ENV || 'local'

loadEnvs(env, [configsDir])
runTask({}, { env })
