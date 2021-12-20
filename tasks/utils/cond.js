const { either, noPropArr, toBool } = require('@keg-hub/jsutils')

const condArr = (opt1, condition, opt2 = noPropArr) => {
  return either(
    opt1,
    noPropArr,
    condition || (val1 => toBool(val1[val1.length - 1]))
  )
}

module.exports = {
  condArr,
}
