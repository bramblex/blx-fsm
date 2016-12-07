/**
 * Created by wolfman on 16-11-26.
 */

'use strict'
const assert = require('assert')

const fs = require('fs')
const { Rule, FSM } = require('../')
const parser = require('../parser')

const rule = parser.parse(fs.readFileSync(__dirname + '/test.fsm', 'utf-8'))

const ruleLoader = require('../rule-loader')
const getRuleFromLoader = () => {
  let module = {}
  eval(ruleLoader(fs.readFileSync(__dirname + '/test.fsm', 'utf-8')))
  return module.exports
}

const fsm1 = new FSM(new Rule(rule))
const fsm2 = new FSM(new Rule({
  states: ['home', 'game', 'end', 'error'],
  start: 'home',
  body: [
    ['home', 'startGame', 'game'],
    ['game', 'endGame', 'end'],
    ['end', 'backHome', 'home'],
    [/.*/, 'getError', 'error']
  ]
}))
const fsm3 = new FSM(new Rule(getRuleFromLoader()))

fsm1.on('change', ([first, input, second])=>{
  console.log(`fsm1: ${first} (${input}) => ${second}`)
})

fsm2.on('change', ([first, input, second])=>{
  console.log(`fsm2: ${first} (${input}) => ${second}`)
})

fsm3.on('change', ([first, input, second])=>{
  console.log(`fsm3: ${first} (${input}) => ${second}`)
})

fsm1.start()
fsm2.start()
fsm3.start()

assert(fsm1.state === 'home')
assert(fsm2.state === 'home')
assert(fsm3.state === 'home')

fsm1.input('startGame')
fsm2.input('startGame')
fsm3.input('startGame')
assert(fsm1.state === 'game')
assert(fsm2.state === 'game')
assert(fsm3.state === 'game')

fsm1.input('endGame')
fsm2.input('endGame')
fsm3.input('endGame')
assert(fsm1.state === 'end')
assert(fsm2.state === 'end')
assert(fsm3.state === 'end')

fsm1.input('backHome')
fsm2.input('backHome')
fsm3.input('backHome')
assert(fsm1.state === 'home')
assert(fsm2.state === 'home')
assert(fsm3.state === 'home')

fsm1.input('getError')
fsm2.input('getError')
fsm3.input('getError')
assert(fsm1.state === 'error')
assert(fsm2.state === 'error')
assert(fsm3.state === 'error')

console.log('Test case accessed')

