/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

const SimpleEventEmitter = require('./simple-eventemitter')

module.exports = class FSM extends SimpleEventEmitter {
  constructor (rule) {
    super()
    this.__rules__ = rule.rules
    this.__start__ =  rule.start
    this.state = null
  }

  start () {
    if (this.state)
      throw new Error('FSM is already started!')

    this.state = this.__start__
    this.emit('start', this.state)

    return this
  }

  input (input, ...args) {
    if (!this.state)
      throw new Error('FSM cann\'t input before start!')

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
