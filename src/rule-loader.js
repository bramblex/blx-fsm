/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

const parser = require('./parser')
const json = JSON.stringify

module.exports = source => {
  const {define, start, body} = parser.parse(source)
  return `
  var Rule = require('blx-fsm').Rule
  module.exports = new Rule({
    define: ${json(define)},
    start: ${json(start)}, 
    body: [${body.map(([first, input, second]) => {
      if (first instanceof RegExp) {
        return `[${first.toString()}, ${json(input)}, ${json(second)}]`
      } else {
        return `[${json(first)}, ${json(input)}, ${json(second)}]`
      }
    }).join(', ')}]
  })`
}
