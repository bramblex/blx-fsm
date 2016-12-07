/**
 * Created by wolfman on 16-11-26.
 */

"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var SimpleEventEmitter = function () {
    function SimpleEventEmitter() {
      _classCallCheck(this, SimpleEventEmitter);

      this.__events__ = {};
    }

    _createClass(SimpleEventEmitter, [{
      key: 'addListener',
      value: function addListener(event, listener) {
        if (!Array.isArray(this.__events__[event])) this.__events__[event] = [];
        this.__events__[event].push(listener);
        return this;
      }
    }, {
      key: 'addOnceListener',
      value: function addOnceListener(event, listener) {
        var _this = this;

        var once_listener = function once_listener() {
          listener.apply(_this);
          _this.removeListener(event, once_listener);
        };
        once_listener.source = listener;
        return this.addListener(event, once_listener);
      }
    }, {
      key: 'removeListener',
      value: function removeListener(event, listener) {
        if (!event) {
          this.__events__ = {};
        } else if (!listener && !!this.__events__[event]) {
          this.__events__[event] = [];
        } else {
          this.__events__[event] = this.__events__[event].filter(function (l) {
            return l === listener || l.source === listener;
          });
        }
        return this;
      }
    }, {
      key: 'emitEvent',
      value: function emitEvent(event, args) {
        var _this2 = this;

        var listeners = this.__events__[event] || [];
        listeners.forEach(function (listener) {
          listener.apply(_this2, args);
        });
        return this;
      }
    }, {
      key: 'emit',
      value: function emit(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.emitEvent(event, args);
      }
    }, {
      key: 'on',
      value: function on() {
        return this.addListener.apply(this, arguments);
      }
    }, {
      key: 'off',
      value: function off() {
        return this.removeListener.apply(this, arguments);
      }
    }, {
      key: 'once',
      value: function once() {
        return this.addOnceListener.apply(this, arguments);
      }
    }, {
      key: 'trigger',
      value: function trigger() {
        return this.emitEvent.apply(this, arguments);
      }
    }]);

    return SimpleEventEmitter;
  }();

  var FSMRuleError = function (_Error) {
    _inherits(FSMRuleError, _Error);

    function FSMRuleError(msg) {
      _classCallCheck(this, FSMRuleError);

      return _possibleConstructorReturn(this, (FSMRuleError.__proto__ || Object.getPrototypeOf(FSMRuleError)).call(this, msg));
    }

    return FSMRuleError;
  }(Error);

  var FSMRule = function () {
    function FSMRule(start_rule) {
      _classCallCheck(this, FSMRule);

      var start_regexp = /^\s*start (\w+)\s*$/;
      var rule_regexp = /^\s*([\w\*]+)\s*\(\s*(\w+)\s*\)\s*=>\s*(\w+)\s*$/;
      var wildcard_regexp = /\*/;

      var rules = {};

      var states = {};
      var inputs = {};
      var wildcard_rules = [];

      // Parse and handle normal rules

      for (var _len2 = arguments.length, raw_rules = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        raw_rules[_key2 - 1] = arguments[_key2];
      }

      for (var i = 0, l = raw_rules.length; i < l; i++) {
        var raw_rule = raw_rules[i];
        var line = i + 1;

        var current = void 0,
            input = void 0,
            next = void 0;

        if (typeof raw_rule === 'string') {
          if (!rule_regexp.test(raw_rule)) {
            throw new FSMRuleError('Cannot parse rule in "' + raw_rule + '" at line ' + line + '. The rules must like "current (input) => next"');
          }

          var _raw_rule$match = raw_rule.match(rule_regexp);

          var _raw_rule$match2 = _slicedToArray(_raw_rule$match, 4);

          current = _raw_rule$match2[1];
          input = _raw_rule$match2[2];
          next = _raw_rule$match2[3];
        } else if (Array.isArray(raw_rule)) {
          var _raw_rule = _slicedToArray(raw_rule, 3);

          current = _raw_rule[0];
          input = _raw_rule[1];
          next = _raw_rule[2];

          if (!(current && input && next)) {
            throw new FSMRuleError('Object type rule must have 3 prototype, current, input and next.');
          }
        } else if ((typeof raw_rule === 'undefined' ? 'undefined' : _typeof(raw_rule)) === 'object') {
          current = raw_rule.current;
          input = raw_rule.input;
          next = raw_rule.next;

          if (!(current && input && next)) {
            throw new FSMRuleError('Array type rule must hav 3 items. Example ["current", "input", "next"]');
          }
        } else {
          throw new FSMRuleError('Unexpected rule type at line ' + line);
        }

        if (wildcard_regexp.test(current)) {
          wildcard_rules.push({ current: current, input: input, next: next, raw_rule: raw_rule, line: line });
        } else {
          if (!rules[input]) {
            rules[input] = {};
          }
          rules[input][current] = next;
          states[current] = true;
        }
        states[next] = true;
        inputs[input] = true;
      }

      // Compile wildcard rules
      for (var _i = 0, _l = wildcard_rules.length; _i < _l; _i++) {
        var _wildcard_rules$_i = wildcard_rules[_i],
            _current = _wildcard_rules$_i.current,
            _input = _wildcard_rules$_i.input,
            _next = _wildcard_rules$_i.next,
            _raw_rule2 = _wildcard_rules$_i.raw_rule,
            _line = _wildcard_rules$_i.line;

        var wildcard_state_regexp = RegExp('^' + _current.replace('*', '\\w*') + '$');
        var matched_states = [];
        for (var state in states) {
          if (wildcard_state_regexp.test(state)) {
            matched_states.push(state);
          }
        }
        if (matched_states.length <= 0) {
          throw new FSMRuleError('Cannot match any state in "' + _raw_rule2 + '" at line ' + _line);
        }
        for (var _i2 = 0, _l2 = matched_states.length; _i2 < _l2; _i2++) {
          var _current2 = matched_states[_i2];
          if (!rules[_input]) {
            rules[_input] = {};
          }
          rules[_input][_current2] = _next;
        }
      }

      if (!start_regexp.test(start_rule)) throw new FSMRuleError('Cannot parse start rule "' + start_rule + '"');

      var _start_rule$match = start_rule.match(start_regexp),
          _start_rule$match2 = _slicedToArray(_start_rule$match, 2),
          start_state = _start_rule$match2[1];

      if (!states[start_state]) throw new FSMRuleError('Undefined state "' + start_state + '" in start rule "' + start_rule + '"');

      this.rules = rules;
      this.start_state = start_state;
      this.inputs = Object.keys(inputs);
      this.states = Object.keys(states);

      this.__validate__();
    }

    _createClass(FSMRule, [{
      key: '__validate__',
      value: function __validate__() {

        var rules = this.rules;
        var inputs = this.inputs;
        var states = this.states;
        var start_state = this.start_state;

        var states_closure = [];

        var nextStates = function nextStates(current_state) {
          var next_states = [];
          inputs.forEach(function (input) {
            var next_state = rules[input][current_state];
            if (!!next_state) next_states.push(next_state);
          });
          return next_states;
        };

        var checkGraph = function checkGraph(current_state) {
          if (states_closure.indexOf(current_state) >= 0) return;
          states_closure.push(current_state);
          nextStates(current_state).forEach(function (next_state) {
            checkGraph(next_state);
          });
        };

        checkGraph(start_state);

        var other_states = [];
        states.forEach(function (state) {
          if (states_closure.indexOf(state) < 0) other_states.push(state);
        });

        if (other_states.length > 0) throw new FSMRuleError('There is no transition from start state "' + start_state + '" to ' + other_states.map(function (s) {
          return '"' + s + '"';
        }).join(', ') + '. Please check your rules.');
      }
    }]);

    return FSMRule;
  }();

  var FSMRuntimeError = function (_Error2) {
    _inherits(FSMRuntimeError, _Error2);

    function FSMRuntimeError(code, msg) {
      _classCallCheck(this, FSMRuntimeError);

      var _this4 = _possibleConstructorReturn(this, (FSMRuntimeError.__proto__ || Object.getPrototypeOf(FSMRuntimeError)).call(this, msg));

      _this4.code = code;
      return _this4;
    }

    return FSMRuntimeError;
  }(Error);

  var FSM = function (_SimpleEventEmitter) {
    _inherits(FSM, _SimpleEventEmitter);

    function FSM(fsm_rule) {
      _classCallCheck(this, FSM);

      var _this5 = _possibleConstructorReturn(this, (FSM.__proto__ || Object.getPrototypeOf(FSM)).call(this));

      _this5.fsm_rule = fsm_rule;
      _this5.rules = _this5.fsm_rule.rules;
      _this5.state = null;
      return _this5;
    }

    _createClass(FSM, [{
      key: 'start',
      value: function start() {
        if (!!this.state) throw new FSMRuntimeError('FSM is already start');
        this.state = this.fsm_rule.start_state;
        this.emit('start', this.state);
        return this;
      }
    }, {
      key: 'input',
      value: function input(_input2) {
        if (!this.state) this.__throwError__(1, 'Cannot input before FSM start');

        this.emit('input', _input2);

        if (!this.rules[_input2] || !this.rules[_input2][this.state]) this.__throwError__(2, 'Unexpected input "' + _input2 + '" in state "' + this.state + '"');

        var current = this.state;
        var next = this.rules[_input2][this.state];

        var rule = { current: current, input: _input2, next: next };

        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        this.emit.apply(this, [current + '_leave', rule].concat(args));
        this.emit.apply(this, [current + '_to_' + next, rule].concat(args));
        this.state = next;
        this.emit.apply(this, ['change', rule].concat(args));
        this.emit.apply(this, [next + '_enter', rule].concat(args));

        return this;
      }
    }, {
      key: '__throwError__',
      value: function __throwError__(code, message) {
        var error = new FSMRuntimeError(code, message);
        if (!this.__events__['error'] || this.__events__['error'].length <= 0) throw error;else return this.emit('error', error);
      }
    }]);

    return FSM;
  }(SimpleEventEmitter);

  var FSMDebug = function (_FSM) {
    _inherits(FSMDebug, _FSM);

    function FSMDebug(fsm_rule) {
      _classCallCheck(this, FSMDebug);

      var _this6 = _possibleConstructorReturn(this, (FSMDebug.__proto__ || Object.getPrototypeOf(FSMDebug)).call(this, fsm_rule));

      if (!(fsm_rule instanceof FSMRule)) throw new FSMRuntimeError('Argument must instance of FSMRule class');

      _this6.on('start', function () {
        console.log('FSM start');
      });

      _this6.on('change', function (_ref) {
        var current = _ref.current,
            input = _ref.input,
            next = _ref.next;

        console.log(current + ' (' + input + ') => ' + next);
      });
      return _this6;
    }

    _createClass(FSMDebug, [{
      key: 'addListener',
      value: function addListener(event, listener) {
        var _this7 = this;

        var _ref2 = event.trim().match(/^(\w+)_enter$|^(\w+)_leave$|^(\w+)_to_(\w+)$/) || [],
            _ref3 = _toArray(_ref2),
            matches = _ref3.slice(1);

        if (matches.length <= 0 && event !== 'change' && event !== 'start' && event !== 'error') throw new FSMRuntimeError('Is event "' + event + '" a custom event? Please check it.');

        matches.filter(function (s) {
          return s;
        }).forEach(function (state) {
          if (_this7.fsm_rule.states.indexOf(state) < 0) throw new FSMRuntimeError('Event "' + event + '" has undefined state "' + state + '". Please check it.');
        });
        return _get(FSMDebug.prototype.__proto__ || Object.getPrototypeOf(FSMDebug.prototype), 'addListener', this).call(this, event, listener);
      }
    }]);

    return FSMDebug;
  }(FSM);

  var __exports__ = { SimpleEventEmitter: SimpleEventEmitter, FSMRule: FSMRule, FSM: FSM, FSMDebug: FSMDebug, FSMRuleError: FSMRuleError, FSMRuntimeError: FSMRuntimeError };

  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = __exports__;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return __exports__;
    });
  } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    window['BlxFSM'] = __exports__;
  }
})();
