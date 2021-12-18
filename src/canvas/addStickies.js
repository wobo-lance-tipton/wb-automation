const removeSticky = async page => {
  console.log(`------- click sticky -------`)
  const stickyLoc = await page.locator('main#stage > div > article').last()
  stickyLoc.click()

  const menuPopLoc = await page.locator('main#stage > div[data-popper-placement="top"]')
  const deleteBtnLoc = await menuPopLoc.locator('button[name="delete"]')
  console.log(`------- click delete -------`)
  deleteBtnLoc.click()
}

const addStickies = async page => {

  await page.click('div:nth-child(3) > button[type="button"]');
  await page.click('div:nth-child(3) > div > [draggable="true"]');
  
  return new Promise((res, rej) => {
    try {
      console.log(`------- waiting 2 seconds -------`)
      setTimeout(async () => {
        console.log(`------- Removing stickies -------`)
        await removeSticky(page)
        await removeSticky(page)
        await removeSticky(page)
        res()
      }, 2000)
    }
    catch(err){
      console.log(err.stack)
      rej(err)
    }
  })
}

module.exports = {
  addStickies
}