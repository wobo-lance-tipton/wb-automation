const fs = require('fs')
const path = require('path')
const { Logger } = require('@keg-hub/cli-utils')
const { configsDir, tempDir } = require('../tasks/paths')
const { loadEnvs } = require('../tasks/utils/envs/loadEnvs')

/**
 * Helper script to clean the temp directory where the browser context info is stored
 * Deletes the temp folder, then recreates it, and required sub-folders
 */
;(() => {
  loadEnvs(process.env.NODE_ENV || 'local', [configsDir])
  const { WB_STORAGE_DIR=tempDir } = process.env

  Logger.empty()
  Logger.highlight(`Cleaning temp dir`, tempDir)
  fs.rmdirSync(tempDir, { recursive: true })

  fs.mkdirSync(tempDir)
  fs.mkdirSync(path.join(WB_STORAGE_DIR, 'traces'))
  fs.mkdirSync(path.join(WB_STORAGE_DIR, 'videos'))
  fs.mkdirSync(path.join(WB_STORAGE_DIR, 'downloads'))
  fs.writeFileSync(path.join(WB_STORAGE_DIR, '.keep'), '')

  Logger.empty()
  Logger.log(`  ${Logger.colors.green(`✔ SUCCESS`)} - Finished cleaning temp dir`)
  Logger.empty()
})()