const selectors = {
  login: {
    form: {
      parent: `div.email.textInput`,
      email: `input#UserLogin_email`,
      continue: `input#continueBtn`,
      pass: `input#UserLogin_password`,
      signIn: `input#SigninBtn`,
    },
  },
  home: {
    main: {
      preview: `a[data-testid="canvas-preview-1"]`,
      new: `button.MuiButtonBase-root >> text=New OKR Canvas`,
    },
    modal: {
      blank: `button[data-value="Blank"]`,
      create: `button.MuiButtonBase-root >> text=Create`,
    },
  },
  canvas: {
    bar: {
      add: `div.MuiScopedCssBaseline-root div div div:nth-child(3) > button[type="button"]`,
      sticky: `div.MuiScopedCssBaseline-root div div div:nth-child(3) > div > [draggable="true"]`,
    },
    header: {
      name: `h1[data-testid="canvas-name"]`,
    },
    stage: {
      sticky: `main#stage > div > article`,
      text: `div[spellcheck="false"]`,
      delete: `main#stage > div[data-popper-placement="top"] button[name="delete"]`,
    },
  },
  session: {
    extend: `button[data-testid="timeout-extend"]`,
  },
}

module.exports = {
  selectors,
}
