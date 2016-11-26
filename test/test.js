/**
 * Created by wolfman on 16-11-26.
 */

"use strict";
const assert = require('assert');

const {FSMRule, FSMDebug} = require('../dist/blx-fsm.js')

const rule = new FSMRule(
    'start home',
    'home (startGame) => game',
    'game (endGame) => end',
    'end (backHome) => home',
    '* (getError) => error'
)

const fsm = new FSMDebug(rule)

fsm.start()
assert(fsm.state === 'home')

fsm.input('startGame')
assert(fsm.state === 'game')

fsm.input('endGame')
assert(fsm.state === 'end')

fsm.input('backHome')
assert(fsm.state === 'home')

fsm.input('getError')
assert(fsm.state === 'error')

console.log('Test case accessed')
