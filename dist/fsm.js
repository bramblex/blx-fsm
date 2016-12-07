/**
 * Created by wolfman on 16-12-7.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleEventEmitter = require('./simple-eventemitter');

module.exports = function (_SimpleEventEmitter) {
  _inherits(FSM, _SimpleEventEmitter);

  function FSM(rule) {
    _classCallCheck(this, FSM);

    var _this = _possibleConstructorReturn(this, (FSM.__proto__ || Object.getPrototypeOf(FSM)).call(this));

    _this.__rules__ = rule.rules;
    _this.__start__ = rule.start;
    _this.state = null;
    return _this;
  }

  _createClass(FSM, [{
    key: 'start',
    value: function start() {
      if (this.state) throw new Error('FSM is already started!');

      this.state = this.__start__;
      this.emit('start', this.state);

      return this;
    }
  }, {
    key: 'input',
    value: function input(_input) {
      if (!this.state) throw new Error('FSM cann\'t input before start!');

      var first = this.state;
      var second = this.__rules__[first][_input];
      var rule = [first, _input, second];

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.emit.apply(this, ['input', rule].concat(args));

      if (second) {
        this.emit.apply(this, [first + '_leave', rule].concat(args));
        this.emit.apply(this, [first + '_to_' + second, rule].concat(args));
        this.state = second;
        this.emit.apply(this, ['change', rule].concat(args));
        this.emit.apply(this, [second + '_enter', rule].concat(args));
      } else {
        this.emit.apply(this, ['reject', rule].concat(args));
      }

      return this;
    }
  }]);

  return FSM;
}(SimpleEventEmitter);