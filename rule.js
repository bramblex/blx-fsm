/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

const _set = (obj, fileds, value) => {
  let _obj = obj;
  for (let i = 0, l = fileds.length - 1; i < l; i++){
    const filed = fileds[i]
    if (!_obj[filed]) {
      _obj[filed] = {}
    }
    _obj = _obj[filed]
  }
  _obj[fileds[fileds.length - 1]] = value
}

module.exports = class Rule {
  constructor ({states, start, body}) {
    const rules = {}
    body.forEach(([first, input, second]) => {
      if (first instanceof RegExp) {
        states.filter(state => first.test(state)).forEach(_first => {
          _set(rules, [_first, input], second)
        })
      } else {
        _set(rules, [first, input], second)
      }
    })
    this.rules = rules
    this.start = start
  }
}
