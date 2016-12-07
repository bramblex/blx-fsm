/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

const parser = require('./parser')
const Rule = require('./rule')

module.exports = source => {
  return new Rule(parser.parser(source))
}
