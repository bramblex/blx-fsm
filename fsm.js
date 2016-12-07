/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

module.exports = class FSM extends require('./simple-eventemitter') {
  constructor (rule) {
    super()
    this.__rules__ = rule.rules
    this.__start__ =  rule.start
    this.state = null
  }

  start () {
    if (this.state)
      return this

    this.state = this.__start__
    this.emit('start', this.state)

    return this
  }

  input (input, ...args) {
    if (!this.state)
      return this

    const first = this.state
    const second = this.__rules__[first][input]
    const rule = [first, input, second]

    this.emit('input', rule, ...args)

    if (second) {
      this.emit(`${first}_leave`, rule, ...args)
      this.emit(`${first}_to_${second}`, rule, ...args)
      this.state = second
      this.emit(`change`, rule, ...args)
      this.emit(`${second}_enter`, rule, ...args)
    } else {
      this.emit('reject', rule, ...args)
    }

    return this
  }
}
