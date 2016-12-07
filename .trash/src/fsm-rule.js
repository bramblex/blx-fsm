/**
 * Created by brambles on 2016/11/29.
 */

'use strict'

const _get = (obj, fileds) => {
  let _obj = obj;

  for (let i = 0, l = fileds.length - 1; i < l; i++){
    const filed = fileds[i]
    if (!!_obj[filed]) {
      _obj = _obj[filed]
    } else {
      return undefined
    }
  }

  return _obj[fileds[fileds.length - 1]]
}
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
const _json = (obj) => JSON.stringify(obj)

module.exports = class FSMRule {
  constructor({define, start, body}){
    // const rules = {}
    // body.forEach(rule_field => {
    //   const [first, input, second] = rule_field
    //
    //   if (first instanceof RegExp){
    //     define.filter(state => first.test(state)).forEach(_first => {
    //       this.__setRule__(rules, [_first, input, second], rule_field)
    //     })
    //   } else {
    //     this.__setRule__(rules, rule_field)
    //   }
    //
    // })

  }

  __validateState__(define, state, source) {
    if (!(state instanceof RegExp)) {
      if (!this.__validateState__(define, state)) {
        this.__throwRuleError__(`state "${state}" undefined`, source)
      }
    }
  }

  __validateRuleStates__ (define, body) {

    const used_state = []

    body.forEach(rule_field => {
      const [first, , second] = rule_field
      if (!(first instanceof RegExp)) {
        this.__validateState__(define, first, rule_field)
        used_state.push(first)
      }
      this.__validateState__(define, second, rule_field)
      used_state.push(second)
    })

    const unused_state = define.filter(state => used_state.indexOf(state) < 0)

    if (unused_state.length > 0) {
      this.__throwRuleError__(`states ${_json(unused_state)} defined but never used`)
    }

  }

  __validateRuleReached__ (define, start, rules) {
    const inputs = Object.keys(rules)

    const can_reached = []

    const travel =  first => {
      if (can_reached.indexOf(first) >= 0){
        return
      } else {
        can_reached.push(first)
        inputs.forEach(input => {
          const second = rules[input][first]
          if (!!second) {
            travel(second)
          }
        })
      }
    }

    const cannt_reached = define.filter(state => can_reached.indexOf(state) < 0)

    if (cannt_reached.length > 0) {
      this.__throwRuleError__(``)
    }
  }

  __setRule__ (rules, [first, input, second], source=[first, input, second]) {
    const exist = _get(rules, [input, first]);
    if (!!exist) {
      this.__throwRuleError__(`has conflicted rule field ${_json([first, input, exist])}`, source)
    } else {
      _set(rules, [input, first], second)
    }
  }

  __throwRuleError__(msg, rule_field) {
    throw new Error(
      `RuleError: ${msg} In rule field ${_json(rule_field)}`)
  }
}

// module.exports = class FSMRule
// module.exports = class FSMRuleAnalyzer {
//
//   static isWild (state) {
//     return /\*|\|/.test(state)
//   }
//
//   static isStateDefined (define, state) {
//     return define.indexOf(state) >= 0
//   }
//
//   static matchedStates (define, wild) {
//     return define.filter(
//         item => RegExp(`^${wild.replace('*', '\w*')}$`)
//     )
//   }
//
//   static validateRule (define, start, body) {
//
//     const used_set = body
//       .reduce((l, [first,, second]) => [...l, first, second], [])
//       .reduce((l, state) => l.indexOf(state) >= 0 ? l : [...l, state], [])
//
//     const unused_set = define.filter(state => used_set.indexOf(state) < 0)
//
//     const can_reached_set = []
//     function travel (state) {
//       if (can_reached_set.indexOf(state) >= 0){
//         return
//       } else {
//         can_reached_set.push(state)
//         body
//           .filter(([first]) => first === state)
//           .forEach(([,,second]) => travel(second))
//       }
//       travel(start)
//     }
//
//     const cannt_reached_set =
//       used_set.filter(state => can_reached_set.indexOf(state < 0))
//
//     if (unused_set.length > 0 || cannt_reached_set > 0) {
//       return {ok: false, unused_set, cannt_reached_set }
//     } else {
//       return {ok: true}
//     }
//
//   }
// }
