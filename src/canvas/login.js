const { noOpObj } = require('@keg-hub/jsutils')

const selectors = {
  login: {
    form: 'div.email.textInput',
    email: `input#UserLogin_email`,
    continue: `input#continueBtn`,
    pass: `input#UserLogin_password`,
    signIn: `input#SigninBtn`,
  }
}

const login = async (context, pwConf=noOpObj) => {
  if(!context) throw new Error(`Browser context is required to login`)

  const page = await context.newPage()
  if(!page) throw new Error(`Browser page could not be created`)

  await page.goto(world.app.url)
  const url = await page.url()

  if(world.app.url === url) return { page }

  await page.waitForSelector(selectors.login.form)
  await page.click(selectors.login.form)
  await page.fill(selectors.login.email, world.user.email)
  await page.click(selectors.login.continue)
  await page.waitForSelector(selectors.login.pass)
  await page.fill(selectors.login.pass, world.user.pass)
  await page.click(selectors.login.signIn)

  return {
    page
  }
}


module.exports = {
  login
}