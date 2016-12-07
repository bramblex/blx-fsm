"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by wolfman on 16-12-7.
 */

module.exports = function () {
  function SimpleEventEmitter() {
    _classCallCheck(this, SimpleEventEmitter);

    this.__events__ = {};
  }

  _createClass(SimpleEventEmitter, [{
    key: "addListener",
    value: function addListener(event, listener) {
      if (!Array.isArray(this.__events__[event])) this.__events__[event] = [];
      this.__events__[event].push(listener);
      return this;
    }
  }, {
    key: "addOnceListener",
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
    key: "removeListener",
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
    key: "emitEvent",
    value: function emitEvent(event, args) {
      var _this2 = this;

      var listeners = this.__events__[event] || [];
      listeners.forEach(function (listener) {
        listener.apply(_this2, args);
      });
      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this.emitEvent(event, args);
    }
  }, {
    key: "on",
    value: function on() {
      return this.addListener.apply(this, arguments);
    }
  }, {
    key: "off",
    value: function off() {
      return this.removeListener.apply(this, arguments);
    }
  }, {
    key: "once",
    value: function once() {
      return this.addOnceListener.apply(this, arguments);
    }
  }, {
    key: "trigger",
    value: function trigger() {
      return this.emitEvent.apply(this, arguments);
    }
  }]);

  return SimpleEventEmitter;
}();