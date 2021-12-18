const selectors = {
  canvas: {
    preview: 'a[data-testid="canvas-preview-1"]',
    name: 'h1[data-testid="canvas-name"]',
  }
}

const loadCanvas = async page => {
  await page.click(selectors.canvas.preview)
  return await page.waitForSelector(selectors.canvas.name)
}

module.exports = {
  loadCanvas
}