const { configsDir } = require('./paths')
const { runTask } = require('@keg-hub/cli-utils')
const { loadEnvs } = require('./utils/envs/loadEnvs')
const { getNodeEnv } = require('./utils/envs/getNodeEnv')

const env = getNodeEnv()

loadEnvs(env, [configsDir, process.env.WB_VALUES_PATH])
runTask({}, { env })
