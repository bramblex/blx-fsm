/**
 * Created by brambles on 2016/11/29.
 */

module.exports = class FSMRuleAnalyzer {

  static isWild (state) {
    return /\*|\|/.test(state)
  }

  static isStateDefined (define, state) {
    return define.indexOf(state) >= 0
  }

  static matchedStates (define, wild) {
    return define.filter(
        item => RegExp(`^${wild.replace('*', '\w*')}$`)
    )
  }

  static validateRule (define, start, body) {

    const used_set = body
      .reduce((l, [first,, second]) => [...l, first, second], [])
      .reduce((l, state) => l.indexOf(state) >= 0 ? l : [...l, state], [])

    const unused_set = define.filter(state => used_set.indexOf(state) < 0)

    const can_reached_set = []
    function travel (state) {
      if (can_reached_set.indexOf(state) >= 0){
        return
      } else {
        can_reached_set.push(state)
        body
          .filter(([first]) => first === state)
          .forEach(([,,second]) => travel(second))
      }
      travel(start)
    }

    const cannt_reached_set =
      used_set.filter(state => can_reached_set.indexOf(state < 0))

    if (unused_set.length > 0 || cannt_reached_set > 0) {
      return {ok: false, unused_set, cannt_reached_set }
    } else {
      return {ok: true}
    }

  }
}
