/**
 * Created by wolfman on 16-11-26.
 */

"use strict";

(() => {

  class SimpleEventEmitter {
    constructor(){
      if (!(this instanceof SimpleEventEmitter))
        throw new Error(`Uncaught TypeError: Failed to construct 'SimpleEventEmitter': Please use the 'new' operator`)
      this.__events__ = {}
    }

    addListener(event, listener){
      if (!Array.isArray(this.__events__[event]))
        this.__events__[event] = []
      this.__events__[event].push(listener)
      return this
    }

    addOnceListener(event, listener){
      const once_listener = () => {
        listener.apply(this)
        this.removeListener(event, once_listener)
      }
      once_listener.source = listener
      return this.addListener(event, once_listener)
    }

    removeListener(event, listener){
      if (!event) {
        this.__events__ = {}
      } else if (!listener && !!this.__events__[event]) {
        this.__events__[event] = []
      } else {
        this.__events__[event] = this.__events__[event].filter(l => l === listener || l.source === listener)
      }
      return this
    }

    emitEvent(event, args){
      const listeners = this.__events__[event] || []
      listeners.forEach(listener => {
        listener.apply(this, args)
      })
      return this
    }

    emit(event, ...args){ return this.emitEvent(event, args) }

    on(...arg){ return this.addListener(...arg) }

    off(...arg){ return this.removeListener(...arg) }

    once(...arg){ return this.addOnceListener(...arg) }

    trigger(...arg){ return this.emitEvent(...arg) }
  }

  class FSMRuleError extends Error {
    constructor(msg){
      super(msg)
      if (!(this instanceof FSMRuleError))
        throw new Error(`Uncaught TypeError: Failed to construct 'FSMRuleError': Please use the 'new' operator`)
    }
  }

  class FSMRule {
    constructor(start_rule, ...raw_rules) {
      if (!(this instanceof FSMRule))
        throw new Error(`Uncaught TypeError: Failed to construct 'FSMRule': Please use the 'new' operator`)

      const start_regexp = /^\s*start (\w+)\s*$/
      const rule_regexp = /^\s*([\w\*]+)\s*\(\s*(\w+)\s*\)\s*=>\s*(\w+)\s*$/
      const wildcard_regexp = /\*/

      const rules = {}

      const states = {}
      const inputs = {}
      const wildcard_rules = []

      // Parse and handle normal rules
      for (let i = 0, l = raw_rules.length; i < l; i++) {
        const raw_rule = raw_rules[i]
        const line = i + 1

        let current, input, next

        if (typeof raw_rule === 'string'){
          if (!rule_regexp.test(raw_rule)) {
            throw new FSMRuleError(`Cannot parse rule in "${raw_rule}" at line ${line}. The rules must like "current (input) => next"`)
          }
          [, current, input, next] = raw_rule.match(rule_regexp)
        } else if (Array.isArray(raw_rule)){
          [current, input, next] = raw_rule
          if (!(current && input && next)){
            throw new FSMRuleError(`Object type rule must have 3 prototype, current, input and next.`)
          }
        } else if (typeof raw_rule === 'object'){
          ({current, input, next} = raw_rule)
          if (!(current && input && next)){
            throw new FSMRuleError(`Array type rule must hav 3 items. Example ["current", "input", "next"]`)
          }
        } else {
          throw new FSMRuleError(`Unexpected rule type at line ${line}`)
        }

        if (wildcard_regexp.test(current)) {
          wildcard_rules.push({current, input, next, raw_rule, line})
        } else {
          if (!rules[input]) {
            rules[input] = {}
          }
          rules[input][current] = next
          states[current] = true
        }
        states[next] = true
        inputs[input] = true
      }

      // Compile wildcard rules
      for (let i = 0, l = wildcard_rules.length; i < l; i++) {
        const {current, input, next, raw_rule, line} = wildcard_rules[i]
        const wildcard_state_regexp =
            RegExp(`^${current.replace('*', '\\w*')}$`)
        const matched_states = []
        for (let state in states) {
          if (wildcard_state_regexp.test(state)) {
            matched_states.push(state)
          }
        }
        if (matched_states.length <= 0) {
          throw new FSMRuleError(`Cannot match any state in "${raw_rule}" at line ${line}`)
        }
        for (let i = 0, l = matched_states.length; i < l; i++) {
          const current = matched_states[i]
          if (!rules[input]) {
            rules[input] = {}
          }
          rules[input][current] = next
        }
      }

      if (!start_regexp.test(start_rule))
        throw new FSMRuleError(`Cannot parse start rule "${start_rule}"`)

      const [, start_state] = start_rule.match(start_regexp)

      if (!states[start_state])
        throw new FSMRuleError(`Undefined state "${start_state}" in start rule "${start_rule}"`)

      this.rules = rules
      this.start_state = start_state
      this.inputs = Object.keys(inputs)
      this.states = Object.keys(states)

      this.__validate__()
    }

    __validate__(){

      const rules = this.rules
      const inputs = this.inputs
      const states = this.states
      const start_state = this.start_state

      const states_closure = []

      const nextStates = current_state => {
        const next_states = []
        inputs.forEach(input => {
          const next_state = rules[input][current_state]
          if (!!next_state)
            next_states.push(next_state)
        })
        return next_states
      }

      const checkGraph = current_state => {
        if (states_closure.indexOf(current_state) >= 0)
          return
        states_closure.push(current_state)
        nextStates(current_state).forEach(next_state => {
          checkGraph(next_state)
        })
      }

      checkGraph(start_state)

      const other_states = []
      states.forEach(state => {
        if (states_closure.indexOf(state) < 0)
          other_states.push(state)
      })

      if (other_states.length > 0)
        throw new FSMRuleError(`There is no transition from start state "${start_state}" to ${other_states.map(s => `"${s}"`).join(', ')}. Please check your rules.`)
    }

  }

  class FSMRuntimeError extends Error {
    constructor(code, msg){
      super(msg)
      if (!(this instanceof FSMRuntimeError))
        throw new Error(`Uncaught TypeError: Failed to construct 'FSMRuntimeError': Please use the 'new' operator`)
      this.code = code
    }
  }

  class FSM extends SimpleEventEmitter {
    constructor(fsm_rule){
      super()
      if (!(this instanceof FSM))
        throw new Error(`Uncaught TypeError: Failed to construct 'FSM': Please use the 'new' operator`)
      this.fsm_rule = fsm_rule
      this.rules = this.fsm_rule.rules
      this.state = null
    }

    start(){
      if (!!this.state)
        throw new FSMRuntimeError('FSM is already start')
      this.state = this.fsm_rule.start_state
      this.emit('start', this.state)
      return this
    }

    input(input, ...args){
      if (!this.state)
        this.__throwError__(1, 'Cannot input before FSM start')

      this.emit(`input`, input)

      if (!this.rules[input] || !this.rules[input][this.state])
        this.__throwError__(2, `Unexpected input "${input}" in state "${this.state}"`)

      const current= this.state
      const next= this.rules[input][this.state]

      const rule = {current, input, next}
      this.emit(`${current}_leave`, rule, ...args)
      this.emit(`${current}_to_${next}`, rule, ...args)
      this.state = next
      this.emit(`change`, rule, ...args)
      this.emit(`${next}_enter`, rule, ...args)

      return this
    }

    __throwError__(code, message){
      const error = new FSMRuntimeError(code, message)
      if (!this.__events__['error'] || this.__events__['error'].length <= 0)
        throw error
      else
        return this.emit('error', error)
    }
  }

  class FSMDebug extends FSM {
    constructor(fsm_rule){
      super(fsm_rule)
      if (!(this instanceof FSMDebug))
        throw new Error(`Uncaught TypeError: Failed to construct 'FSMDebug': Please use the 'new' operator`)

      if (! (fsm_rule instanceof FSMRule))
        throw new FSMRuntimeError('Argument must instance of FSMRule class')

      this.on('start', ()=>{
        console.log('FSM start')
      })

      this.on('change', ({current, input, next}) => {
        console.log(`${current} (${input}) => ${next}`)
      })
    }

    addListener(event, listener){
      const [, ...matches] = event.trim().match(/^(\w+)_enter$|^(\w+)_leave$|^(\w+)_to_(\w+)$/) || []

      if (matches.length <= 0 && event !== 'change' && event !== 'start' && event !== 'error')
        throw new FSMRuntimeError(`Is event "${event}" a custom event? Please check it.`)

      matches.filter(s => s).forEach(state => {
        if (this.fsm_rule.states.indexOf(state) < 0)
          throw new FSMRuntimeError(`Event "${event}" has undefined state "${state}". Please check it.`)
      })
      return super.addListener(event, listener)
    }
  }

  const __exports__ = {SimpleEventEmitter, FSMRule, FSM, FSMDebug, FSMRuleError, FSMRuntimeError}

  if (typeof module === 'object' && module.exports){
    module.exports = __exports__
  } else if (typeof define === 'function' && define.amd){
    define(() => __exports__)
  } else if (typeof window === 'object') {
    window['BlxFSM'] = __exports__
  }

})()

