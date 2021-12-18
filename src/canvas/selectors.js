const selectors = {
  login: {
    form: {
      parent: 'div.email.textInput',
      email: `input#UserLogin_email`,
      continue: `input#continueBtn`,
      pass: `input#UserLogin_password`,
      signIn: `input#SigninBtn`,
    }
  },
  menu: {
    preview: 'a[data-testid="canvas-preview-1"]',
  },
  canvas: {
    bar: {
      add: 'div:nth-child(3) > button[type="button"]',
      sticky: 'div:nth-child(3) > div > [draggable="true"]',
    },
    header: {
      name: 'h1[data-testid="canvas-name"]',
    },
    stage: {
      sticky: 'main#stage > div > article',
      popper: 'main#stage > div[data-popper-placement="top"]',
      delete: 'button[name="delete"]'
    }
  }
}

module.exports = {
  selectors
}