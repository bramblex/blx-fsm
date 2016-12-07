/**
 * Created by wolfman on 16-12-7.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var parser = require('./parser');
var json = JSON.stringify;

module.exports = function (source) {
  var _parser$parse = parser.parse(source),
      define = _parser$parse.define,
      start = _parser$parse.start,
      body = _parser$parse.body;

  return '\n  var Rule = require(\'blx-fsm\').Rule\n  module.exports = new Rule({\n    define: ' + json(define) + ',\n    start: ' + json(start) + ', \n    body: [' + body.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        first = _ref2[0],
        input = _ref2[1],
        second = _ref2[2];

    if (first instanceof RegExp) {
      return '[' + first.toString() + ', ' + json(input) + ', ' + json(second) + ']';
    } else {
      return '[' + json(first) + ', ' + json(input) + ', ' + json(second) + ']';
    }
  }).join(', ') + ']\n  })';
};