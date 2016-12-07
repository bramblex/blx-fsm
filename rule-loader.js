/**
 * Created by wolfman on 16-12-7.
 */
'use strict'

const parser = require('./parser')

module.exports = source => {
  return `module.exports = ${JSON.stringify(parser.parse(source))}`
}
