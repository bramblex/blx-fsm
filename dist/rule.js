/**
 * Created by wolfman on 16-12-7.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _set = function _set(obj, fileds, value) {
  var _obj = obj;
  for (var i = 0, l = fileds.length - 1; i < l; i++) {
    var filed = fileds[i];
    if (!_obj[filed]) {
      _obj[filed] = {};
    }
    _obj = _obj[filed];
  }
  _obj[fileds[fileds.length - 1]] = value;
};

module.exports = function Rule(_ref) {
  var define = _ref.define,
      start = _ref.start,
      body = _ref.body;

  _classCallCheck(this, Rule);

  var rules = {};
  body.forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 3),
        first = _ref3[0],
        input = _ref3[1],
        second = _ref3[2];

    if (first instanceof RegExp) {
      define.filter(function (state) {
        return first.test(state);
      }).forEach(function (_first) {
        _set(rules, [_first, input], second);
      });
    } else {
      _set(rules, [first, input], second);
    }
  });
  this.rules = rules;
  this.start = start;
};