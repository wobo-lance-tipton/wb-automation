# WB-Automation
Automated tests for OKR Canvas app via playwright

## Setup
```
git clone git@github.com:wobo-lance-tipton/wb-automation.git
cd ./wb-automation
npm install
```

## Configure Env Values
* Values files allow defining ENVs within a config file.
  * See `<rootDir>/configs/values.yml` for an example
* This allows overriding the default settings via a config without changing the code
* The name of the values file should follow one of the following pattern
  * `wba.yml`
  * `values-wba.yml`
  * `values-NODE_ENV.yml`
    * `NODE_ENV` will be replaced with the value of `process.env.NODE_ENV`
  * `values-wba-NODE_ENV.yml`
    * `NODE_ENV` will be replaced with the value of `process.env.NODE_ENV`
* Config files will be searched for in the following folders
  * `<rootDir>`
  * `<rootDir>/configs`
  * `process.env.WB_VALUES_PATH`
    * This ENV should be set to an absolute folder path containing the config file
  * `~/.kegConfig`
    * The keg-cli does not need to be installed to use this path
* **Notes**
  * The prefix `wba` is used to namespace this repo.
    * To change the prefix, edit `<rootDir>/tap.js => line 6`
  * The `NODE_ENV` is pulled from `process.env.NODE_ENV`
    * If not set it will default to `local`
  * The `<rootDir>/configs/values.yml` file is always loaded
    * Custom values files are expected to override the default `values.yml` file
* **Example**
  * Create a file named `values-qa.yml` in the `<rootDir>/configs` folder
  * Copy and paste the following content into the file
    ```yml
    env:
      WB_BASE_URL: https://canvasqa-okrcanvas.dt.wobo-int.com/
      WB_USER_EMAIL: "<QA User ID>" 
      WB_USER_PASS: "<QA User Password>"
      # Clean locally stored session data
      WB_STORAGE_CLEAN: true
      # Run the sticky add / remove process 2 times
      WB_STICKY_RUNS: 4
      # Wait ten minutes (600 seconds) between each sticky run
      WB_STICKY_WAIT: 600
      # Create 10 stickies each time the stickies process runs
      WB_STICKY_CREATES: 10
      WB_TEST_TIMEOUT: 2000
      WB_BROWSER_SPEED: 1000
      WB_CRON_TIME: "* */1 * * *"
    ```
  * Run the canvas task => `npm run canvas -- env=qa`
  * Using the above config and command the script will
    * Clear any locally stored session data
    * Run automation all browsers (chrome, firefox, webkit) concurrently
    * Navigate to the `https://canvasqa-okrcanvas.dt.wobo-int.com/`
    * Login, if needed
    * Open || create a new canvas if needed
    * Run the stickies flow *4 times*
      1. Create *10 stickies*
      2. Add text to one of the stickies
      3. Delete the *10 stickies* it just created
      * Wait *10 min*, and run just the above 3 steps **(stickies flow only)**
    * Once finished it will log the results `( success || fail )` for each browser
* If satisfied with the above example, it can then be used with the command `npm run cron -- env=qa`
  * This will use the `WB_CRON_TIME` env value to run a cron job the *first minute* of every hour
  * This emulates using the canvas app over an extended period of time within each browser

## Commands

### Canvas
* Runs playwright browser automation a single time, the exits the process
* Command => `npm run canvas -- option1=<value1> option2=<value2>`
* **Options**
  * url (**REQUIRED**)
    * default: `N/A`
    * example: `npm run canvas -- url=https//localhost:3000`
    * description : URL of the canvas application to test
    * ENV: `WB_BASE_URL`
  * browser
    * default: `all`
    * allowed: `all` | `chrome` | `chromium` | `firefox` | `ff` | `webkit` | `safari` | `wk`
    * example: `npm run canvas -- browser=chrome`
    * description: Name of the browser to run the test
    * ENV: `WB_BROWSER`
  * hide
    * default: `true`
    * example: `npm run canvas -- hide=false`
    * description: Run the borwser in headless mode
    * ENV: `WB_HEADLESS`
  * show
    * default: `false`
    * example: `npm run canvas -- show=true`
    * description: Run the browser in headless mode. Overrides headless option.
    * ENV: `WB_HEADED`
  * width
    * default: `1280`
    * example: `npm run canvas -- width=1440`
    * description: Width of the borwser when running in headed mode
    * ENV: `WB_BROWSER_WIDTH`
  * height
    * default: `720`
    * example: `npm run canvas -- height=940`
    * description: Height of the borwser when running in headed mode
    * ENV: `WB_BROWSER_WIDTH`
  * timeout
    * default: `2000`
    * example: `npm run canvas -- timeout=5000`
    * description: How long to wait until a test will timeout in milliseconds
    * ENV: `WB_TEST_TIMEOUT`
  * speed
    * default: `50`
    * example: `npm run canvas -- speed=100`
    * description: Speed at which the borwser is automated in milliseconds
    * ENV: `WB_BROWSER_SPEED`
  * sync
    * default: `false`
    * example: `npm run canvas -- sync=true`
    * description: Run browser tests synchronously, one browser after another
    * ENV: `WB_RUN_SYNC`
  * debug
    * default: `false`
    * example: `npm run canvas -- debug=true`
    * description: Run playwright in debug mode (false)
    * ENV: `WB_TEST_DEBUG`
  * storage
    * default: `(<rootDir>/temp`
    * example: `npm run canvas -- storage=/path/to/temp/storage/dir`
    * description: Location to store temporary files
    * ENV: `WB_STORAGE_DIR`
  * clean
    * default: `false`
    * example: `npm run canvas -- clean=true`
    * description: Cleans the temporary storage folder by deleting and recreating
    * ENV: `WB_STORAGE_CLEAN`
  * stickyRuns
    * default: `1`
    * example: `npm run canvas -- stickyRuns=4`
    * description: Number of times to run the sticky flow, before closing the browser
    * ENV: `WB_STICKY_RUNS`
  * stickyWait
    * default: `1` 
    * example: `npm run canvas -- stickyWait=5`
    * description: Time to wait between sticky runs in seconds
    * ENV: `WB_STICKY_WAIT`
  * env
    * default: `local` 
    * example: `npm run canvas -- env=staging`
    * description: Environment to run the task in, only sets the `NODE_ENV` if not already set
    * ENV: `NODE_ENV`

### Cron Job
* Sets up a cron job to run the browser automation over an extended period of time
* Command => `npm run cron -- option1=<value1> option2=<value2>`
* **Options**
  * time  (**REQUIRED**)
    * description: Cron time formatted string used to schedule the cron job
    * example: `npm run cron -- time=`
    * env: `WB_CRON_TIME`
  * browser
    * default: `all`
    * allowed: `all` | `chrome` | `chromium` | `firefox` | `ff` | `webkit` | `safari` | `wk`
    * example: `npm run canvas -- browser=chrome`
    * description: Name of the browser to run the test
    * ENV: `WB_BROWSER`
  * clean
    * default: `false`
    * example: `npm run canvas -- clean=true`
    * description: Cleans the temporary storage folder by deleting and recreating
    * ENV: `WB_STORAGE_CLEAN`
  * env
    * default: `local` 
    * example: `npm run cron -- env=staging`
    * description: Environment to run the task in, only sets the `NODE_ENV` if not already set
    * ENV: `NODE_ENV`

## Temp Storage
### Browser Session
* To allow authorization, the script is configured to persist session storage to disk
* This is consistent with how a browser works normally, but not default in **playwright**
* This data is saved to the customizable `storage` directory at the time the task is started
  * The default is `<rootDir>/temp`
  * Removing the content of this directory will force the browsers to login again when the process is run
### Video
* Every time the `canvas task` runs, a recording of the browser is captured
  * They are stored in the `/videos` subdirectory of the customizable `storage` directory at the time the task is started
    * The default is `<rootDir>/temp`